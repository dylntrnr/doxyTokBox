/*
 *  Room databse interactions
 */

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/meetingRoom');


var OpenTokLibrary = require('opentok');

// ***
// *** OpenTok Constants for creating Session and Token values
// ***
var OTKEY = 36591572;
var OTSECRET = process.env.APIKEY2;

// ***
// *** Setup when server first starts
// ***
var urlSessions = {};
var OpenTokObject = new OpenTokLibrary.OpenTokSDK(OTKEY, OTSECRET);

// Mongoose Stuffs

var roomSchema = mongoose.Schema({
  dr: 'string',
  sessionId: 'string',
  token: 'string'
});

var Room = mongoose.model('Room', roomSchema);


exports.newRoom = function (req, res) {
  OpenTokObject.createSession(null, {'p2p.preference':'enabled'}, function (sessionId) {
    sendDrClarkResponse(sessionId, res, req);
    
  });


};

function sendDrClarkResponse(sessionId, res, req) {
  token = OpenTokObject.generateToken({ session_id:sessionId, role:"publisher", connection_data: sessionId});
  data = {dr:'DrClark', sessionId:sessionId, token:token, OpenTokKey:OTKEY, title: "DrClark's room", Room: "DrClarks room", origin: "origin"};
  var newRoom = new Room(data);
  newRoom.save();
  console.log("Post added: " + data.dr, data.sessionId, data.token, data.apiKey);
  res.render('meeting', data);
}






