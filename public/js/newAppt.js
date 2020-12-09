document.addEventListener('DOMContentLoaded', function (){

var today = new Date();
var monthToday = today.getUTCMonth();
var dayToday = today.getDay();
// $(#time)


// $.ajax({
//     type: "GET",
//     url: UI_HELPER_API + "/",
//     data: {},
//     success: function(res) {
//         console.log("res")
//     }
// });

$.ajax({
    type: "GET",
    url: INTERNAL_API + "/doctors",
    data: {},
    success: function(res) {
      // Iterate over response and append to DOM
      for (var i=0; i < res.length; i++) {     
       $("#doctor").append('<option value="' + res[i].ID + '">' + res[i].Name + '</option>');
      }
    }
  });

  $.ajax({
    type: "GET",
    url: INTERNAL_API + "/upcomingapts",
    data: {
      "patientId" : PATIENTID, //TODO 
      "startMonth" : monthToday,
      "startDate" : dayToday,
    },
    success: function(res) {
      console.log(res)
      // Iterate over response and append to DOM
      for (var i=0; i < res.length; i++) {     
       $("#upcomingapts").append('<li><a href="/televisit?appointmentId='+ res[i].appointment_id +'"><button class="btn btn-primary">' + FormatDateTime(new Date(res[i].start_time)).replace("T"," at ") + ' </button></a></li>');
      }
    }
  });


  $('#appt_date').change(function() {
      console.log(this);
      var date = new Date($(this).val());
      var day = date.getUTCDate();
      console.log(day)
      var month = date.getUTCMonth() + 1;
      var year = date.getUTCFullYear();
      var doctorId = $('#doctor').val();
       
      // First, get Open Timeslots
    $.ajax({
        type: "GET",
        url: INTERNAL_API + "/unbooked",
        data: {
          "doctorId" : doctorId,
          "startMonth" : month,
          "startDay" : day,
          "endMonth" : month,
          "endDay" : day,
          "startYear" : year,
          "endYear" : year
        },
        success: function (res1) {
          // Format and Append all Open Slots
          console.log(res1)
          $("#time").empty()
          for (var i=0; i<res1.length; i++) {
            for (var j=0; j<res1[i].length; j++) {
              $("#time").append('<option value="' + res1[i][j].startTime + '-' + res1[i][j].endTime + '">' + res1[i][j].startTime + ' - ' + res1[i][j].endTime + '</option>');
            }
          }
        }
  })
});

$('#bookApptBtn').on('click', function() {
    var doctorId = $('#doctor').val();
    var patientId = PATIENTID; // TODO
    var isTeleVisit = $('#visit').val();
    var startDateTime =$('#appt_date').val() + "T" + $('#time').val().split('-')[0];
    var endDateTime = $('#appt_date').val() + "T" + $('#time').val().split('-')[1];
    // var startTime = $('#time').val().split('-')[0];
    // var endTime =  $('#time').val().split('-')[1];

    $.ajax({
        type:"POST",
        url: INTERNAL_API + "/open",
        data:{
         "doctorId" : doctorId,
         "patientId": patientId,
         "startDateTime" : startDateTime,
         "endDateTime" : endDateTime,
         "isTeleVisit": isTeleVisit
        },
        success: function(res){
            alert('Your appointment has been booked.');
            location.reload();
            return false;
        },
        error: function(err){
          alert('ERROR - Booking Failed');
          console.log(err);
          return false;
      },
    })

    return false;
})


})

