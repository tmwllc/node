'use strict';
var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    host = '127.0.0.1',
    port = '9000',
    mimes = {
        '.htm': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.jpg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif'
    };
http.createServer(function(req, res) {
    var filePath = (req.url === '/') ? './index.htm' : '.' + req.url,
        contentType = mimes[path.extname(filePath)];

    fs.exists(filePath, function(fileExists) {
        if (fileExists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    res.writeHead(500);
                    res.end();
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                }
            });
        } else {
            res.writeHead(404);
            res.end('Sorry we could not find the file requested');
        }
    });
}).listen(port, host, function() {
    console.log('Server running on http://' + host + ':' + port);
});
