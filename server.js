// load the things we need
const express = require('express');
const app = express();

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
