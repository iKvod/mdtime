/**
 * Created by rafa on 27/04/2017.
 */
var express = require('express');
var router = express.Router();
var TimeReportings = require('../../models/reporings/reports');
var dbHelper = require('../Helpers/dbRouteCommon');




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
