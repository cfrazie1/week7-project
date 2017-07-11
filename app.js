const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const stringify = require("stringify");
const dbUrl = "mongodb://localhost:27017/tracker";
const mongoose = require('mongoose');

mongoose.Promise = require('bluebird');
mongoose.connect(dbUrl);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    activities: [{ name: String, count: Number }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static('public'));

app.use(session({
  secret: 'true',
  resave: false,
  saveUninitialized: true
}));

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set ('view engine', 'mustache');

//create a new user
app.get('/api/newUser/:userName', function(req, res) {
  var name = req.params.userName;
  var newUser = new User({name: name});
  res.send("New user created.");
});

//get all users
app.get('/api/users/', function(req, res) {
  var users = User.find({}, function(err, users) {
    res.send(users);
  });
})

//get all activities
app.get('/api/activities', function(req, res) {

  var user = User.findOne({name: "Curtis"}, function(err, user) {
    res.send(user.activities)
  });

});

//create a new activity by name
app.post('/api/activities/:name', function(req, res){

  var user = User.findOne({name: "Curtis"}, function(err, user) {

    var activityName = req.params.name;
    user.activities.push({name: activityName})
    user.save();
    res.send("New activity added.");

  });
});

//get activity details by id
app.get('/api/activities/:id', function (req, res){

  var user = User.findOne({name: "Curtis"}, function(err, user) {

    user.activities.forEach(function(item) {

      if(item._id.toString()===req.params.id) res.send(item)

    });

  });

});

//update the name of an activity
app.put('/api/activities/:id/:name', function(req, res){

  var user = User.findOne({name: "Curtis"}, function(err, user) {

    user.activities.forEach(function(item) {

      if(item._id.toString()===req.params.id) {
        item.name = req.params.name;
      }

      user.save();
      res.end("Name of activity updated" + user);

    });

  });

});

//delete activity by id
app.delete('/api/activities/:id', function(req, res){

  var user = User.findOne({name: "Curtis"}, function(err, user) {

    user.activities.forEach(function(item) {

      if(item._id.toString()===req.params.id) {

        let itemIndex = user.activities.indexOf(item);
        user.activities.splice(itemIndex, 1);

      }

      user.save();
      res.end("Activity deleted.");

    });

  });

});

// app.post('/api/activities/:id/stats', function(req, res){
//   console.log(req.params.id, "id")
// });
//
// app.delete('/api/stats/:id', function(req, res){
//   console.log(req.params.id, "id")
// });

app.listen(3000, function() {
  console.log("Tracker API... Listening on 3000");
});
