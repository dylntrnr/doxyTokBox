
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.vhost('doxy.me', require('./doxy/app').app));
app.use(express.vhost('utah.doxy.me', require('./utah/app').app));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
