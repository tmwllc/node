'use strict';

module.exports = function(express, app) {
    var router = express.Router();

    router.get('/', function(req, res) {
        res.render('index', { title: 'Welcome to ChatCAT' });
    });

    router.get('/chatrooms', function(req, res) {
        res.render('chatrooms', { title: 'Chatrooms' });
    });

    router.get('/setcolor', function(req, res) {
        req.session.favColor = 'Red';
        res.send('Setting favorite color!');
    });

    router.get('/getcolor', function(req, res) {
        res.send('Favorite color: ' + (!req.session.favColor ? 'Not Found' : req.session.favColor));
    });

    app.use('/', router);
};