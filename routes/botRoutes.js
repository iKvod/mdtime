/**
 * Created by rafa on 08/04/2017.
 */
var express = require('express');
var botrouter = express.Router();
var request = require('request');

//var upload = require('multer')();
var fs = require('fs');

var config = require('../config');
var TelegramBot = require('node-telegram-bot-api');
var token = config.token;
var bot = new TelegramBot(token, { polling: true});
var Candidate = require('../models/candidates');
var idGen = require('../Utils/idGenerator');
var dbHelper = require('../Utils/dbCandidateQuery');
var botDbHelper = require('../Utils/bot/botDbHelpers');
var botInteractive = require('../Utils/bot/interactiveChat');
var botNotification = require('../Utils/bot/notifyHelp');

var inlButtHelp = require('../Utils/bot/inlineButtons');

//buttons is object with arrays

var buttons = {
  button: [
    [{text: 'ff', callback_data: 'jksf'}],
    [{text: 'aa', callback_data: 'dddd'}]
  ]
};
var newEmployeeData = [];
var tempTadata = {
  subsidaryId: null,
  candidateId: null,
  department: {
    id: null,
    name: null
  },
  position: {
    id: null,
    name: null,
    keyboard: []
  },
  keybData: [],
  intern: [],
  workertype: {
    id: null,
    name: null,
    keyboard: []
  },
  workertime: {
    id: null,
    name: null,
    keyboard: []
  },
  workermode: {
    id: null,
    name: null,
    keyboard: []
  },
  workerperiod: {
    id: null,
    name: null,
    keyboard: []
  }
};


var replyMesId = null;
bot.on('callback_query', function (msg, match) {

  // bot.answerCallbackQuery(msg.id, 'Вы выбрали: '+ msg.data, false);

  // console.log(msg);
  // var f = function () {
  //   return 'Введите вашу должность(Ключевое слово)! \nБудьте в чате, регистрация еще не закончена'
  // };
  // console.log(msg);

  var chatId = msg.from.id || msg.from.chat.id;
  var caseText = msg.data.slice(0,3);
  // console.log(caseText);

  switch (caseText){
    case '1_1':
      //TODO должен
      // TODO из базы выдается список Департаментов
      var subsId = newEmployeeData[0].subsidaryId;

      // console.log(newEmployeeData);
      botDbHelper.getSubsDepartments(subsId,function (err, data) {
        if(err){
          bot.sendMessage(chatId, err.message);
          // console.log(err);
          return;
        }
        inlButtHelp.makeButton('dep_', data, function (button, keyDataInfo) {
          // console.log(keyDataInfo);
          tempTadata.keybData.push(keyDataInfo) ;
          // console.log(tempTadata);
          bot.sendMessage(chatId, " Выберите департамент из списка", {
            reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
          });
        });
      });
      break;
    case '1_2':
      // var department = null;

      var noButton = {
        button:  [
          [{text: 'Ок', callback_data: '1мес'}],
          [{text: 'Отмена', callback_data: '2мес'}]
        ]
      };
      bot.sendMessage(chatId, "Введите вашу должность(Ключевое слово)! \nБудьте в чате, регистрация еще не закончена", {
        reply_markup: inlButtHelp.inlineKeyboardOption(noButton).reply_markup
      });


      break;

    case 'dep':
      var depText = msg.data.slice(4);
      //TODO make cancelable choise
      tempTadata.keybData[0].find(function (el, ind, array ){
        if(el.callback_data === depText){
          tempTadata.department.id = el.id;
          tempTadata.department.name = el.text;
          botNotification.notify(bot, msg.id, 'Вы выбрали департамент ' + el.text,  false);
          // console.log(tempTadata);
          return;
        }
      });

      botDbHelper.getPosDept(tempTadata.department.id, function (err, data) {
        // console.log(data);
        inlButtHelp.makePosButtons('pos_', data, function (button, keyDataInfo) {
          tempTadata.position.keyboard.push(keyDataInfo);
          bot.sendMessage(chatId, 'Пожалуйста, выберите должность кандидат из списка', {
            reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
          });
          // console.log(tempTadata.position);
        });
      });
      break;

    case 'pos':
      var choosenPosition = msg.data.slice(4);

      tempTadata.position.keyboard[0].find(function (el, i, array) {
        if(el.callback_data === choosenPosition){
          tempTadata.position.id = el.id;
          tempTadata.position.name = el.text;
          botNotification.notify(bot, msg.id, "Вы выбрали должность " + el.text, false);
          return;
        }
      });


      botDbHelper.getWorkerTypes(function (err, data) {
        inlButtHelp.makeRandomButtons('typ_', data, 'workertype', function (button, keyDataInfo) {
          tempTadata.workertype.keyboard.push(keyDataInfo);
          bot.sendMessage(chatId, 'Пожалуйста, выберите вид работы: ', {
            reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
          });
        });
      });

      break;

    case  'typ': // workertype
      var choosenType = msg.data.slice(4);

      tempTadata.workertype.keyboard[0].find(function (el, i, array) {
        if(el.callback_data === choosenType){
          tempTadata.workertype.id = el.id;
          tempTadata.workertype.name = el.text; //
          botNotification.notify(bot, msg.id, "Вы выбрали вид работы - " + el.text, false);
          return;
        }
      });

      botDbHelper.getInternPeriods(function (err, data) {
        inlButtHelp.makeRandomButtons('inp_', data, 'intperiod',
          function (buttons, keyDataInfo) {
            tempTadata.workerperiod.keyboard.push(keyDataInfo);
            bot.sendMessage(chatId, "Пожалуйста, выберите срок стажировки.", {
              reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
            });
          })
      });

      break;

    case 'inp': // if intern or not
      var choosenPeriod = msg.data.slice(4);
      tempTadata.workerperiod.keyboard[0].find(function (el, i, array) {
        if(el.callback_data === choosenPeriod){
          tempTadata.workerperiod.id = el.id;
          tempTadata.workerperiod.name = el.text;
          botNotification.notify(bot, msg.id, "Вы выбрали срок стажировки - "  + el.text, false);
          return;
        }
      });

      botDbHelper.getWorkerMode(function (err, data) {
            inlButtHelp.makeRandomButtons('mod_', data, 'mode',
              function (buttons, keyDataInfo) {
                tempTadata.workermode.keyboard.push(keyDataInfo);
                bot.sendMessage(chatId, "Пожалуйста, выберите рабочий тариф", {
                  reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
                });
              })
      });

      break;

    case 'mod': // worker mode
      var choosenMode = msg.data.slice(4);

      tempTadata.workermode.keyboard[0].find(function (el, i, array) {
        if(el.callback_data === choosenMode){
          tempTadata.workermode.id = el.id;
          tempTadata.workermode.name = el.text; //
          botNotification.notify(bot, msg.id, "Вы выбрали тариф - " + (el.text).toUpperCase(), false);
          return;
        }
      });

      if(tempTadata.workermode.name === 'Fixed'){

        //send work hours

        botDbHelper.getWorkTimes(function (err, data) {
          inlButtHelp.makeTimeButtons('tim_', data, 'starttime', 'endtime',
            function (buttons, keyDataInfo) {
              tempTadata.workertime.keyboard.push(keyDataInfo);
              bot.sendMessage(chatId, "Пожалуйста, выберите рабочее время для сотрудника", {
                reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
              });
            })
        });

      } else {

        // if not fixed then send
        botDbHelper.getWorkHours(function (err, data) {
          inlButtHelp.makeRandomButtons('hrs_', data, 'workhour', function (buttons, keyDataInfo) {
            reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
          });
        });



      }

      break;

    case 'tim': //worker time

      break;


    case 'нет2':
      bot.sendMessage(chatId, "Введите срок стажировки(испытательнго срока)");
      break;
    case '':
      console.log(msg.message.message_id);
      replyMesId = msg.message.id;
      var department = msg.text;
      var interOpt = {
        button: [
          [{text: '1 месяц', callback_data: '1mon'}],[{text: '2 месяца', callback_data: '2mon'}],
          [{text: '3 месяца', callback_data: '3mon'}],[{text: '4 месяца', callback_data: '4mon'}]
        ]
      };
      bot.sendMessage(chatId, "Ваш департамент: " + department + "\nТеперь введит время стажировки",{
        reply_markup: inlButtHelp.inlineKeyboardOption(interOpt).reply_markup
      });
      break;
    case '1mon':


  //TODO надо определить он действительно по этой должности должег проходить стажировку по выбранной по кнопке

      break;
    case '2mon':
      //TODO надо определить он действительно по этой должности должег проходить стажировку по выбранной по кнопке
      // нужен ID или названи позиции
      break;
    case '3mon':
      //TODO надо определить он действительно по этой должности должег проходить стажировку по выбранной по кнопке
      // нужен ID или названи позиции

      break;
    case '4mon':
      //TODO надо определить он действительно по этой должности должег проходить стажировку по выбранной по кнопке
      // нужен ID или названи позиции
      break;
    default:
      break;
  }
});




//constants
var userMess = [];
var counter = 0;
var lastMessageId = null;
var msgId = '';
var ssss = [];


bot.on('message', function (msg) {
  ssss.push(msg.chat.id);
  // console.log(msg);
  var messText = msg.text;
  var chatId = msg.chat.id;
  var reply = msg.message_id;
  var breket = messText.slice(0,1);
// console.log(messText);

  if(breket != '/'){

    const sub = messText.slice(0,2);
    const breket = sub.slice(0,1);
    const messageId =  msg.message_id;

    // 17MD1328AC
    var subsAbbr = messText.slice(2,4); // like MD
    var depAbbr = messText.slice(8); // 17A
    var userData = {};

    userData.lastMessageId  = reply;
    userData.userId = chatId;
    userMess.push(userData);

    if( parseInt(sub) ){

      if(messText.length === 10){

          // if it is must to find by regex use this
        botDbHelper.getCandidatePos(subsAbbr, depAbbr, function (err, data) {
          if(err){
            bot.sendMessage(chatId, err.message + " \nПопробуйте еще раз!");
          } else {
            tempTadata.subsidaryId = data._id;
            tempTadata.candidateId = messText;
            newEmployeeData.push(tempTadata);
            // console.log(data);

            bot.sendMessage(chatId, "Кандидат подал в компанию " + data.subsidary + "\nЗаписать этого пользователя С этим данным? ", {
              reply_markup: JSON.stringify({
                inline_keyboard:[
                  [{ text:'Да', callback_data: '1_1'}, { text:'Нет', callback_data: '1_2' }]
                ]})
            })
          }
        });



        // console.log(ssss);
        //TODO if candidate with such candidate exists
        //TODO and send  applied subsidary and vacancy



      } else {

        // TODO check employee id

        bot.sendMessage(chatId, "Вы наш сотрудник", {

          reply_markup: JSON.stringify({
            inline_keyboard:[
              [{ text:'Да', callback_data: 'yes_1'}, { text:'Да', callback_data: 'no_1' }]
            ]})
        })


      }


    } /*else if (( messageId - msgId ) === 2 && msgId > 0){
      bot.sendMessage(chatId, 'Бот не может распознать вашу команду', replyOption);
    }*/

  } else if(breket === '/') {

    var id = messText.slice(1,3);
    if(id ==='id'){



    } else {
      var sub = messText.slice(1, 3);
      var employee_id = messText.slice(1);

      if (employee_id.length >= 6 && employee_id.length <= 8 && (typeof parseInt(sub)) === 'number') {
        dbHelper.getEmployeeById(employee_id, function (err, emplData) {
          if (err) {
            if (err.status === 500) {
              bot.sendMessage(chatId, err.message + " \n\t Err:" + err);
              return
            } else if (err.status === 404) {
              bot.sendMessage(chatId, err.message + " \n\t Err:" + err);
              return
            }
            return
          }
          bot.sendMessage(chatId, emplData);
        });
      } else if (parseInt(sub)) {
        bot.sendMessage(chatId, "Длина строки Вашего ID превышает больше 8");
      }
    }
  }
});


bot.onText(/\/info/, function (msg, match) {
  var userId = msg.chat.id;
  botDbHelper.getDepPositions('58f4eee6db10101672690a0f', function (err, data) {
    if(err){
      console.log(err);
      return
    }

    console.log(data);
  });
  // var message = "Доступные команды для работы с книгами:\n"
  //   + "1) /info - команда для получения информации о доступных командах для бота\n"
  //   + "2) /userinfo - информации о сотрудниках\n"
  //   + "3) /sendbook@touser <Название книги | Ссылка на веб ресурс> <ID сотрудника> - отправка книги определенному сотруднику\n"
  //   + "4) /sendbook@toserver <link | title > - отправка книги на сервер ввиде ссылки или Названия книги\n"
  //   + "5) /getbookinfo <ID сотрудника> - для получения списка книг сотрудников\n"
  //   + "6) @automatoChecklist_bot - название бота Checklist Automato\n";

  // bot.sendMessage(userId, message);
});

bot.onText(/\/start/, function (msg, match) {
  var userId = msg.chat.id;
  bot.sendMessage(userId, 'Пожалуйста введите свой гостевой ID. \n');
});

//
bot.onText(/\/guest (.+)/, function (msg, match) {
  // var gId =  msg.text.substr(1);
  var botId = msg.chat.id;
  var obj = {};
  obj.botId = botId;
  obj.username = msg.chat.username;
  var gId = match[1];

  idGen.candidateFind(gId, obj, function (err, candidate) {
    if(err){
      bot.sendMessage(botId, err.message);
      return
    }
    bot.sendMessage(botId, candidate.firstname + ' Ваш ID ' + candidate.employee_id);
  })
});

// user data
bot.onText(/\/data (.+)/, function (msg, match) { // /employee_id - bot command

  var re = /\s*/;
  // var employee_id  = msg.text.substr(1);
  var employee_id = match[1];
  var bot_id = msg.chat.id;

  //parsing
  var str = employee_id.slice(0,2);

  if(parseInt(str)){
    dbHelper.getEmployeeById(employee_id, function (err, emplData) {
      if(err){
        if(err.status === 500){
          bot.sendMessage(bot_id, err.message + " \n\t Err:" + err);
          return
        } else if(err.status === 404){
          bot.sendMessage(bot_id, err.message + " \n\t Err:" + err);
          return
        }
        return
      }
      bot.sendMessage(bot_id, emplData);
    });
  } else {
    dbHelper.getEmployeeById()

  }
});


// user id
bot.onText(/\/id (.+)/, function (msg, match) { // /employee_id - bot command

  var employeeName = match[1].slice(0,1).toUpperCase() + match[1].slice(1);
  var bot_id = msg.chat.id;

  dbHelper.getEmployeeId(bot_id, employeeName, function (err, data) {
    if(err){
      bot.sendMessage(bot_id, err.message);
      return;
    }

    bot.sendMessage(bot_id, data);
  });


});

// to fetch employees passwords
//only for admins can get it
bot.onText(/\/pass (.+)/, function (msg, match) { // /employee_id pass - bot command
  var bot_id = msg.chat.id;
  var pass  = msg.text.substr(1,4);
  var employee_id = match[1];

  if(pass === 'pass'){
     dbHelper.getEmployeePasswords(employee_id, bot_id, function (err, data) {
       if(err){
         if(err.status === 401){
           bot.sendMessage(bot_id, err.message);
           return;
         } else if(err.status === 500){
           bot.sendMessage(bot_id, err.message);
           return;
         } else if(err.status === 404){
           bot.sendMessage(bot_id, err.message);
           return;
         }
         return;
       }
       bot.sendMessage(bot_id, data);
     })
   } else {
     bot.sendMessage(bot_id, "Неизвестная команда. Попробуйте еще раз");
   }
});

bot.onText(/\/myid/, function (msg) {
  var botId = msg.chat.id;
  botDbHelper.getMyId(botId, function (err, data) {
    if(err){
      if(err.status === 500){
        bot.sendMessage(botId, err.message);
        return
      } else if(err.status === 404){
        bot.sendMessage(botId, err.message);
        return
      }
      return;
    }
    if(data){
      bot.sendMessage(botId, data.firstname + ", Ваш рабочий ID: " + data.employee_id);
    } else {
      bot.sendMessage(botId, "Неизвестная ошибка. Обратитесь в тех поддержку");
    }
  });
});

bot.onText(/\/whoadmin/, function (msg, match) {
  var botId = msg.chat.id;
  botDbHelper.whoAdminPrevileges(botId, function (err, parsedData) {
    if(err){
      bot.sendMessage(botId, err.message);
      return;
    }
    bot.sendMessage(botId, parsedData);
  });
});

bot.onText(/\/mypass/, function (msg, match) {
  var botId = msg.chat.id;

  botDbHelper.getMyPass(botId, function (err, passwords) {
    if(err){
      bot.sendMessage(botId, err.message);
      return
    }
    bot.sendMessage(botId, passwords);
  });
});



module.exports = botrouter;