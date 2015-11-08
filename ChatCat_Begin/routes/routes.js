'use strict';

module.exports = function(express, app, passport, config, rooms) {
	var router = express.Router();

	router.get('/', function(req, res) {
		res.render('index', { title: 'Welcome to ChatCAT' });
	});

	function securePages(req, res, next) {
		if (req.isAuthenticated()) {
			// user is logged in, allow route to continue
			next();
		} else {
			// user is not logged in, redirect to login
			res.redirect('/');
		}
	}

	function findTitle(roomId) {
		var i = 0;
		while (i < rooms.length) {
			if (+rooms[i].roomNumber === +roomId) {
				return rooms[i].roomName;
				break;
			} else {
				i++;
				continue;
			}
		}
	}

	// redirects to facebook login page
	router.get('/auth/facebook', passport.authenticate('facebook'));

	// facebook returns access to app via this url
	router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/chatrooms',
		failureRedirect: '/'
	}));

	// this page is secured. logged out users will be  redirected to login page.
	router.get('/chatrooms', securePages, function(req, res) {
		res.render('chatrooms', { title: 'Chatrooms', user: req.user, config: config });
	});

	router.get('/room/:id', securePages, function(req, res, next) {
		var roomName = findTitle(req.params.id);
		res.render('room', { user: req.user, roomNumber: req.params.id, config: config, roomName: roomName });;
	});

	router.get('/logout', function(req, res, next) {
		req.logout();
		res.redirect('/');
	});

	app.use('/', router);
};