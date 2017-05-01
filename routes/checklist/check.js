/**
 * Created by rafa on 27/04/2017.
 */
var express = require('express');
var router = express.Router();
var TimeReportings = require('../../models/reporings/reports');
var dbHelper = require('../Helpers/dbRouteCommon');
var Employees = require('../../models/employees');


router.get('/check/:emlId', function (req, res, next) {
  dbHelper.getByQueryRoute(Employees, {
    employee_id: req.params.emlId
  }, {
    'employee_id':1,
    'avatarurl': 1,
    firstname:1,
    lastname: 1,
    checked: 1
  }, null, function (err, data) {
    if(err){
      res.send(err);
      return;
    }

    console.log(data);

    res.send(data);
  });
});

router.get('/code/:id', function (req, res, next) {
  var emplId = req.params.id;


});

router.post('/checkin', function (req, res, next) {
  dbHelper.createRoute(TimeReportings, {

  }, function (err, data){

  });

});


router.post('/checkout', function (req, res, next) {

});

router.put('/:id', function (req, res, next) {

});


module.exports = router;
