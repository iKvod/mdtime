/**
 * Created by rafa on 10/04/2017.
 */
var express = require('express');
var router = express.Router();
var Candidate = require('../models/candidates');
var Employees = require('../models/employees');
var csvParser = require('../Utils/csvparser');
// var csvDir = require('../dbcsv/candidates-goo.csv');

var dir = './dbcsv/candidates.csv';
var dir2 = './dbcsv/appliedcandidates.csv';
var dir3 = './dbcsv/archive.csv';

router.get('/', function (req, res, next) {
  saveParsedData(dir, function(data){
    res.send(data);
    //uncomment if you need parse again
    // recursion(0, data, function (message) {
    //   res.send(message.message);
    // });
  });
});

var saveParsedData = function(dir, callback){
  csvParser.parseCsvToJson(dir, function (data) {
    callback(data);
  });
};

var recursion = function (i, data, callback) {
  var len = data.length;
  if(i < len){
    Candidate.create(data[i], function (err, small) {
      if (err) {
        console.log(err);
        return ;
      }
      recursion(i+1, data, callback);
    });
  } else {
    callback({message: "Users saved"});
  }
};

//parse and joining guest id to with candidates db
router.get('/join', function (req, res, next) {
  joinParsedData(dir2, function (data) {
    res.send(data);
    // joinRecursion(0, data, function (message) {
    //   res.send(message)
    // });
  });
});

var joinParsedData = function (dir2, callback) {
  csvParser.parseToJsonApplied(dir2, function (data) {
    callback(data);
  });
};

var joinRecursion = function (i, data, callback) {
  var len = data.length;
  // console.log(data.length);
  if(i < len ){
    Candidate.findOne({ personal_email: data[i].email})
      .select({ 'personal_email':1 })
      .exec(function (err, cand) {
        if(err){
          console.log(err);
          return;
        }
        if(cand){
          cand.guest_id = data[i].guest_id;
          cand.save(function (err, savedCand) {
            if(err){
              res.send({message: 'Interation ' + i + ' some error'})
              return
            }
            joinRecursion(i+1, data, callback);
          });

        } else {
          joinRecursion(i+1, data, callback);
        }
      });
  } else {
    callback({message: 'Все данные спарсасаны и объедены в одну базу'})
  }
};


router.get('/archive', function (req, res, next) {
  saveArchivedEmployees(dir3, function (parsedData) {
    res.send(parsedData);
    // archiveRecursion(0, parsedData, function (message) {
    //   res.send(message)
    // });
  })

});

var saveArchivedEmployees = function (dir, callback) {
  csvParser.parseArchiveEmployees(dir, function (parsedData) {
    callback(parsedData);
  })
};

var archiveRecursion = function (i, data, callback) {
  var len = data.length;
  if(i < len){
    Employees.create(data[i], function (err, empl) {
      if (err) {
        console.log(err);
        return ;
      }
      archiveRecursion(i+1, data, callback);
    });
  } else {
    callback({message: "Employees saved to new database"});
  }
};

module.exports = router;