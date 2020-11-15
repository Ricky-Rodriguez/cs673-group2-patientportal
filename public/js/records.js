// The Modal
var myGlobal
var res = [
    {date: "2015-06-01", aptId: 101, time: "09:00"},
    {date: "2016-02-01", aptId: 205, time: "17:00"},
    {date: "2017-08-11", aptId: 302, time: "16:00"},
    {date: "2019-07-22", aptId: 562, time: "15:00"},
    {date: "2020-11-15", aptId: 733, time: "10:00"}
]  

 // Wait for page to load
document.addEventListener("DOMContentLoaded", function() {
    $("#summary").on("shown.bs.modal", function () {
        $("#myInput").trigger("focus")
      })
     
      //TODO AJAX Call to get all appt data for a given patient id

      res.forEach(apt => {
       
       var aptDate = apt.date;
       var aptId  = apt.aptId;
       var aptTime = apt.time;

       var listItem = '<li class="list-group-item" id="'+aptId+'" >'+aptDate+' at '+aptTime+'<button type="button" class="btn btn-primary summaryBtn" data-toggle="modal" data-target="#summary">Consultation Summary</button></li>'

        console.log(apt.aptId)

        $("#summaryList").prepend(listItem)
        
      } 
        );

      

      $(".summaryBtn").on("click", function () {
        var myAptId = this.parentElement.id;
        $("#summaryLabel").html("Apt # " + myAptId);
        //TODO AJAX Query
        myGlobal=this;
        console.log(this);
        });
    });  