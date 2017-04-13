/**
 * Created by rafa on 12/04/2017.
 */
var express = require('express');
var botrouter = express.Router();
var request = require('request');

//var upload = require('multer')();
var fs = require('fs');
var config = require('../../config');

var TelegramBot = require('node-telegram-bot-api');
var token = config.token;
var bot = new TelegramBot(token);

var Candidate = require('../../models/candidates');
var idGen = require('../idGenerator');
var dbHelper = require('../dbCandidateQuery');
var botDbHelper = require('./botDbHelpers');


// bot.on('callback_query', function (msg, match) {
//
// });
//
// //constants
// var userMess = [];
// var counter = 0;
// var lastMessageId = null;
// var msgId = '';
//
// bot.on('message', function (msg) {
// console.log(msg);
//   var messText = msg.text;
//   var chatId = msg.chat.id;
//   var reply = msg.message_id;
//   var breket = messText.slice(0,1);
//
//   if(breket != '/'){
//
//     const sub = messText.slice(0,2);
//     const breket = sub.slice(0,1);
//     const messageId =  msg.message_id;
//     var userData = {};
//
//     userData.lastMessageId  = reply;
//     userData.userId = chatId;
//     userMess.push(userData);
//
//     if( parseInt(sub) ){
//
//       //TO do and send  applied vacancy
//       console.log(userMess);
//       var replyOption = {
//         reply_to_message_id: reply,
//         reply_markup: JSON.stringify({
//           inline_keyboard: [
//             [{text:'Да', callback_data: 'Hello World from keyboard'}],
//             [{text:'Нет', callback_data: ' Вы ответили нет!'}]
//           ]
//         })
//       };
//       bot.sendMessage(chatId, "Нащжмите на кнопку", replyOption);
//
//     } else if (( messageId - msgId ) === 2 && msgId > 0){
//       bot.sendMessage(chatId, 'Бот не может распознать вашу команду', replyOption);
//     }
//
//
//
//   } else if(breket === '/') {
//     var sub = messText.slice(1, 3);
//     var employee_id = messText.slice(1);
//
//     if (employee_id.length >= 6 && employee_id.length <= 8 && (typeof parseInt(sub)) === 'number') {
//       dbHelper.getEmployeeById(employee_id, function (err, emplData) {
//         if (err) {
//           if (err.status === 500) {
//             bot.sendMessage(chatId, err.message + " \n\t Err:" + err);
//             return
//           } else if (err.status === 404) {
//             bot.sendMessage(chatId, err.message + " \n\t Err:" + err);
//             return
//           }
//           return
//         }
//         bot.sendMessage(chatId, emplData);
//       });
//     } else if (parseInt(sub)) {
//       bot.sendMessage(chatId, "Длина строки Вашего ID превышает больше 8");
//     }
//   }
// });


module.exports = botrouter;


/*
bot.on('message', function (msg) {

  var messText = msg.text;
  var chatId = msg.chat.id;
  var reply = msg.message_id;
  var breket = messText.slice(0,1);

  if(breket != '/'){
    const sub = messText.slice(0,2);
    const breket = sub.slice(0,1);
    const messageId = msg.message_id;

    if( parseInt(sub) ){

      var replyOption = {
        reply_to_message_id: reply
      };
      bot.sendMessage(chatId, sub, replyOption);

    } else if (( messageId - msgId ) === 2 && msgId > 0){
      bot.sendMessage(chatId, 'Бот не может распознать вашу команду', replyOption);
    }
  } else if(breket === '/'){
    var sub = messText.slice(1,3);
    var employee_id = messText.slice(1);

    if(employee_id.length >= 6 && employee_id.length <= 8 && (typeof parseInt(sub)) === 'number' ){
      dbHelper.getEmployeeById(employee_id, function (err, emplData) {
        if(err){
          if(err.status === 500){
            bot.sendMessage(chatId, err.message + " \n\t Err:" + err);
            return
          } else if(err.status === 404){
            bot.sendMessage(chatId, err.message + " \n\t Err:" + err);
            return
          }
          return
        }
        bot.sendMessage(chatId, emplData);
      });
    } else if(parseInt(sub))  {
      bot.sendMessage(chatId, "Длина строки Вашего ID превышает больше 8");
    }
  }
});*/
