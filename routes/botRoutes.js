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

//buttons is object with arrays

var buttons = {
  button: [
    [{text: 'ff', callback_data: 'jksf'}],
    [{text: 'aa', callback_data: 'dddd'}]
  ]
};

var inlineKeybordOption = function (buttons) {

  var inlineButtons = [];
  var inlineButton = [];

  for(var key1 in buttons.button){
    for(var key2 in buttons.button[key1]){
      var keyboard  = {};
      keyboard.text = buttons.button[key1][key2].text;
      keyboard.callback_data = buttons.button[key1][key2].callback_data ;
      inlineButton.push(keyboard);

      // console.log('key- '+ key2 + " -values " + buttons.button[key1][key2]);
    }
    inlineButtons.push(inlineButton);
    inlineButton = [];
  }
  return {
    reply_markup: JSON.stringify({
      inline_keyboard: inlineButtons
    })
  }
};
var replyMesId = null;
bot.on('callback_query', function (msg, match) {
  // var f = function () {
  //   return 'Введите вашу должность(Ключевое слово)! \nБудьте в чате, регистрация еще не закончена'
  // };
  // console.log(msg);

  var chatId = msg.from.id || msg.from.chat.id;

  switch (msg.data){
    case 'да1':
      //TODO должен
      // TODO из базы выдается список Департаментов
      var yesOpt = {
        button: [
          [{text: 'Маркетинг', callback_data: 'dep'}],
          [{text: 'IT', callback_data: 'dep'}]
        ]
      };
      bot.sendMessage(chatId, " Какой отдел? выберите из списка", {
        reply_markup: inlineKeybordOption(yesOpt).reply_markup
      });
      break;
    case 'нет1':
      var noButton = {
        button:  [
          [{text: 'Ок', callback_data: '1мес'}],
          [{text: 'Отмена', callback_data: '2мес'}]
        ]
      };
      bot.sendMessage(chatId, "Введите вашу должность(Ключевое слово)! \nБудьте в чате, регистрация еще не закончена", {
        reply_markup: inlineKeybordOption(noButton).reply_markup
      });
      break;
    case 'да2':
      bot.sendMessage(chatId, "Введите время стажировки");
      break;
    case 'нет2':
      bot.sendMessage(chatId, "Введите срок стажировки(испытательнго срока)");
      break;
    case 'dep':
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
        reply_markup: inlineKeybordOption(interOpt).reply_markup
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

  if(breket != '/'){

    const sub = messText.slice(0,2);
    const breket = sub.slice(0,1);
    const messageId =  msg.message_id;
    var userData = {};

    userData.lastMessageId  = reply;
    userData.userId = chatId;
    userMess.push(userData);

    if( parseInt(sub) ){
      console.log(ssss);
      // TODO if candidate with such candidate exists
      var  firstButtons = {
        button: [[{text:'Да', callback_data: 'да1'}],
        [{text:'Нет', callback_data: 'нет1'}]]
      };

      //TODO and send  applied vacancy
      var replyOption = {
        reply_to_message_id: reply,
        reply_markup: inlineKeybordOption(firstButtons).reply_markup
      };
      bot.sendMessage(chatId, "Ваша должность такая ..?", replyOption);

    } else if (( messageId - msgId ) === 2 && msgId > 0){
      bot.sendMessage(chatId, 'Бот не может распознать вашу команду', replyOption);
    }

  } else if(breket === '/') {
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
});























bot.onText(/\/info/, function (msg, match) {
  var userId = msg.chat.id;

  // var message = "Доступные команды для работы с книгами:\n"
  //   + "1) /info - команда для получения информации о доступных командах для бота\n"
  //   + "2) /userinfo - информации о сотрудниках\n"
  //   + "3) /sendbook@touser <Название книги | Ссылка на веб ресурс> <ID сотрудника> - отправка книги определенному сотруднику\n"
  //   + "4) /sendbook@toserver <link | title > - отправка книги на сервер ввиде ссылки или Названия книги\n"
  //   + "5) /getbookinfo <ID сотрудника> - для получения списка книг сотрудников\n"
  //   + "6) @automatoChecklist_bot - название бота Checklist Automato\n";

  bot.sendMessage(userId, message);
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
bot.onText(/\/id (.+)/, function (msg, match) { // /employee_id - bot command

  var re = /\s*/;
  // var employee_id  = msg.text.substr(1);
  var employee_id = match[1];

  var bot_id = msg.chat.id;

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