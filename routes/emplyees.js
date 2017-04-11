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

router.get('/password', function (req, res, next) {

  fetchEmplForPasGen(function (err, data) {
    if(err){
      res.status(err.status || 500).send(err.message);
      return;
    }

    passwGenRecursively(0, data, function (err, message) {
      if(err){
        res.status(err.status || 500).send(err.message);
        return;
      }

      res.send(message.message);
    });
  })
});
// for generating password

var passwGenRecursively = function (i, data, callback) {
  var len = data.length;
  if(i < len){
    data[i].generatePasswords();
    data[i].save(function (err, saved) {
      if(err){
        err.message = 'Не сохранен данные при генерации паролей!'
        err.status = 500;
        callback(err, null);
        return;
      }
      passwGenRecursively(i + 1, data, callback);
      // callback(null, "ok");
    });
  } else {
    callback(null, {message: "Данные сохранены"});
  }
};

var fetchEmplForPasGen = function(callback){
  Employees.find({})
    .exec(function (err, empl) {
      if(err){
        err.message = "Неизвестная ошибка";
        err.status = 500;
        callback(err, null);
        return;
        // errorHandler(500, )
      }
      if(empl.length > 0){
        callback(err, empl);
      }else {
        var error = {};
        error.message = 'Пользователи не найдены; Возможно в базе нет пользователей';
        error.status = 404;
        callback(error, null);
      }
    });
};

var errorHandler = function(status, message){
  var error = {};
  error.message = message;
  error.status = status;
  return error;
};


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