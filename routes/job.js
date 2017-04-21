/**
 * Created by rafa on 11/04/2017.
 */
var express = require('express');
var router = express.Router();
var Candidate = require('../models/candidates');
var Employees = require('../models/employees');
var Workermodes = require('../models/workermode');
var Worktimes = require('../models/worktimes');
var Workertypes = require('../models/workertype');
var Workhours = require('../models/workhours');
var Positions = require('../models/positions');
var Internperiod = require('../models/intperiod');

var errorHandler = require('./Helpers/errorHandlers');
var dbHelper =require('./Helpers/dbRouteCommon');



/*
* Workertimes Routes
* GET PUT POST DELETE ops
* */
router.get('/positions', function (req, res, next) {
  dbHelper.getAllRoute(Positions, {}, {}, null, function (err, data) {
    if(err){
      res.send(err);
      return;
    }
    res.send(data);
  })
});

router.post('/positions', function (req, res, next) {
  dbHelper.createRoute(Positions, {// data to be saved
    position: req.body.position,
    department: req.body.department
  }, function (err, savedData) {
    if(err){
      console.log(err);
      res.send(err);
      return;
    }

    if(savedData){
      res.send(savedData);
    }
  });
});

router.get('/positions/deps', function (req, res, next) {
  dbHelper.getAllRoute(Positions, {}, {}, 'department', function (err, data) {
    if(err){
      console.log(err);
      res.send(err);
      return;
    }

    res.send(data);
  });
});

router.put('/positions/:id', function (req, res, next) {

});


// fixed Workhours for employees
router.post('/hour', function (req, res, next) {
  dbHelper.createRoute(Workhours, { // data
    workhour: req.body.workhour
  }, function (err, data) {
    if(err){
      res.send(err);
      return;
    }
    res.send(data);
  });
});

router.get('/hour', function (req, res, next) {

  dbHelper.getAllRoute(Workhours, {}, {}, null, function (err, data) {
    if(err){
      res.send(err);
      return
    }
    res.send(data);
  });
});


//worker types Flexible Freelance Fixed
router.post('/wtype', function (req, res, next) {
  dbHelper.createRoute(Workertypes, { // data
    workertype: req.body.workertype
  }, function (err, data) {
    if(err){
      res.send(err);
      return;
    }
    res.send(data);
  });
});

router.get('/wtype', function (req, res, next) {

  dbHelper.getAllRoute(Workertypes, {}, {}, null, function (err, data) {
    if(err){
      res.send(err);
      return
    }
    res.send(data);
  });
});

router.delete('/wtype', function (req, res, next) {

  dbHelper.deleteAllRoute(Workertypes, function (err, data) {
    if(err){
      res.send(err);
      return
    }
    res.send(data);
  });
});


//worker types Ex: 8-30 till 18:00
router.post('/wtimes', function (req, res, next) {
  dbHelper.createRoute(Worktimes, { // data
    starttime: req.body.starttime,
    endtime: req.body.endtime
  }, function (err, data) {
    if(err){
      res.send(err);
      return;
    }
    res.send(data);
  });
});

router.get('/wtimes', function (req, res, next) {

  dbHelper.getAllRoute(Worktimes, {}, {}, null, function (err, data) {
    if(err){
      res.send(err);
      return
    }
    res.send(data);
  });
});

router.delete('/wtimes/:id', function (req, res, next) {
  dbHelper.deleteOneRoute(Worktimes, req.params.id, function (err, info) {
    if(err){
      res.send(err);
      return;
    }
    res.send(info);
  });
});

// worker mode
router.post('/wmode', function (req, res, next) {
  dbHelper.createRoute(Workermodes, { // data
    mode: req.body.mode
  }, function (err, data) {
    if(err){
      res.send(err);
      return;
    }
    res.send(data);
  });
});

router.get('/wmode', function (req, res, next) {

  dbHelper.getAllRoute(Workermodes, {}, {}, null, function (err, data) {
    if(err){
      res.send(err);
      return
    }
    res.send(data);
  });
});

router.delete('/wmode/:id', function (req, res, next) {
  dbHelper.deleteOneRoute(Workermodes, req.params.id, function (err, data) {
    if(err){
      res.send(err);
      return;
    }
    res.send(data);
  });
});

//Internship and probation periods
router.post('/wperiod', function (req, res, next) {
  dbHelper.createRoute(Internperiod, { // data
    intperiod: req.body.intperiod
  }, function (err, data) {
    if(err){
      res.send(err);
      return;
    }
    res.send(data);
  });
});

router.get('/wperiod', function (req, res, next) {

  dbHelper.getAllRoute(Workermodes, {}, {}, null, function (err, data) {
    if(err){
      res.send(err);
      return
    }
    res.send(data);
  });
});



module.exports = router;
