
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , crypto = require('crypto')
  , http = require('http')
  , path = require('path');

var OpenTokLibrary = require('opentok');

// ***
// *** OpenTok Constants for creating Session and Token values
// ***
var OTKEY = 32321782;
var OTSECRET = process.env.APIKEY;

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

// production only
if ('production' == app.get('env')) {
  app.use(express.errorHandler());
  app.get('*',function(req,res,next){
    if(req.headers['x-forwarded-proto']!='https')
      res.redirect('https://' + req.get('Host') + req.url)
    else
      next() /* Continue to other routes if we're not redirecting */
  });
}




// When user goes to route directory send them the index.html file and partials
app.get("/", routes.index);
app.get('/partials/:name', routes.partials);

// api call to get room url
app.get('/api/:room/:pass', function (req, res) {
  var room = req.params.room;
  var key = req.params.pass ;
  var hash;
  hash = crypto.createHmac('sha1', key).update(room).digest('hex');
  res.send("/" + hash);
});

// When user goes to /:room with the the 123-123-133 form with optional password it redirects to a hashed value so two urls are the same
app.get("/:room([0-9]+-[0-9]+-[0-9]+)/:pass?", function(req, res){
  // turn :room into hash
  var room = req.params.room;
  var key = req.params.pass || process.env.TestKey;
  var hash;
  hash = crypto.createHmac('sha1', key).update(room).digest('hex');
  console.log(room, key, hash, process.env.TestKey);
  res.redirect(hash);
  res.end();
});

app.get("/:room", function (req, res) {
  if(urlSessions[ req.params.room ] == undefined){
    OpenTokObject.createSession(function(sessionId){
      urlSessions[ req.params.room ] = sessionId;
      sendRoomResponse( sessionId, res, req.params.room, req.headers.host );
    }, {'p2p.preference':'enabled'});
  }else{
    sessionId = urlSessions[req.params.room];
    sendRoomResponse( sessionId, res, req.params.room, req.headers.host );
  }
});

function sendRoomResponse( sessionId, responder, room, origin ){
  var token = OpenTokObject.generateToken( {session_id: sessionId} );
  var data = {OpenTokKey:OTKEY, sessionId: sessionId, token:token, title: "New Room: " + room, Room: room, origin: origin};
  responder.render( 'meeting', data );
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
      sendResponse( sessionId, res, req.params.room, req.headers.host );
    });
  }else{
    sessionId = urlSessions[req.params.room];
    sendResponse( sessionId, res, req.params.room, req.headers.host );
  }
});


// ***
// *** All sessionIds need a corresponding token
// *** generateToken and then sendResponse based on ejs template
// ***
function sendResponse( sessionId, responder, room, origin ){
  var token = OpenTokObject.generateToken( {session_id: sessionId} );
  var data = {OpenTokKey:OTKEY, sessionId: sessionId, token:token, title: "New Room: " + room, Room: "quick/" + room, origin: origin};
  responder.render( 'meeting', data );
}



exports.app = app;
