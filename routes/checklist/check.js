/**
 * Created by rafa on 27/04/2017.
 */
var express = require('express');
var router = express.Router();
var TimeReportings = require('../../models/reporings/reports');
var dbHelper = require('../Helpers/dbRouteCommon');
var Employees = require('../../models/employees');
var redisClient = require('../../Utils/redis/redis');
var TelegramBot = require('../../node_modules/node-telegram-bot-api');
var config = require('../../config');
var token = config.token;
var bot = new TelegramBot(token);


router.get('/:id', function (req, res, next) {
  dbHelper.getByQueryRoute(Employees, {
    employee_id: req.params.id
  }, {
    'employee_id':1,
    'avatarurl': 1,
    firstname:1,
    lastname: 1,
    checked: 1,
    botId: 1
  }, null, function (err, data) {
    if(err){
      next(err);
      return;
    }
    if(data){
        res.send(data);
    } else {
      res.status(500).send(data);
    }
  });
});


router.get('/check/:id', function (req, res, next) {
  dbHelper.getByQueryRoute(Employees, {
    employee_id: req.params.id
  }, {
    'employee_id':1,
    'avatarurl': 1,
    firstname:1,
    lastname: 1,
    checked: 1,
    botId: 1
  }, null, function (err, data) {
    if(err){
      next(err);
      return;
    }
    if(data){
      var code = Math.floor(Math.random() * (7777-1111)) + 1111;
      redisClient.hmset(req.params.id, 'checklistCode', code, function (err, mes) {
        if(err){
          return
        }
        if(mes){
          bot.sendMessage(data.botId, data.firstname + " , Ваш код: " + code);
          res.send({ data: data, message: data.firstname + " , Ваш код: " + code });
        }
      });
    }
  });
});



router.put('/code/:id', function (req, res, next) {
  // console.log('code')
  var emplId = req.params.id;
  var checklistCode = req.body.code;
  var id = req.body.emplId;
  // console.log(checklistCode);

  redisClient.hget(emplId, "checklistCode", function (err, data) {
    if(err){
      res.status(500).send({message: "Неизвестная ошибка"});
      return
    }
    if(data) {
      if(data === checklistCode){
        redisClient.hdel(emplId, "checklistCode", function (err, reply) {
          if(err){
            return;
          }
          var report = new TimeReportings({
            employee: id,
            checkin: new Date()
          });

          report.save(function (err, savedData) {
            var repId = savedData._id;
            console.log(savedData);
            if(err){
              res.status(500).send(err);
              return;
            }

            if(savedData){
              Employees.findOne({_id:id})
                .select({ 'report':1, 'checked': 1, 'botId':1 })
                .exec(function (err, empl) {
                  if(err){
                    next(err);
                    return;
                  }

                  empl.checked = true;

                  if(empl){
                    empl.report.push(repId);
                  }

                  empl.save(function (err, savedEmpl) {
                    if(err){
                      next(err);
                      return;
                    }

                    if(savedEmpl){
                      res.send({message: "Вы отметились в системе"});
                      bot.sendMessage(empl.botId, 'Вы круто сделали чекин)')
                    }

                  })

                })
            }

          });
        });
      } else {
        res.status(404).send({message: "Вы ввели не правильный код\n Попробуйте еще раз"})
      }
    } else {
      res.status(500).send({message: "Неизвестная ошибка"});
    }
  });
});

router.post('/checkin', function (req, res, next) {
  dbHelper.createRoute(TimeReportings, {

  }, function (err, data){

  });

});


router.post('/checkout', function (req, res, next) {

});

// router.put('/:id', function (req, res, next) {
//
// });


module.exports = router;
