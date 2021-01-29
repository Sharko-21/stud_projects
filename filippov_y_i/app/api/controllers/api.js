const sql = require('../../sql');
const db = require('../../lib/db');
const sqlHelpers = require('../../lib/sqlHelpers');
const search = require('../../lib/search');
const md5 = require('md5');

function init(app) {
    app.get("/search", async (req, res) => {
        let result;
        let errNo = 0;
        switch (req.query.type) {
            case "ensemble":
                result = await search.ByEnsemble(req.query.filters);
                break;
            case "musician":
                result = await search.ByMusician(req.query.filters);
                break;
            case "composition":
                result = await search.ByComposition(req.query.filters);
                break;
            case "plate":
                result = await search.ByPlate(req.query.filters);
                break;
            default:
                errNo = 1;
                break;
        }
        res.send(JSON.stringify({
            errNo: errNo,
            response: result
        }));
    });

    app.get("/ensemble/:id/compositions", async (req, res) => {
        let result = {errNo: 0, response: []};
        try {
            let compositions = await db.manyOrNone(sql.composition.findByEnsembleID, {
                id: req.params.id,
            });
            if (compositions.length > 0) {
                result.response = compositions;
            }
            return res.send(JSON.stringify(result));
        } catch (e) {
            console.log(e);
            if (e.received === 0) {
                return res.send(JSON.stringify(result));
            }
            result.errNo = 1;
            return res.send(JSON.stringify(result));
        }
    });

    app.get("/compositions", async (req, res) => {
        let result = {errNo: 0, response: []};
        try {
            let compositions = await db.manyOrNone(sql.composition.findByIDs, {
                id: sqlHelpers.arrayToSqlIn([req.query.ids])
            });
            if (compositions.length > 0) {
                result.response = compositions;
            }
            return res.send(JSON.stringify(result));
        } catch (e) {
            if (e.received === 0) {
                return res.send(JSON.stringify(result));
            }
            result.errNo = 1;
            return res.send(JSON.stringify(result));
        }
    });

    app.get("/ensemble/:id/musicians", async (req, res) => {
        let result = {errNo: 0, response: []};
        try {
            let musicians = await db.manyOrNone(sql.musician.findByEnsembleID, {
                id: req.params.id,
            });
            if (musicians.length > 0) {
                result.response = musicians;
            }
            return res.send(JSON.stringify(result));
        } catch (e) {
            if (e.received === 0) {
                return res.send(JSON.stringify(result));
            }
            result.errNo = 1;
            return res.send(JSON.stringify(result));
        }
    });

    app.get("/ensemble/:id/plates", async (req, res) => {
        let result = {errNo: 0, response: []};
        try {
            let plates = await db.manyOrNone(sql.plate.findByEnsembleID, {
                id: req.params.id,
            });
            if (plates.length > 0) {
                result.response = plates;
            }
            return res.send(JSON.stringify(result));
        } catch (e) {
            if (e.received === 0) {
                return res.send(JSON.stringify(result));
            }
            result.errNo = 1;
            return res.send(JSON.stringify(result));
        }
    });

    app.post("/plate/:id/buy", async (req, res) => {
        let result = {errNo: 0, response: []};
        return db.tx(async tx => {
            tx.none(sql.plate.buy, {
                plateID: req.params.id
            }).then(() => {
                res.send(JSON.stringify(result));
            });
        }).catch(e => {
            result.errNo = 1;
            res.send(result);
        });
    });

    app.post("/plate", async (req, res) => {
        if (!req.session.isAdmin) {
            res.status(401);
            return res.send("Invalid session");
        }
        let result = {errNo: 0, response: []};
        try {
            if (req.body.id !== 0) {
                await db.none(sql.plate.update, req.body);
            } else {
                await db.none(sql.plate.create, req.body);
            }
            return res.send(JSON.stringify(result));
        } catch (e) {
            console.log(e);
            result.errNo = 1;
            return res.send(JSON.stringify(result));
        }
    });

    app.post("/ensemble", async (req, res) => {
        if (!req.session.isAdmin) {
            res.status(401);
            return res.send("Invalid session");
        }
        let result = {errNo: 0, response: []};
        try {
            if (req.body.id !== 0) {
                await db.none(sql.ensemble.update, req.body);
            } else {
                await db.none(sql.ensemble.create, req.body);
            }
            return res.send(JSON.stringify(result));
        } catch (e) {
            result.errNo = 1;
            return res.send(JSON.stringify(result));
        }
    });

    app.post("/login", async (req, res) => {
        let result = {errNo: 0, response: []};
        try {
            let admin = await db.one(sql.admin.findByEmail, {
                email: req.body.email
            });

            if (admin.password === md5(req.body.password)) {
                req.session.isAdmin = true;
            } else {
                result.errNo = 1;
            }
            return res.send(JSON.stringify(result));
        } catch (e) {
            result.errNo = 1;
            console.log(e);
            return res.send(JSON.stringify(result));
        }
    });

    app.get("/logout", async (req, res) => {
        let result = {errNo: 0, response: []};
        req.session.isAdmin = false;
        res.send(JSON.stringify(result));
    });

    app.post("/plate_composition", async (req, res) => {
        if (!req.session.isAdmin) {
            res.status(401);
            return res.send("Invalid session");
        }
        console.log(req.body);
        let result = {errNo: 0, response: 0};
        try {
            let compositionId = await db.one(sql.plate.addCompositionByName, req.body);
            if (!compositionId || compositionId === 0) {
                result.errNo = 1;
            }
            result.response = compositionId;
            return res.send(JSON.stringify(result));
        } catch (e) {
            result.errNo = 1;
            console.log(e);
            return res.send(JSON.stringify(result));
        }
    });
    app.delete("/plate_composition", async (req, res) => {
        if (!req.session.isAdmin) {
            res.status(401);
            return res.send("Invalid session");
        }
        console.log(req.body);
        let result = {errNo: 0, response: 0};
        try {
            await db.none(sql.plate.deleteCompositionFromPlateByID, req.body);
            return res.send(JSON.stringify(result));
        } catch (e) {
            result.errNo = 1;
            console.log(e);
            return res.send(JSON.stringify(result));
        }
    });
}

module.exports = {
    init
};