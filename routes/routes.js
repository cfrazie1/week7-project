const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const bodyParser = require('body-parser');

mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost:27017/statTracker");

router.use(passport.authenticate('basic', {session: false}));

const users = {
  "curtis" : "frazier"
};

passport.use(new BasicStrategy(
  function(username, password, done) {
      const userPassword = user[username];
      if (!userPassword) { return done(null, false); }
      if (userPassword !== password) { return done(null, false); }
      return done(null, username);
  }
));



const activitySchema = new Schema({
  activity: String

});

const statsSchema = new Schema({

    date: {type: Date, default: Date.now()},
    statName: String,
    statValue: Number,
    activityId: String
})

const userSchema = new Schema({
  username: String,
  password: String
});

const users = mongoose.model('users', userSchema);
const activities = mongoose.model('activities', activitySchema);
const stats = mongoose.model('stats', statsSchema);

const user = {
  "davis": "password"
}

router.get('/api/activities', function(req, res){
  activities.find({}).then(function(allActivities){
    if(allActivities){
      res.setHeader('Content-Type', 'application/json');
        res.status(200).json(allActivities);
    } else {
      res.send("No activities found")
    }
  }).catch(function(err) {
      res.status(400).send("Bad request. Please try again.");
    });
});


router.post('/api/activities', function(req, res){
  let activity = new activities({
    activity: req.body.activity

  });

  activities.create(activity).then(function(activity){
    if(activity){
      res.setHeader('Content-Type', 'application/json');
        res.status(201).json(activity);
    } else {
      res.status(403).send("No Activity found...");
    }
  }).catch(function(err) {
      res.status(400).send("Bad request. Please try again.");
    })
})

router.post('/api/activities/:id/stats', function(req, res){

  let stat = new stats({
    date: req.body.date,
    statName: req.body.statName,
    statValue: req.body.statValue,
    activityId: req.params.id
  });
  stats.create(stat).then(function(stat){
    if (stat) {
      res.setHeader('Content-Type', 'application/json');
        res.status(201).json(stat);
    } else {
      res.status(403).send("No Activity found...");
    }
  }).catch(function(err) {
      res.status(400).send("Bad request. Please try again.");
    })
  })


router.get('/api/activities/:id', function(req, res){
  stats.find({activityId: req.params.id}).then(function(activity){
    if (activity) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(activity);
      } else {
        res.status(404).send("Activity not found.")
      }
  }).catch(function(err) {
      res.status(400).send("Bad request. Please try again.");
    });

})

router.put('/api/activities/:id', function(req, res){
  activities.updateOne({
    _id: req.params.id
  },

  {
    activity: req.body.activity
  }).then(function(activity){
    if (activity) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(activity);
    } else {
      res.status(403).send("No Todo found...");
    }
  }).catch(function(err) {
    res.status(400).send("Bad request. Please try again.");
  });
  stats.updateMany({
    activityId: req.params.id
  },
  {
    statName: req.body.statName
  }).then(function(stat){

  })
});

router.delete('/api/activities/:id', function(req, res){
  activities.deleteOne({_id: req.params.id}).then(function(activity){
    if(activity){
      res.status(200).send("Successfully removed activity.");
    } else {
      res.status(404).send("Activity not found.");
    }
  }).catch(function(err) {
    res.status(400).send("Bad request. Please try again.");
  })
  stats.deleteMany({activityId: req.params.id}).then(function(stat){})

  })

router.delete('/api/stats/:id', function(req, res){
  stats.deleteOne({_id: req.params.id}).then(function(activity){
    if (activity) {
      res.status(200).send("Successfully removed stat.");
    } else {
      res.status(404).send("Activity not found.");
    }
  }).catch(function(err) {
    res.status(400).send("Bad request. Please try again.");
  })
})

module.exports = router;
