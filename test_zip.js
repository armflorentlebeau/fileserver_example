var zlib = require('zlib');
var fs = require('fs');
var gzip = zlib.createGzip({level: parseInt(process.argv[3])});
var r = fs.createReadStream(process.argv[2]);
var w = fs.createWriteStream(process.argv[2]+'.gz');
r.pipe(gzip).pipe(w);
