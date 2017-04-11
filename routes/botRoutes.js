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
  bot.sendMessage(userId, 'Пожалуйста введит свой гостевой ID. \n');
});


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
    bot.sendMessage(botId, data.firstname + ", Ваш рабочий ID: " + data.employee_id);
  });

});

module.exports = botrouter;