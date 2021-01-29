const bodyParser = require('body-parser');
const express  = require('express');
const session = require('express-session');


function init(app) {
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));
    app.use('/static', express.static(process.cwd() + '/static'));
    app.set('trust proxy', 1);// trust first proxy
    app.use( session({
            secret : 'someSecret23434',
            name : 'sessionId',
        })
    );
}

module.exports = {
    init
};