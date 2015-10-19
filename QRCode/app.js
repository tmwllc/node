var qrImage = require('qr-image'),
    fs = require('fs');

qrImage
    .image('http://nodejs.org', {
        type: 'png',
        size: 20
    })
    .pipe(fs.createWriteStream('MyQRCode.png'));