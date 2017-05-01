/**
 * Created by rafa on 27/04/2017.
 */
/**
 * Created by rafa on 27/04/2017.
 */
var express = require('express');
var router = express.Router();
var dbHelper = require('../Helpers/dbRouteCommon');




router.get('/user/avatar', function (req, res, next) {
  var emplId = req.params.id;
});


router.post('/background', function (req, res, next) {
  dbHelper.createRoute(Model2222222222, {

  }, function (err, data){

  });
});


router.post('/checkout', function (req, res, next) {

});

router.put('/:id', function (req, res, next) {

});


module.exports = router;
