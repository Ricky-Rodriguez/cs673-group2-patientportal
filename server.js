// load the things we need
const bodyParser = require("body-parser");
const express = require('express');
const axios = require('axios').default;
const app = express();



// Use Body Parser
app.use(bodyParser.urlencoded({
    extended: true
}));

const CANCELLED_APT_CODE = 3;
const UI_HELPER_API = "https://ui-helper.herokuapp.com";
const TELE_SERVICE_API = "https://televisit-service.herokuapp.com";


const port = process.env.PORT || 3000; // Select either local port or Heroku default

// set the view engine to ejs
app.set('view engine', 'ejs');

// server static assets (ex css, js, vendor)
app.use(express.static('public'));

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});

// about page
app.get('/appointments', function(req, res) {
    res.render('pages/manage-appt');
});

// tele visit
app.get('/televisit', function(req, res) {
    res.render('pages/televisit');
});

// Records
app.get('/records', function(req, res) {
    res.render('pages/view-records');
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })


// API endpoint to return unbooked open slots
// (i.e. remove grey tiles that collide with blue)
app.get('/unbooked', function(req, res) {
  // First, Call UI Helper API for Booked Slots
  let unbookedSlots = []; // open slots, minus booked overlap
  let bookedSlots = [];
  axios.get(UI_HELPER_API + '/get_all_appoitments', {
    params: {
      "id" : req.query.doctorId,
    }
  })
  .then(function (response) {
    console.log(response.data)
    // Iterate over all booked slots & track their start and endDateTimes
    const resData = response.data;
    for (let i=0; i<resData.length; i++) {
      // Only append non-cancelled appoitments
      if (resData[i].appointment_status != CANCELLED_APT_CODE) {
        // Parse for Dates / Times
        let startDateTime = new Date(resData[i].start_time);
        let endDateTime = new Date(resData[i].end_time);
        let bookedSlot = {
          startDate: FormatDate(startDateTime),
          endDate: FormatDate(endDateTime),
          startTime: FormatTime(startDateTime),
          endTime: FormatTime(endDateTime)
        };
        bookedSlots.push(bookedSlot);
      }
    }
    console.log(bookedSlots)
  })
  .catch(function (error) {
    console.log("Unable to parse booked appointments!")
    console.log(error);
    // res.status(500).send('Error calling API!');
  })
  .then(function () {
    console.log(req.query.endYear + '/' + req.query.endMonth + '/' + req.query.endDay)
    // Second, Call UI Helper API for Open Slots
    axios.get(UI_HELPER_API + '/open', {
      params: {
        "doctorId" : req.query.doctorId,
        "StartDate" : req.query.startYear + '/' + req.query.startMonth + "/" + req.query.startDay,
        "EndDate" : req.query.endYear + '/' + req.query.endMonth + '/' + req.query.endDay
      }
    })
    .then(function (response) {
      // console.log(response.data)
      // Iterate over all open slots & remove any overlap
      const resData2 = response.data;
      // console.log(resData2)
      for (let i=0; i<resData2.length; i++) {
        let dateArray = []
        for (let j=0; j<resData2[i].length; j++) {
          // Check for overlap
          let hasOverlap = false;
          for (let k=0; k<bookedSlots.length; k++) {
            if (
              bookedSlots[k].startDate == resData2[i][j].startDate &&
              bookedSlots[k].endDate == resData2[i][j].endDate &&
              bookedSlots[k].startTime == resData2[i][j].startTime &&
              bookedSlots[k].endTime == resData2[i][j].endTime
            ) {
              hasOverlap = true;
            }
          }
          // Only add the timeslot if there is not overlap
          if (!hasOverlap) {
            dateArray.push(resData2[i][j]);
          }
        }
        // Only add the date array if there is at least 1 open slot
        if (dateArray.length > 0) unbookedSlots.push(dateArray);
      }
    })
    .catch(function (error) {
      console.log("Unable to parse booked appointments!")
      console.log(error);
      res.status(500).send('Error calling API!');
    })
    .then(function () {
      // Finally, return results
      res.json(unbookedSlots);
    })
  })
});

  // ------- Mock API's ----------------

//   app.get('/', function(req, res) {
//       let sampleTimes = [
//           {
//               "id" : 1,
//               "name" : "McQueeen, Oliver",
//               "time": 09:00 
//           },
//           {}
//       ]
//       res.json(sampleTimes)
//   });


  // Get all Doctors
// app.get('/doctors', function(req, res) {
//     let sampleDoctors = [
//       {
//         "doctorId" : 1,
//         "doctorName" : "Jasani, Shruti"
//       },
//       {
//         "doctorId" : 2,
//         "doctorName" : "Price, Phil"
//       }
//     ];
//     res.json(sampleDoctors);
//   });


  // Get all OPEN appointments in a date range
// app.get('/open', function(req, res) {
//     let doctorId = Number(req.query.doctorId);
//     let startMonth = Number(req.query.startMonth);
//     let endMonth = Number(req.query.endMonth);
//     let startDate = Number(req.query.startDate);
//     let endDate = Number(req.query.endDate);
//     let sampleOpenSlotsDoctor1a = [
//       [
//         {
//           "title" : "Available",
//           "startDate" : "2020-" + startMonth + "-" + startDate,
//           "endDate" : "2020-" + startMonth + "-" + startDate,
//           "startTime" : "09:00",
//           "endTime" : "09:30",
//         },
//         {
//           "title" : "Available",
//           "startDate" : "2020-" + startMonth + "-" + startDate,
//           "endDate" : "2020-" + startMonth + "-" + startDate,
//           "startTime" : "10:00",
//           "endTime" : "10:30",
//         },
//         {
//           "title" : "Available",
//           "startDate" : "2020-" + startMonth + "-" + startDate,
//           "endDate" : "2020-" + startMonth + "-" + startDate,
//           "startTime" : "11:00",
//           "endTime" : "12:00",
//         },
//         {
//           "title" : "Available",
//           "startDate" : "2020-" + startMonth + "-" + startDate,
//           "endDate" : "2020-" + startMonth + "-" + startDate,
//           "startTime" : "14:00",
//           "endTime" : "15:00",
//         }
//       ]
//     ]

//     let sampleOpenSlotsDoctor1b = [
//         [
//           {
//             "title" : "Available",
//             "startDate" : "2020-" + startMonth + "-" + startDate,
//             "endDate" : "2020-" + startMonth + "-" + startDate,
//             "startTime" : "09:00",
//             "endTime" : "09:30",
//           }
//         ]
//       ]

//       let sampleOpenSlotsDoctor2 = [
//         [
//           {
//             "title" : "Available",
//             "startDate" : "2020-" + startMonth + "-" + startDate,
//             "endDate" : "2020-" + startMonth + "-" + startDate,
//             "startTime" : "17:00",
//             "endTime" : "17:30",
//           }
//         ]
//       ]
//       if(doctorId !=1){
//         res.json(sampleOpenSlotsDoctor2);
//       }
//       if(startDate%2 == 0){
//       res.json(sampleOpenSlotsDoctor1a);
//       }else{
//         res.json(sampleOpenSlotsDoctor1b);
//       }
//   });






  // Appointment Creation
// app.post("/open", function(req, res) {
//     console.log(req.body);
//     res.json({});
//   })


  // app.get("/upcomingapts", function(req, res) {
  //   console.log(req.body);
  //   res.json([
  //     {
  //       "startDate" : "12/19/2020",
  //       "appointmentId" : 1,
  //       "startTime" : "14:00"
  //     },
  //     {
  //       "startDate" : "2/11/2021",
  //       "appointmentId" : 2,
  //       "startTime" : "11:00"
  //     },
  //     {
  //       "startDate" : "5/19/2021",
  //       "appointmentId" : 3,
  //       "startTime" : "08:00"
  //     }
  //   ]);
  // })



  // TeleVisit Session

  app.post('/televisit', function (req, res) {
    // Post to UI helper
    axios.get(UI_HELPER_API + '/get_session', {
      params : {
        appoitment_id : req.body.appointmentId
      }
    })
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      console.log("Error calling UI Helper!");
      console.log(error);
      res.status(500).send('Error calling API!');
    })
  });


  // ------------ Proxy Endpoints for CORS issues ------------

  app.post("/open", function(req, res) {
    // Query UI helper
    axios.post(UI_HELPER_API + '/create_appoitment', {
      "patient_id" : req.body.patientId,
      "doctor_id" : req.body.doctorId,
      "start_time" : req.body.startDateTime,
      "end_time" : req.body.endDateTime,
      "tele_visit" : req.body.isTeleVisit
    })
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      console.log("Error calling UI Helper!");
      console.log(error);
      res.status(500).send(error);
    })
  });

  app.get('/session', function (req, res) {
    // Post to UI helper
    axios.get(TELE_SERVICE_API + '/televisit/' + req.query.appointmentId, {})
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      console.log("Error calling UI Helper!");
      console.log(error);
      res.status(500).send('Error calling API!');
    })
  });

  //to update buttons for appt
  app.get('/upcomingapts', function(req, res) {
    let bookedSlots = [];
    // Query UI helper
    axios.get('https://sdpm-appointment-service.herokuapp.com/appointment', {
      params: {
        "patient_id" : req.query.patientId,
      }
    })
    .then(function (response) {
  res.json(response.data);
  })
})

  
  app.get("/doctors", function(req, res) {
    // Query UI helper
    axios.get(UI_HELPER_API + '/all_doctors', {})
    .then(function (response) {
      res.json(response.data.doctor);
    })
    .catch(function (error) {
      console.log("Error calling UI Helper!");
      console.log(error);
      res.status(500).send('Error calling API!');
    })
  });

  app.get("/summary", function(req, res) {
    // Query UI helper
    axios.get('https://sdpm-appointment-service.herokuapp.com/appointment/' + req.query.appointmentId + '/consultation_summary?download_type=json' , {

    })
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      console.log("Error calling UI Helper!");
      console.log(error);
      res.status(500).send(error);
    })
  });

  // Helper Method: Format Date Time (YYYY-DD-MM)
function FormatDate(dateTimeObject) {
  // Add 0's in front of single digits
  let month = (dateTimeObject.getUTCMonth() + 1);
  if (month < 10) {
    month = "0" + month;
  }
  let day = dateTimeObject.getUTCDate();
  if (day < 10) {
    day = "0" + day;
  }
  // Format as YYYY-DD-MMTHH:mm
  let date = dateTimeObject.getUTCFullYear() + "-" + month + "-" + day;
  return date;
}
// Helper Method: Format  Time (HH:mm)
function FormatTime(dateTimeObject) {
  let minutes = dateTimeObject.getUTCMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  let hours = dateTimeObject.getUTCHours();
  if (hours < 10) {
    hours = "0" + hours;
  }
  // Format as HH:mm
  let time = hours + ":" + minutes;
  return time;
}