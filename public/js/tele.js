// OpenTok

document.addEventListener('DOMContentLoaded', function() {

    var apiKey = "46950324";
    var sessionId = '2_MX40Njk1MDMyNH5-MTYwNDg5Mzg5MzAwMH5wdndpN0pxSWZWaVNFQitab3NUa3lmU1B-UH4';
    var token = "T1==cGFydG5lcl9pZD00Njk1MDMyNCZzaWc9ZDkzMzBmMjYyZTg3ZDViYjgzYWIzYTU2MTYyZmFjOTE0MDhmNGNjZDpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTJfTVg0ME5qazFNRE15Tkg1LU1UWXdORGc1TXpnNU16QXdNSDV3ZG5kcE4wcHhTV1pXYVZORlFpdGFiM05VYTNsbVUxQi1VSDQmY3JlYXRlX3RpbWU9MTYwNDg5Mzg5MyZub25jZT0wLjI1Mzc5MjEwMDMyOTk1NDAzJmV4cGlyZV90aW1lPTE2MDc0ODU4OTM=";

    // connect to session
    var session = OT.initSession(apiKey, sessionId);

    // create publisher
    var publisher = OT.initPublisher('publisher');
    session.connect(token, function(err) {
    // publish publisher
    session.publish(publisher);
    });

    // create subscriber
    session.on('streamCreated', 'subscriber', function(event) {
    session.subscribe(event.stream);
    });
})