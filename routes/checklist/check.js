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
  console.log(req.body);
  // console.log('code');
  var emplId = req.params.id;
  var checklistCode = req.body.code;
  var id = req.body.emplId;
  var checked = req.body.checked;
  // console.log(checklistCode);
  // console.log(checked);

  redisClient.hget(emplId, "checklistCode", function (err, data) {
    if(err){
      res.status(500).send({message: "Неизвестная ошибка"});
      return
    }
    if(data) {
      if(data === checklistCode){
        redisClient.hdel(emplId, "checklistCode", function (err, reply) {
          if(err){
            console.log(err);
            return;
          }

          if(checked){
            console.log('checkin')
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

          }else {
            // console.log('checkout');
            Employees.findOne({_id: id} )
              .select({ report:1 })
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

                            res.send({message: 'Вы отметились в системе, данные записаны в базе'})
                          });
                          // console.log(savedData);
                          // res.send(savedData);
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



// router.post('/image/:id', function (req, res, next) {
//   var baseImg = req.body.image;
//   var message = req.body.message;
//
//
//
// });
router.post('/image/:id', function (req, res, next) {
  var date = new Date();
  var time = date.toLocaleString();
  var id = req.body.report.id;
  var b64Data = req.body.image;
  var report = req.body.report.report;
  var bookReport = req.body.report.bookreport;
  var bookReportCeo = '';
  var name = req.body.report.name;
  var botId = req.body.report.botId;
  var caption = '';
  var messageToUser = '';
  var messageToManager = null;
  var checkOut = false;


  if(message && report && bookReport){
    caption = time + "\n" + name + " " + message + "\n" + report + "\n" ;
    bookReportCeo = "Мои заметки по книге:\n "+ bookReport + "\n";
    messageToUser = "У вас круто получилось сделать Checkout!";
    checkOut = true;
    messageToManager = time + "\n"  + "Отчет: \n " + name + " - "+ report;
  } else if (message && (report !== undefined) && (bookReport === undefined) ) {
    caption = time + "\n" + name + " " + message + "\n" + report + "\n";
    bookReportCeo = "Я еще не прочел книгу" + "\n";
    messageToUser = "У вас круто получилось сделать Checkout!";
    checkOut = true;
    messageToManager = time + "\n"  + "Отчет: \n " + name + " - "+ report;
  } else if(message && (report === undefined) && (bookReport === undefined)){
    caption = time + "\n" + name + " " + message;
    messageToUser = "У вас круто получилось сделать Checkin!";

  }

  var buffer = new Buffer(b64Data, 'base64');
  var opt = {
    "caption": caption,
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

  var bookOpt = {
    'parse_mode':"Markdown"
  };
  //
  bot.sendPhoto(ceoBotId, buffer, opt); // Rustam's bot ID
  //sending comment about read books
  if(bookReportCeo){
    bot.sendMessage(ceoBotId, bookReportCeo, bookOpt);
  }
  // sends to manager Report for current day
  if(messageToManager !== null){
    bot.sendMessage(managerBotId, messageToManager); //  Ayganym's bot ID
  }
  //sending message to  employee if he checked out or in
  //and must read book info
  if(checkOut){
    dbBook.fetchCurrentBook(botId,  messageToUser, dbBook.sendBookCheckout);
  } else {
    bot.sendMessage(botId, messageToUser); // Users ID send if he checked in or out
  }

  //  //testing
  // bot.sendPhoto(207925830, buffer, opt); // testing
  // //sends to manager Report for current day
  //  if(messageToManager !== null){
  //      bot.sendMessage(207925830, messageToManager); //  Ayganym's bot ID
  //  }
  //  if(checkOut){
  //      fetchBook(botId, sendBookCheckout, messageToUser);
  //  } else {
  //      bot.sendMessage(botId, messageToUser); // Users ID send if he checked in or out
  //  }


  fs.writeFile('./public/photos/' + date.getTime() + "_" + id + '.jpeg', buffer, function(e){
    if(e) {
      console.log(e)
    }
  });

  res.send("OK");
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
