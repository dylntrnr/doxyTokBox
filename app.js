
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);

if ('development' == app.get('env')) {
  app.use(express.vhost('localhost', require('./doxy/app').app));
  app.use(express.vhost('utah.localhost', require('./utah/app').app));
} else {
  app.use(express.vhost('doxy', require('./doxy/app').app));
  app.use(express.vhost('utah.doxy', require('./utah/app').app));
}

app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
