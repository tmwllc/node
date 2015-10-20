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
    userSchema = mongoose.Schema({
        username: String,
        password: String,
        fullname: String
    }),
    Person = mongoose.model('users', userSchema),
    john = new Person({
        username: 'johndoe',
        password: 'johnwantstologin',
        fullname: 1
    });

john.save(function(err) {
    if (err) {
        console.log('Error attempting to save user:', err);
    }
    console.log('Done!');
});

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

require('./routes/routes')(express, app);

app.listen(3000, function() {
    console.log('ChatCAT working on port 3000');
    console.log('Mode:', env);
});