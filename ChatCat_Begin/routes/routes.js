'use strict';

module.exports = function(express, app, passport, config) {
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

	router.get('/logout', function(req, res, next) {
		req.logout();
		res.redirect('/');
	});

	app.use('/', router);
};