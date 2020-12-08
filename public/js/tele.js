// OpenTok


var queries = {};
$.each(document.location.search.substr(1).split('&'),function(c,q){
  var i = q.split('=');
  queries[i[0].toString()] = i[1].toString();
});

document.addEventListener('DOMContentLoaded', function() {

    var apiKey = "46950324";





     // Call UI Helper API to get Tokens
  $.ajax({
    type: "GET",
    url: INTERNAL_API + "/session",
    data: {
      
      "appointmentId" : queries.appointmentId
    },
    success: function (res) {
      // Get Tokens from API response

      var sessionId;
      var token;
      try {
        sessionId = res.session_id;
        token = res.patient_token;
      } catch (err) {
        alert("Unable to Create TeleVisit Session! Invalid Credentials!");
      }
     
      // connect to session
      var session = OT.initSession(apiKey, sessionId);
  
      // create publisher
      var publisher = OT.initPublisher('publisher', {});
      session.connect(token, function(err) {
      // publish publisher
      session.publish(publisher);
      });
  
      // create subscriber
      session.on('streamCreated', function(event) {
      session.subscribe(event.stream,'subscriber');
      });
    }
});

     // End Video Call
 $("#end").on('click', function() {
    // Re Direct to Appointments Calendar
    var newURL = window.location.origin + "/records";
    window.location.replace(newURL);
    return false;
  });
  
});
 


