var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var zlib = require('zlib');

// Timers
const { performance } = require('perf_hooks');

// Web server config
var hostname ='localhost';
var port = 8080;

server = http.createServer(function (req, res) {
  const dirCont = fs.readdirSync(__dirname);

  if (req.url == '/fileupload') {
    // File upload
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var input = files.filetoupload.filepath;
      var output = files.filetoupload.originalFilename;

      // Rename the file is a file with the same name is stored
      var regex = output+'*'
      var files = dirCont.filter( ( elm ) => elm.match(regex));
      if ( files.length > 0 ) {
        console.log("File with the same name found, renaming...");
        output = output + "_" + files.length;
      }

      // Zip file
      //var startTime = performance.now();
      var gzip = zlib.createGzip();
      var r = fs.createReadStream(input);
      var w = fs.createWriteStream(__dirname + '/' + output + '.gz');
      r.pipe(gzip).pipe(w);
      //var endTime = performance.now();
      //var elapsed = endTime - startTime;

      // Remove original file
      fs.unlinkSync(input);

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<p>File was successfully uploaded in ' + output + '.gz!</p>');
      //res.write('<p>File was successfully uploaded in ' + output + '.gz and took ' + elapsed.toFixed(6) + ' s</p>');
      res.write('<a href="/" >Back</a>');
      res.end();
    });
  } else {
    if (req.url == '/') {
      // Main page
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<h1>My web file server</h1>')
      res.write('<ul>')
      var files = dirCont.filter( ( elm ) => elm.match(/.*\.gz/ig));
      if ( files.length == 0 ) {
        res.write('<li>No file found</li>')
      } else {
        for (let i = 0; i < files.length; i++) {
          res.write('<li><a href="' + files[i] + '">' + files[i] + '</a> [' + parseFloat(fs.statSync(files[i]).size / 1024).toFixed(3) + ' kB]</li>')
        }
      }
      res.write('</ul>')
      res.write('<p>Upload file:</p>')
      res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
      res.write('<input type="file" name="filetoupload"><br><br>');
      res.write('<input type="submit">');
      res.write('</form>');
      return res.end();
    } else {
      // Download resulting file
      fs.readFile(__dirname + req.url, function (err,data) {
        if (err) {
          res.writeHead(400, {'Content-type':'text/html'})
          console.log(err);
          res.end();
        } else {
          //specify Content will be an attachment
          res.setHeader('Content-disposition', 'attachment; filename="'+ req.url +'"');
          res.end(data);
        }
      });
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

