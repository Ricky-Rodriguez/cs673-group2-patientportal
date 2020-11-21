document.addEventListener('DOMContentLoaded', function (){

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
    url: UI_HELPER_API + "/doctors",
    data: {},
    success: function(res) {
      // Iterate over response and append to DOM
      for (var i=0; i < res.length; i++) {     
       $("#doctor").append('<option value="' + res[i].doctorId + '">' + res[i].doctorName + '</option>');
      }
    }
  });


  $('#appt_date').change(function() {
      console.log(this);
      var date = new Date($(this).val());
      var day = date.getUTCDate();
      var month = date.getUTCMonth() + 1;
      var year = date.getUTCFullYear();
      var doctorId = $('#doctor').val();
       
      // First, get Open Timeslots
    $.ajax({
        type: "GET",
        url: UI_HELPER_API + "/open",
        data: {
          "doctorId" : doctorId,
          "startMonth" : month,
          "startDate" : day,
          "endMonth" : month,
          "endDate" : day
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
    var patientId = 1; // TODO
    var isTeleVisit = $('#visit').val();
    var startDateTime =$('#appt_date').val() + "T" + $('#time').val().split('-')[0].replace(':','-');
    var endDateTime = $('#appt_date').val() + "T" + $('#time').val().split('-')[1].replace(':','-');
    // var startTime = $('#time').val().split('-')[0];
    // var endTime =  $('#time').val().split('-')[1];

    $.ajax({
        type:"POST",
        url: UI_HELPER_API + "/open",
        data:{
         "doctorId" : doctorId,
         "patientId": patientId,
         "startDateTime" : startDateTime,
         "endDateTime" : endDateTime,
         "isTeleVist": isTeleVisit
        },
        success: function(res){
            console.log('booked');
            return false;
        }
    })
    return false;
})


})
