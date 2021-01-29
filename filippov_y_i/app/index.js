process.env.NODE_ENV = process.env.NODE_ENV || "development";

const express  = require('express');
const api = require('./api/api.js');

console.log("Starting...");
let app = express();
api.middleware.init(app);
api.controllers.init(app);

app.listen(80);
console.log("App is started...");