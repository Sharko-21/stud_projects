const views = require("./views");
const images = require("./images");
const api = require("./api");

function init(app) {
    api.init(app);
    views.init(app);
    images.init(app);
}

module.exports = {
    init
};