
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var OpenTokLibrary = require('opentok');

// ***
// *** OpenTok Constants for creating Session and Token values
// ***
var OTKEY = 24250552;
var OTSECRET = "024025a7c2b92b69162c3af6147aabd7a46e6ad5";

// ***
// *** Setup when server first starts
// ***
var urlSessions = {};
var OpenTokObject = new OpenTokLibrary.OpenTokSDK(OTKEY, OTSECRET);


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// When user goes to route directory send them the index.html file and partials
app.get("/", routes.index);
app.get('/partials/:name', routes.partials);


// // When user goes to /about send to about page
// app.get("/about", function (req, res) {
//   res.render( 'about', {title: "about"});
// });

// When user goes to /room/:room give them the same thing as a regular meeting except prompt them for a password first
app.get("/room/:room", function(req, res){
  if(urlSessions[ req.params.room ] == undefined){
    OpenTokObject.createSession(function(sessionId){
      urlSessions[ req.params.room ] = sessionId;
      sendResponse2( sessionId, res );
    }, {'p2p.preference':'enabled'});
  }else{
    sessionId = urlSessions[req.params.room];
    sendResponse2( sessionId, res );
  }
});

// when they hit the flash fall back button go to room with flash
app.get("/flash/room/:room", function(req, res){
  if(urlSessions[ req.params.room ] == undefined){
    OpenTokObject.createSession(function(sessionId){
      urlSessions[ req.params.room ] = sessionId;
      sendResponse3( sessionId, res );
    }, {'p2p.preference':'enabled'});
  }else{
    sessionId = urlSessions[req.params.room];
    sendResponse3( sessionId, res );
  }
});

function sendResponse3( sessionId, responder ){
  var token = OpenTokObject.generateToken( {session_id: sessionId} );
  var data = {OpenTokKey:OTKEY, sessionId: sessionId, token:token, title: "New Room"};
  responder.render( 'fallback', data );
}

// ***
// *** When user goes to meeting directory, redirect them to a room (timestamp)
// ***
app.get("/quick/meeting", function( req, res ){
  res.writeHead(302, { 'Location': RandomRoom() });
  res.end();
});

//Random Room Generator - inspired by webrtcio guys on github
function RandomRoom () {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var length_of_string = 9;
    var randomstring = '';
    for(var i = 0; i < length_of_string; i++) {
      var random_num = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(random_num, random_num + 1);
    }
    return randomstring;
}

// ***
// *** When user goes to root directory, redirect them to a room (timestamp)
// *** If sessionId does not exist for url, create one
// ***
app.get("/quick/:room", function(req, res){
  if(urlSessions[ req.params.room ] == undefined){
    OpenTokObject.createSession(function(sessionId){
      urlSessions[ req.params.room ] = sessionId;
      sendResponse( sessionId, res );
    }, {'p2p.preference':'enabled'});
  }else{
    sessionId = urlSessions[req.params.room];
    sendResponse( sessionId, res );
  }
});

function sendResponse2( sessionId, responder ){
  var token = OpenTokObject.generateToken( {session_id: sessionId} );
  var data = {OpenTokKey:OTKEY, sessionId: sessionId, token:token, title: "New Room"};
  responder.render( 'scheduled', data );
}



// ***
// *** All sessionIds need a corresponding token
// *** generateToken and then sendResponse based on ejs template
// ***
function sendResponse( sessionId, responder ){
  var token = OpenTokObject.generateToken( {session_id: sessionId} );
  var data = {OpenTokKey:OTKEY, sessionId: sessionId, token:token, title: "New Room"};
  responder.render( 'meeting', data );
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
