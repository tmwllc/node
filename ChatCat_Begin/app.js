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
	FacebookStrategy = require('passport-facebook').Strategy,
	server,
	io,
	rooms = [],
	PORT = process.env.PORT || config.port,
	sessionObject = {
		secret: config.sessionSecret
	};

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

if (env !== 'development') {
	session.store = new ConnectMongo({
		// jscs:disable
		mongoose_connection: mongoose.connections[0],
		// jscs:enable
		stringify: true
	});
}
app.use(session(sessionObject));

app.use(passport.initialize());
app.use(passport.session());

require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);
require('./routes/routes')(express, app, passport, config, rooms);

app.set('port', PORT);

server = require('http').createServer(app);
io = require('socket.io').listen(server);
require('./socket/socket.js')(io, rooms);

 server.listen(app.get('port'), function() {
	console.log('ChatCAT on Port:', app.get('port'));
 })