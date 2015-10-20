'use strict';

var express = require('express'),
    app = express(),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    env = process.env.NODE_ENV || 'development',
    config = require('./config/config.js'),
    ConnectMongo = require('connect-mongo')(session),
    mongoose = require('mongoose').connect(config.dbURL),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

if (env === 'development') {
    app.use(session({ secret: config.sessionSecret }));
} else {
    app.use(session({
        secret: config.sessionSecret,
        store: new ConnectMongo({
            // jscs:disable
            mongoose_connection: mongoose.connections[0],
            // jscs:enable
            stringify: true
        })
    }));
}

require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);
require('./routes/routes')(express, app);

app.listen(3500, function() {
    console.log('ChatCAT working on port 3000');
    console.log('Mode:', env);
});