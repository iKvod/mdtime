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
var ceoBotId = config.ceoBotID;
var fs = require('fs');
var moment = require('moment');
var imgDir = config.imageDirName;


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
  var emplId = req.params.id;
  var checklistCode = req.body.code;
  var id = req.body.emplId;
  var checked = req.body.checked;

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

          if(checked){
            var report = new TimeReportings({
              employee: id,
              checkin: new Date()
            });

            report.save(function (err, savedData) {
              var repId = savedData._id;
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

                    empl.checked = checked;

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

          } else {
            Employees.findOne({_id: id} )
              .select({ report: 1, botId: 1 })
              .exec(function (err, empl) {
                var reportLength = empl.report.length;
                var lastReportId = empl.report[reportLength - 1];
                TimeReportings.findOne({_id: lastReportId})
                  .select({ checkout: 1 })
                  .exec(function (err, data) {
                    if(err){
                      res.status(500).send('Неизвестная ошибка');
                      return;
                    }
                    if(data){
                      data.checkout = new Date();
                      data.save(function (err, savedData) {
                        if(err){
                          res.status(500).send(data);
                          return;
                        }
                        if(savedData){
                          empl.checked = checked;
                          empl.save(function (err, savedEmpl) {
                            bot.sendMessage(empl.botId, 'Вы круто сделали чекаут)');
                            res.send({message: 'Вы отметились в системе, данные записаны в базе'})
                          });
                        } else {

                        }
                      });
                    } else {
                      var error = {};
                      error.status = 404;
                      error.message = 'Отчет не найден';
                      res.send(error);
                    }
                  });
              });
          }
        });
      } else {
        res.status(404).send({message: "Вы ввели не правильный код\n Попробуйте еще раз"})
      }
    } else {
      res.status(500).send({message: "Неизвестная ошибка"});
    }
  });
});


router.post('/image/:id', function (req, res, next) {
  console.log(req.body.report);
  var date = new Date();
  var time = moment(date).format()
    .replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '');
  var id = req.body.report.id;
  var emlId = req.body.report.emplId;
  var b64Data = req.body.image;
  var checked = req.body.report.checked;
  var name = req.body.report.name;
  var imageDir =  imgDir + emlId + "/";
  var insight = req.body.report.insight;

  if(checked){ // checkin
    console.log('checkin')
    var buffer = new Buffer(b64Data, 'base64');
    var opt = {
      "caption": name + " пришел(а) на работу в: \n " + time
      // 'reply_markup': { // for rating
      //             "keyboard":[
      //                 [{text: '👍'}],
      //                 [{text: '👎'}]
      //             ],
      //             "resize_keyboard" : true,
      //             "one_time_keyboard" : true,
      //             "remove_keyboard":true
      //     }
    };

    checkDirectory(imageDir, function (error) {
      if(error){
        console.log(error);
        next(error);
        return;
      }

      var imgName = date + "_" + id + '.jpeg'
      var img = imageDir + imgName;
      // console.log(img);
      fs.writeFile(img, buffer,
        function(e){
          if(e) {
            console.log(e);
            next(e);
            return;
          }
          Employees.findOne({_id: id})
            .select({ firstname:1, lastname: 1, avatarurl: 1 })
            .exec(function (err, data) {
              if(err){
                next(err);
                return;
              }
              if(data){
                data.avatarurl = './public/photos/' + imgName;
                data.save(function (err, data) {
                  console.log(data);
                  bot.sendPhoto(ceoBotId, buffer, opt); // Ceo bot id
                  res.send({message: 'Данные отправлены'});
                });
              } else {
                console.log('Не извсетная ошибка при созранений аватара');
              }
            });
        });
    });

  } else {

    var buffer = new Buffer(b64Data, 'base64');
    var opt = {
      "caption": name + " уходит с работы в: \n" + time
    };

    var repOpt = {
      parse_mode: "Markdown"
    };

    checkDirectory(imageDir, function (error) {
      if(error){
        next(error);
        return;
      }
      // var img = imageDir + date + "_" + id + '.jpeg';
      var imgName = date + "_" + id + '.jpeg';
      var img = imageDir + imgName;

      fs.writeFile(img, buffer,
        function(e){
          if(e) {
            next(e);
            return;
          }
          Employees.findOne({_id: id})
            .select({ firstname:1, lastname: 1, avatarurl: 1 })
            .exec(function (err, data) {
              if(err){
                console.log(err);
                next(err);
                return;
              }
              if(data){
                data.avatarurl = './public/photos/' + imgName;
                data.save(function (err, data) {
                  // console.log(data);
                  bot.sendPhoto(ceoBotId, buffer, opt); // Ceo bot id
                  bot.sendMessage(ceoBotId, "[ИНСАЙТ:" + '](' + insight + ')', repOpt);
                  res.send({message: 'Данные отправлены'});
                });
              } else {
                console.log('Неизвеcтная ошибка при созданий аватара');
              }
            });
          // bot.sendPhoto(ceoBotId, buffer, opt); // Ceo bot id
          // res.send({message: 'Данные отправлены'});
        });
    });
  }
});

function checkDirectory(directory, callback) {
  console.log(directory);
  console.log(__dirname);
  fs.stat(directory, function(err, stats) {
    if (err && err.errno === -2) {
      console.log(err);
      fs.mkdir(directory, callback);
    } else {
      callback(err)
    }
  });
}


module.exports = router;
