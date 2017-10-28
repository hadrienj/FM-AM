var app = require('http').createServer(handler);
var fs = require('fs');
var static = require('node-static');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8000;

// Create a node-static server instance to serve the './static' folder
var staticFiles = new static.Server('./statics');

// handle web server
function handler (request, response) {
  // fs.readFile(__dirname + '/index.html', function (err, data) {
  //   if (err) {
  //     console.log(err);
  //     response.writeHead(500);
  //     return response.end('Error loading client.html');
  //   }
  //   response.writeHead(200);
  //   response.end(data);
  // });
  // serve static files
  request.addListener('end', function () {
      staticFiles.serve(request, response);
  }).resume();
}

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

// require('http').createServer(function (request, response) {
//     request.addListener('end', function () {
//         //
//         // Serve files!
//         //
//         staticFiles.serve(request, response);
//         console.log('Our app is running on http://localhost:' + port);
//     }).resume();
// }).listen(port);


