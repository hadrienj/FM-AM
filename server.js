var app = require('http').createServer(handler),
  fs = require('fs'),
  static = require('node-static');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// handle web server
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading client.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

app.listen(port);


// Create a node-static server instance to serve the './static' folder
var staticFiles = new static.Server('./statics');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        staticFiles.serve(request, response);
    }).resume();
}).listen(port);
