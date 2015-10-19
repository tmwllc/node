'use strict';
var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    host = '127.0.0.1',
    port = '9000',
    mimeTypes = {
        '.htm': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.jpg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif'
    };
http.createServer(function(req, res) {
    var filePath = (req.url === '/') ? './index.htm' : '.' + req.url,
        contentType = mimeTypes[path.extname(filePath)];

    fs.exists(filePath, function(fileExists) {
        var streamFile;
        if (fileExists) {
            res.writeHead(200, { 'Content-Type': contentType });
            streamFile = fs.createReadStream(filePath).pipe(res);

            streamFile.on('error', function() {
                res.writeHead(500);
                res.end();
            });
        } else {
            res.writeHead(404);
            res.end('Sorry we could not find the file requested');
        }
    });
}).listen(port, host, function() {
    console.log('Server running on http://' + host + ':' + port);
});
