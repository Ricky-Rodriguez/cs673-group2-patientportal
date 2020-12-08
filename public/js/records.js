// The Modal
var myGlobal
// var res = [
//     {date: "2015-06-01", aptId: 101, time: "09:00"},
//     {date: "2016-02-01", aptId: 205, time: "17:00"},
//     {date: "2017-08-11", aptId: 302, time: "16:00"},
//     {date: "2019-07-22", aptId: 562, time: "15:00"},
//     {date: "2020-11-15", aptId: 733, time: "10:00"}
// ]  

 // Wait for page to load
document.addEventListener("DOMContentLoaded", function() {
    $("#summary").on("shown.bs.modal", function () {
        $("#myInput").trigger("focus")
      })
     
      //TODO AJAX Call to get all appt data for a given patient id
      $.ajax({
        type: "GET",
        url: INTERNAL_API + "/upcomingapts",
        data: {
          "patientId" : 1, //TODO 
        },
        success: function(res) {
          console.log(res)
          // Iterate over response and append to DOM
          for (var i=0; i < res.length; i++) {     
            var listItem = '<li class="list-group-item records" id="'+res[i].appointment_id+'" > ' + FormatDateTime(new Date(res[i].start_time)).replace("T"," at ") + 
            ' <button type="button" class="btn btn-primary summaryBtn" data-toggle="modal" data-target="#summary" >Consultation Summary</button>' +  
            '<a href = "https://sdpm-appointment-service.herokuapp.com/appointment/3/charts/1" download> <button type="submit" class="btn btn-primary chartBtn" >Chart Notes</button></a></li>'
            $("#summaryList").prepend(listItem)
          //  $("#upcomingapts").append('<li><a href="/televisit?appointmentId='+ res[i].appointment_id +'"><button class="btn btn-primary">' + FormatDateTime(new Date(res[i].start_time)).replace("T"," at ") + ' </button></a></li>');
          }
        }
      });





      // res.forEach(apt => {
       
      //  var aptDate = apt.date;
      //  var aptId  = apt.aptId;
      //  var aptTime = apt.time;

      //  var listItem = '<li class="list-group-item records" id="'+aptId+'" >'+aptDate+' at '+aptTime+'      <button type="button" class="btn btn-primary summaryBtn" data-toggle="modal" data-target="#summary">Consultation Summary</button>       <a href = "https://sdpm-appointment-service.herokuapp.com/appointment/3/charts/1" download> <button type="submit" class="btn btn-primary summaryBtn" >Chart Notes</button></a></li>'
      // //  var chartItem = '<li class="list-group-item records" id="'+aptId+'" >'+aptDate+' at '+aptTime+'<button type="button" class="btn btn-primary summaryBtn">Chart Notes</button></li>'

       
      //   console.log(apt.aptId)

      //   $("#summaryList").prepend(listItem)
      //   // $("#chartList").prepend(chartItem)
      // } 
        // );

      

        $(document).on("click", ".summaryBtn", function() {
        
        var myAptId = this.parentElement.id;
        $("#summaryLabel").html("Apt # " + myAptId);
        $.ajax({
        type: "GET",
        url: INTERNAL_API + "/summary",
        data: {
          "appointmentId" : myAptId, //TODO 
        },
        success: function(res) {
          console.log(res)
         //TODO
        },
        error: function(error){
          $("#constSummary").text("No summary records found.")
        }
      });
        myGlobal=this;
        console.log(this);
        });
    });  