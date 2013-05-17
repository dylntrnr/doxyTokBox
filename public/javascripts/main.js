

TB.setLogLevel(TB.DEBUG);
// Initialize session, set up event listeners, and connect
window.session = TB.initSession(sessionId);
session.addEventListener('sessionConnected', sessionConnectedHandler);  
session.addEventListener('streamCreated', streamCreatedHandler);
session.connect(apiKey, token);

function sessionConnectedHandler(event) {
  // Create publisher and start streaming into the session
  var publisher = TB.initPublisher(apiKey, 'myPublisherDiv');
  session.publish(publisher);

  // Subscribe to streams that were in the session when we connected
  subscribeToStreams(event.streams);
  window.test = event.streams;
}

function streamCreatedHandler(event) {
  // Subscribe to any new streams that are created
  subscribeToStreams(event.streams);
}

function subscribeToStreams(streams) {
  for (var i = 0; i < streams.length; i++) {
    // Make sure we don't subscribe to ourself
    if (streams[i].connection.connectionId == session.connection.connectionId) {
      return;
    }

    // Create the div to put the subscriber element in to
    var div = document.createElement('div');
    div.setAttribute('id', 'stream' + streams[i].streamId);
    document.body.appendChild(div);

    // Subscribe to the stream
    session.subscribe(streams[i], div.id, {height: "480px", width: "640px"});
  }
}


