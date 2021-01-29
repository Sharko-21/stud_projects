const db = require('../../lib/db');
const sqlHelpers = require('../../lib/sqlHelpers');
const sql = require('../../sql');
const jade = require('jade');
const fs = require('fs');
const path = require('path');

const views = {};

function init(app) {
    loadViews();

    app.get("/", (req, res) => {
        res.send(jade.render(views.home, {
            filename: path.join('/var/app/static/views/index.jade'),
            isAdmin: req.session.isAdmin || false
        }));
    });

    app.get("/musician/:id", async (req, res) => {
        try {
            let musician = await db.one(sql.musician.findByID, {
                id: req.params.id
            });
            res.send(jade.render(views.musician, {
                name: musician.name,
                date: new Date(musician.date),
                description: musician.description,
                image: musician.image,
                filename: path.join('/var/app/static/views/index.jade'),
                isAdmin: req.session.isAdmin || false
            }));
        } catch (e) {
            res.send("Something went wrong...");
        }
    });

    app.get("/ensemble/:id", async (req, res) => {
        try {
            let ensemble = await db.one(sql.ensemble.findByIDs, {
                ids: sqlHelpers.arrayToSqlIn([req.params.id])
            });
            res.send(jade.render(views.ensemble, {
                id: ensemble.id,
                name: ensemble.name,
                description: ensemble.description,
                type: ensemble.type,
                filename: path.join('/var/app/static/views/index.jade'),
                isAdmin: req.session.isAdmin || false
            }));
        } catch (e) {
            if (e.received === 0) {
                res.send("Такой ансамбль не найден...");
                return;
            }
            res.send("Something went wrong...");
        }
    });

    app.get("/composition/:id", async (req, res) => {
        try {
            let composition = await db.one(sql.composition.findByIDs, {
                ids: sqlHelpers.arrayToSqlIn([req.params.id])
            });
            if (composition.length === 0) {
                res.send("Такая композиция не найдена...");
                return;
            }
            res.send(jade.render(views.composition, {
                id: composition.id,
                name: composition.name,
                description: composition.description,
                date: composition.date,
                filename: path.join('/var/app/static/views/composition.jade'),
                isAdmin: req.session.isAdmin || false
            }));
        } catch (e) {
            if (e.received === 0) {
                res.send("Такая композиция не найдена...");
                return;
            }
            res.send("Something went wrong...");
        }
    });

    app.get("/plate/:id", async (req, res) => {
        try {
            let plate = await db.one(sql.plate.findByIDs, {
                ids: sqlHelpers.arrayToSqlIn([req.params.id])
            });
            let compositions = await db.manyOrNone(sql.composition.findByPlateID, {
                id: plate.id,
            });
            if (plate.length === 0) {
                res.send("Такая плстинка не найдена...");
                return;
            }
            res.send(jade.render(views.plate, {
                id: plate.id,
                name: plate.name,
                description: plate.description,
                date: plate.date,
                producedBy: plate.producedBy,
                retailPrice: plate.retailPrice,
                filename: path.join('/var/app/static/views/plate.jade'),
                isAdmin: req.session.isAdmin || false,
                compositions: compositions || []
            }));
        } catch (e) {
            console.log(e);
            if (e.received === 0) {
                res.send("Такая плстинка не найдена...");
                return;
            }
            res.send("Something went wrong...");
        }
    });
}

function loadViews() {
    let viewsPath = [
        "/var/app/static/views/home.jade",
        "/var/app/static/views/musician.jade",
        "/var/app/static/views/ensemble.jade",
        "/var/app/static/views/composition.jade",
        "/var/app/static/views/plate.jade",
    ];
    viewsPath.forEach(viewPath => {
        let path = viewPath.split('/');
        let filename = path[path.length - 1].split('.');
        fs.readFile(viewPath, (err, data) => {
            if (!err) {
                views[filename[0]] = data;
            } else {
                console.log(err);
            }
        })
    });
}


module.exports = {
    init
};