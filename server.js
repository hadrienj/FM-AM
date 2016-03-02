var app = require('http').createServer(handler),
  fs = require('fs'),
  static = require('node-static');



// handle web server
function handler (req, res) {
  fs.readFile(__dirname + '/modulations.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading client.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

// creating the server ( localhost:8000 )
app.listen(8000);


// Create a node-static server instance to serve the './static' folder
var staticFiles = new static.Server('./statics');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        staticFiles.serve(request, response);
    }).resume();
}).listen(8080);
