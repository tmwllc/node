'use strict';

module.exports = function(passport, FacebookStrategy, config, mongoose) {
	var chatUser = new mongoose.Schema({
			profileId: String,
			fullName: String,
			profilePic: String
		}),
		UserModel = mongoose.model('chatuser', chatUser);

	passport.serializeUser(function(user, done) {
		// user.id is the unique id that mongodb assigns to the record
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		UserModel.findById(id, function(err, user) {
			if (user) {
				done(err, user);
			}
		});
	});

	passport.use(new FacebookStrategy({
		clientID: config.fb.appId,
		clientSecret: config.fb.appSecret,
		callbackURL: config.fb.callbackUrl,
		profileFields: ['id', 'displayName', 'photos']
	}, function(accessToken, refreshToken, profile, done) {
		// check if user exists in mongodb
		// if not, create one and return the profile
		// if the user exists, return the profile
		UserModel.findOne({'profileId': profile.id }, function(err, result) {
			var newChatUser;

			if (result) {
				done(null, result);
			} else {
				// create new user
				newChatUser = new UserModel({
					profileId: profile.id,
					fullName: profile.displayName,
					profilePic: profile.photos[0].value || ''
				});
				newChatUser.save(function(err) {
					if (err) {
						console.log(err);
					}
					done(null, newChatUser);
				});
			}
		});
	}));
};