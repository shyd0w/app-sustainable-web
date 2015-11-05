var loopback = require('loopback');
var boot = require('loopback-boot');
var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");

var app = module.exports = loopback();

app.start = function() {
  // start the web server
    var port = process.env.PORT || 3000;

  app.use(loopback.static(path.resolve(__dirname, '../client')));
  app.use(loopback.static(path.resolve(__dirname, '../.tmp')));

  return app.listen(port, function () {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
