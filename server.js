// load the things we need
const bodyParser = require("body-parser");
const express = require('express');
const app = express();
// Use Body Parser
app.use(bodyParser.urlencoded({
    extended: true
}));
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
app.get('/doctors', function(req, res) {
    let sampleDoctors = [
      {
        "doctorId" : 1,
        "doctorName" : "Jasani, Shruti"
      },
      {
        "doctorId" : 2,
        "doctorName" : "Price, Phil"
      }
    ];
    res.json(sampleDoctors);
  });


  // Get all OPEN appointments in a date range
app.get('/open', function(req, res) {
    let doctorId = Number(req.query.doctorId);
    let startMonth = Number(req.query.startMonth);
    let endMonth = Number(req.query.endMonth);
    let startDate = Number(req.query.startDate);
    let endDate = Number(req.query.endDate);
    let sampleOpenSlotsDoctor1a = [
      [
        {
          "title" : "Available",
          "startDate" : "2020-" + startMonth + "-" + startDate,
          "endDate" : "2020-" + startMonth + "-" + startDate,
          "startTime" : "09:00",
          "endTime" : "09:30",
        },
        {
          "title" : "Available",
          "startDate" : "2020-" + startMonth + "-" + startDate,
          "endDate" : "2020-" + startMonth + "-" + startDate,
          "startTime" : "10:00",
          "endTime" : "10:30",
        },
        {
          "title" : "Available",
          "startDate" : "2020-" + startMonth + "-" + startDate,
          "endDate" : "2020-" + startMonth + "-" + startDate,
          "startTime" : "11:00",
          "endTime" : "12:00",
        },
        {
          "title" : "Available",
          "startDate" : "2020-" + startMonth + "-" + startDate,
          "endDate" : "2020-" + startMonth + "-" + startDate,
          "startTime" : "14:00",
          "endTime" : "15:00",
        }
      ]
    ]

    let sampleOpenSlotsDoctor1b = [
        [
          {
            "title" : "Available",
            "startDate" : "2020-" + startMonth + "-" + startDate,
            "endDate" : "2020-" + startMonth + "-" + startDate,
            "startTime" : "09:00",
            "endTime" : "09:30",
          }
        ]
      ]

      let sampleOpenSlotsDoctor2 = [
        [
          {
            "title" : "Available",
            "startDate" : "2020-" + startMonth + "-" + startDate,
            "endDate" : "2020-" + startMonth + "-" + startDate,
            "startTime" : "17:00",
            "endTime" : "17:30",
          }
        ]
      ]
      if(doctorId !=1){
        res.json(sampleOpenSlotsDoctor2);
      }
      if(startDate%2 == 0){
      res.json(sampleOpenSlotsDoctor1a);
      }else{
        res.json(sampleOpenSlotsDoctor1b);
      }
  });






  // Appointment Creation
app.post("/open", function(req, res) {
    console.log(req.body);
    res.json({});
  })

