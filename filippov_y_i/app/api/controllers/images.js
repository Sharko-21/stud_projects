const fs = require('fs');
const path = require('path');
const multer = require('multer');
const gm = require('gm').subClass({imageMagick: true});
const db = require('../../lib/db');
const sql = require('../../sql');
const errorHandler = require("./../../lib/errors").errorHandler;

const upload = multer({
    dest: "/var/app/static/img/storage"
});

function init(app) {
    app.post("/musician/image/:id", upload.single("file"), (req, res) => {
        const tempPath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();
        return Promise.resolve().then(() => {
            return db.tx(async tx => {
                if (ext === ".png") {
                    return tx.one(sql.image.insert)
                        .then(image => tx.none(sql.musician.updateImage, {
                                id: req.params.id,
                                imageID: image.id,
                            }).then(() =>
                                fs.rename(tempPath, path.join(`/var/app/static/img/storage/${image.id}${ext}`), err => {
                                    if (err) throw new Error(err.message)
                                })
                            )
                        );
                } else {
                    throw new Error("Only .png and .jpg files are allowed!");
                }
            }).then(() => res.send("ok"));
        }).catch(e => {
            fs.unlink(tempPath, err => {});
            errorHandler(res)(e)
        });
    })
}

module.exports = {
    init
};