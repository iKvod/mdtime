/**
 * Created by rafa on 10/04/2017.
 */
/**
 * Created by rafa on 09/04/2017.
 */

var express = require('express');
var router = express.Router();
var Candidate = require('../models/candidates');
var Employees = require('../models/employees');

router.get('/', function(req, res, next){
  Employees.find({})
    .exec(function (err, data) {
      if(err){
        err.message = 'Неизвестная ошибка';
        res.status(500).send(err.message);
      }
      if(data){
        res.send(data);
      } else {
        res.status(404).send({message: "NOT FOUND"});
      }
    })
});

router.post('/manual', function (req, res, next) {
  var data = req.body;

  var empl = new Employees({
    employee_id: data.employee_id,
    botId: data.bot_id,
    username: data.username,
    firstname: data.firstname,
    lastname:data.lastname,
    email:data.email,
    fired: data.fired,
    phonenumber: data.phonenumber,
    // department: data.department,
    position: data.position
  });

  empl.save(function (err, savedEmpl) {
    if(err){
      err.message = 'Неизвестная ошибка';
      res.status(500).send(err);
      return;
    }
    res.send(savedEmpl);
  });
});

//Not compleated
router.put('/:id', function (req, res, next) {


});

// router.put('/admin/:id', function (req, res, next) {
//   Employees.findById(req.params.id)
//     .exec(function (err, empl) {
//       if(err){
//         res.status(500).send({message: "Неизвестная ошибка. r/can"});
//         return;
//       }
//       empl.admin = true;
//       empl.save(function (err, savedEmpl) {
//
//
//       });
//     })
// });
// router.delete('/', function (req, res, next) {
//
// });
//
//
// router.get('/:id', function (req, res, next) {
//
// });
//
// router.put('/:id', function (req, res, next) {
//
// });
//
// router.delete('/:id', function (req, res, next) {
//
// });
module.exports = router;