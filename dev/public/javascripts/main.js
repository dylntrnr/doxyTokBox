window.div;

TB.setLogLevel(TB.DEBUG);
// Initialize session, set up event listeners, and connect
window.session = TB.initSession(sessionId);
session.addEventListener('sessionConnected', sessionConnectedHandler);  
session.addEventListener('streamCreated', streamCreatedHandler);
session.connect(apiKey, token);

function sessionConnectedHandler(event) {
  // Create publisher and start streaming into the session
  var publisher = TB.initPublisher(apiKey, 'myPublisherDiv', {height: "135px", width: "180px"});
  session.publish(publisher);

  // Subscribe to streams that were in the session when we connected
  subscribeToStreams(event.streams);

}

function streamCreatedHandler(event) {
  // Subscribe to any new streams that are created
  subscribeToStreams(event.streams);
  $('#promptArrow').remove();
  
}

function subscribeToStreams(streams) {
  for (var i = 0; i < streams.length; i++) {
    // Make sure we don't subscribe to ourself
    if (streams[i].connection.connectionId == session.connection.connectionId) {
      return;
    }

    // Create the div to put the subscriber element in to
    div = document.createElement('div');
    div.setAttribute('id', 'stream' + streams[i].streamId);
    var streamsContainer = document.getElementById('streamsContainer');
    streamsContainer.appendChild(div);

    var browserHeight = $(window).height();
    var browserWidth = $(window).width();
    // Subscribe to the stream
    session.subscribe(streams[i], div.id, {height: browserHeight + "px", width: browserWidth + "px"});
  //   var plussign = document.getElementById("plussign");
  //   plussign.remove();
  }
}

function resizePublisher() {
  var streamsContainer = document.getElementById('videos');
  streamsContainer.webkitRequestFullScreen();
}

