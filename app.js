
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);

app.use(express.errorHandler());
app.use(express.vhost('localhost', require('./doxy/app').app));
app.use(express.vhost('utah.localhost', require('./utah/app').app));
app.use(express.vhost('dev.localhost', require('./dev/app').app));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
