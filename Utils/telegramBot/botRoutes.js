/**
 * Created by rafa on 08/04/2017.
 */
var express = require('express');
var botrouter = express.Router();
var request = require('request');

//var upload = require('multer')();
var fs = require('fs');

var config = require('../../config');
var TelegramBot = require('node-telegram-bot-api');
var redisClient = require('../redis/redis');
var token = config.token;
var bot = new TelegramBot(token, { polling: true});
// var Candidate = require('../../../models/users/candidates');
var idGen = require('../idGenerator');
var dbHelper = require('./bot/dbCandidateQuery');
var botDbHelper = require('./bot/botDbHelpers');
var botNotification = require('./bot/notifyHelp');

var inlButtHelp = require('./bot/inlineButtons');
var inlineButtons = require('./bot/staticInlineButtons/staticInlineButtons');
var inlineCbHandlers = require('./bot/inlineButtonHandler/notifyRoutines');


//start
var startHandler = {
  messageId: null,
  messageText: null,
  data: [],
  isRegistred: false,
  isStart: false
};

var tempTadata = {
  subsidaryId: null,
  candidateId: null,
  subsidary: {
    id: null,
    name: null,
    keyboard: []
  },
  department: {
    id: null,
    name: null,
    keyboard: []
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
  },
  workhour: {
    id: null,
    name: null,
    keyboard: []
  },
  workstartime: {
    startime: null,
    isStarttime: false
  },
  workendtime: {
    endtime: null,
    isEndTime: false
  }
};
var test = [];
// will work only notifications like Я ухожу с работы Опаздываю
//
var notifyRoutine = {
  isNotify: false
};

console.log("Global " + notifyRoutine.isNotify);

bot.on('callback_query', function (msg, match) {

  var chatId = msg.from.id || msg.from.chat.id;
  // for handling inline buttons
  var caseText = msg.data.slice(0,3);

  //previous inline command handler
  // if(!notifyRoutine.isNotify){
  //   switch (caseText){
  //     case '1_1':
  //       //TODO должен
  //       // TODO из базы выдается список Департаментов
  //       var subsId = tempTadata.subsidary.id;
  //       console.log('here');
  //
  //       botDbHelper.getSubsDepartments(subsId, function (err, data) {
  //         if(err){
  //           bot.sendMessage(chatId, err.message);
  //           return;
  //         }
  //         inlButtHelp.makeButton('dep_', data, function (button, keyDataInfo) {
  //           tempTadata.keybData.push(keyDataInfo) ;
  //           bot.sendMessage(chatId, " В какой департамент направлен кандидат:", {
  //             reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
  //           });
  //         });
  //       });
  //       break;
  //     case '1_2':
  //
  //       var answer = msg.data.slice(4);
  //       //TODO make cancelable choise
  //
  //       botDbHelper.getAllSubs( function (err, data) {
  //         inlButtHelp.makeRandomButtons('sub_', data, 'subsidary', function (button, keyDataInfo) {
  //           tempTadata.subsidary.keyboard.push(keyDataInfo);
  //           bot.sendMessage(chatId, 'Пожалуйста, выберите компанию для регистрации:', {
  //             reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
  //           });
  //         });
  //       });
  //
  //       break;
  //
  //     case 'sub':
  //       var ans = msg.data.slice(4);
  //       var subsId = null;
  //       console.log(ans);
  //       tempTadata.subsidary.keyboard[0].find(function (el, ind, array ){
  //         if(el.callback_data === ans){
  //           tempTadata.subsidary.id = el.id;
  //           tempTadata.subsidary.name = el.text;
  //           botNotification.notify(bot, msg.id, 'Вы выбрали Компанию: ' + el.text,  false);
  //           return;
  //         }
  //       });
  //
  //       subsId = tempTadata.subsidary.id;
  //
  //       if(subsId){
  //
  //         botDbHelper.getSubsDepartments(subsId, function (err, data) {
  //           if(err){
  //             bot.sendMessage(chatId, err.message);
  //             return;
  //           }
  //           inlButtHelp.makeButton('dep_', data, function (button, keyDataInfo) {
  //             tempTadata.department.keyboard.push(keyDataInfo) ;
  //             bot.sendMessage(chatId, " В какой департамент направлен кандидат:", {
  //               reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
  //             });
  //           });
  //         });
  //       } else {
  //
  //       }
  //
  //       break;
  //
  //     case 'dep':
  //       var depText = msg.data.slice(4);
  //       //TODO make cancelable choise
  //       tempTadata.department.keyboard[0].find(function (el, ind, array ){
  //         if(el.callback_data === depText){
  //           tempTadata.department.id = el.id;
  //           tempTadata.department.name = el.text;
  //           botNotification.notify(bot, msg.id, 'Вы выбрали департамент - ' + el.text,  false);
  //           return;
  //         }
  //       });
  //
  //       botDbHelper.getPosDept(tempTadata.department.id, function (err, data) {
  //         inlButtHelp.makePosButtons('pos_', data, function (button, keyDataInfo) {
  //           tempTadata.position.keyboard.push(keyDataInfo);
  //           bot.sendMessage(chatId, 'Пожалуйста, выберите должность кандидат из списка: ', {
  //             reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
  //           });
  //         });
  //       });
  //       break;
  //
  //     case 'pos': // выбранная должность
  //       var choosenPosition = msg.data.slice(4);
  //
  //       tempTadata.position.keyboard[0].find(function (el, i, array) {
  //         if(el.callback_data === choosenPosition){
  //           tempTadata.position.id = el.id;
  //           tempTadata.position.name = el.text;
  //           botNotification.notify(bot, msg.id, "Теперь, укажите его должность: " + el.text, false);
  //           return;
  //         }
  //       });
  //
  //
  //       botDbHelper.getWorkerTypes(function (err, data) {
  //         inlButtHelp.makeRandomButtons('typ_', data, 'workertype', function (button, keyDataInfo) {
  //           tempTadata.workertype.keyboard.push(keyDataInfo);
  //           bot.sendMessage(chatId, 'Выберите условия приема на работу: ', {
  //             reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
  //           });
  //         });
  //       });
  //       break;
  //
  //     case  'typ': // workertype Стажировка или Испытательный срок
  //       var choosenType = msg.data.slice(4);
  //
  //
  //       tempTadata.workertype.keyboard[0].find(function (el, i, array) {
  //         if(el.callback_data === choosenType){
  //           tempTadata.workertype.id = el.id;
  //           tempTadata.workertype.name = el.text; //
  //           botNotification.notify(bot, msg.id, "Вы выбрали условия работы - " + el.text, false);
  //           return;
  //         }
  //       });
  //
  //       // если условия работы Испытательный срок, то отправляется
  //       // кнопка с данными на испытательный срок (т.е. 2нед. 1 мес, 2 мес.)
  //       if(tempTadata.workertype.name === 'Испытательный срок'){
  //
  //         botDbHelper.getProbPeriods(function (err, data) {
  //           inlButtHelp.makeRandomButtons('prb_', data, 'probperiod',
  //             function (buttons, keyDataInfo) {
  //               tempTadata.workerperiod.keyboard.push(keyDataInfo);
  //               bot.sendMessage(chatId, "Укажите период испытательного срока:", {
  //                 reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
  //               });
  //             })
  //         });
  //
  //       } // если условие работы Стажирока то отправл-ся кнопка с данными сроков Стажировки
  //       else if(tempTadata.workertype.name === 'Стажировка'){
  //         botDbHelper.getInternPeriods(function (err, data) {
  //           inlButtHelp.makeRandomButtons('inp_', data, 'intperiod',
  //             function (buttons, keyDataInfo) {
  //               tempTadata.workerperiod.keyboard.push(keyDataInfo);
  //               bot.sendMessage(chatId, "Укажите период стажировки кандидата:", {
  //                 reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
  //               });
  //             })
  //         });
  //       }
  //       break;
  //
  //     case 'inp': // if intern or not
  //       var choosenPeriod = msg.data.slice(4);
  //       tempTadata.workerperiod.keyboard[0].find(function (el, i, array) {
  //         if(el.callback_data === choosenPeriod){
  //           tempTadata.workerperiod.id = el.id;
  //           tempTadata.workerperiod.name = el.text;
  //           botNotification.notify(bot, msg.id, "Вы выбрали период стажировки - "  + el.text, false);
  //           return;
  //         }
  //       });
  //
  //       botDbHelper.getWorkerMode(function (err, data) {
  //         inlButtHelp.makeRandomButtons('mod_', data, 'mode',
  //           function (buttons, keyDataInfo) {
  //             tempTadata.workermode.keyboard.push(keyDataInfo);
  //             bot.sendMessage(chatId, "Пожалуйста, выберите тариф рабочего времени: ", {
  //               reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
  //             });
  //           })
  //       });
  //
  //       break;
  //
  //     case 'prb': // if probation period
  //       var choosenPeriod = msg.data.slice(4);
  //       tempTadata.workerperiod.keyboard[0].find(function (el, i, array) {
  //         if(el.callback_data === choosenPeriod){
  //           tempTadata.workerperiod.id = el.id;
  //           tempTadata.workerperiod.name = el.text;
  //           botNotification.notify(bot, msg.id, "Вы выбрали период испытательного срока - "  + el.text, false);
  //           return;
  //         }
  //       });
  //
  //       botDbHelper.getWorkerMode(function (err, data) {
  //         inlButtHelp.makeRandomButtons('mod_', data, 'mode',
  //           function (buttons, keyDataInfo) {
  //             tempTadata.workermode.keyboard.push(keyDataInfo);
  //             bot.sendMessage(chatId, "Пожалуйста, выберите тариф рабочего времени: ", {
  //               reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
  //             });
  //           })
  //       });
  //
  //       break;
  //
  //     case 'mod': // worker mode(Fixed Free Flex)
  //       var choosenMode = msg.data.slice(4);
  //
  //       tempTadata.workermode.keyboard[0].find(function (el, i, array) {
  //         if(el.callback_data === choosenMode){
  //           tempTadata.workermode.id = el.id;
  //           tempTadata.workermode.name = el.text; //
  //           botNotification.notify(bot, msg.id, "Вы выбрали тариф - " + (el.text).toUpperCase(), false);
  //           return;
  //         }
  //       });
  //
  //       if(tempTadata.workermode.name === 'Fixed'){
  //         //send work hours
  //         // botDbHelper.getWorkTimes(function (err, data) {
  //         //   inlButtHelp.makeRandomButtons('tim_', data, 'starttime',
  //         //     function (buttons, keyDataInfo) {
  //         //       tempTadata.workertime.keyboard.push(keyDataInfo);
  //         //       bot.sendMessage(chatId, "Пожалуйста, выберите рабочее время для сотрудника: ", {
  //         //         reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
  //         //       });
  //         //     })
  //         // });
  //
  //         //sending message to set the workday starttime
  //         tempTadata.workstartime.isStarttime= true; //
  //
  //
  //         /*
  //          * Спасибо, Имя!
  //          Кандидат ФИО зарегистрирован в системе. Его новый ID: 17MD12
  //          Для получения доступа в систему предупредите кандидата сдать необходимый пакет документов.
  //          После того как, вы получите подтверждение Вам будет отправлена ссылка для перевода кандидата в статус сотрудника.
  //          *
  //          *
  //          * */
  //
  //         //TODO generate ID
  //         //TODO get acceptence
  //         //TODO send mail and sms with link to telegram bot and new employee ID to candidate
  //
  //         bot.sendMessage(chatId, 'Пожалуйста, введите НАЧАЛО РАБОЧЕГО ' +
  //           'ВРЕМЕНИ для данного кандидата:\n' +
  //           '(Пример: 08:00 или 08:30)');
  //
  //       } else if(tempTadata.workermode.name === 'Free'){
  //         // if not fixed then send
  //         botDbHelper.getWorkHours(function (err, data) {
  //           inlButtHelp.makeRandomButtons('hrs_', data, 'workhour', function (buttons, keyDataInfo) {
  //             tempTadata.workhour.keyboard.push(keyDataInfo);
  //             bot.sendMessage(chatId, "Выберите количество рабочего часа", {
  //               reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
  //             })
  //           });
  //         });
  //       } else if(tempTadata.workermode.name === 'Flex') {
  //         //TODO workhours
  //
  //
  //       }
  //
  //       break;
  //
  //     case 'trg': // time regime Before or after midday
  //
  //
  //
  //       break;
  //
  //     case 'tim': //worker time
  //
  //       var choosenTime = msg.data.slice(4);
  //
  //       tempTadata.workertime.keyboard[0].find(function (el, i, array) {
  //         if(el.callback_data === choosenTime){
  //           tempTadata.workertime.id = el.id;
  //           tempTadata.workertime.name = el.text; //
  //           botNotification.notify(bot, msg.id, "Вы выбрали рабочее время  - " + (el.text).toUpperCase(), false);
  //           return;
  //         }
  //       });
  //
  //       break;
  //     case 'hrs':
  //       var choosenWorkHour = msg.data.slice(4);
  //
  //       tempTadata.workhour.keyboard[0].find(function (el, i, array) {
  //         if(el.callback_data === choosenWorkHour){
  //           tempTadata.workhour.id = el.id;
  //           tempTadata.workhour.name = el.text; //
  //           botNotification.notify(bot, msg.id, "Вы выбрали рабочий час для кандидата   - " + (el.text).toUpperCase(), false);
  //           return;
  //         }
  //       });
  //       break;
  //
  //     default:
  //       break;
  //   }
  // }


  if(!notifyRoutine.isNotify){
    // console.log(notifyRoutine.isNotify);

    var mesId = msg.message.message_id;
    switch (caseText){
      case '1_1':
        //TODO должен
        // TODO из базы выдается список Департаментов
        var subsId = tempTadata.subsidary.id;
        console.log('here');

        botDbHelper.getSubsDepartments(subsId, function (err, data) {
          if(err){
            bot.sendMessage(chatId, err.message);
            return;
          }
          inlButtHelp.makeButton('dep_', data, function (button, keyDataInfo) {
            tempTadata.keybData.push(keyDataInfo) ;
            bot.editMessageText('В какой департамент направлен кандидат:', {
              chat_id: chatId,
              message_id: mesId,
              reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
            });
          });
        });
        break;
      case '1_2':

        var answer = msg.data.slice(4);
        //TODO make cancelable choise

        botDbHelper.getAllSubs( function (err, data) {
          inlButtHelp.makeRandomButtons('sub_', data, 'subsidary', function (button, keyDataInfo) {
            tempTadata.subsidary.keyboard.push(keyDataInfo);
            bot.editMessageText('Пожалуйста, выберите компанию для регистрации:', {
              chat_id: chatId,
              message_id: mesId,
              reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
            });
          });
        });

        break;

      case 'sub':
        var ans = msg.data.slice(4);
        var subsId = null;
        console.log(ans);
        tempTadata.subsidary.keyboard[0].find(function (el, ind, array ){
          if(el.callback_data === ans){
            tempTadata.subsidary.id = el.id;
            tempTadata.subsidary.name = el.text;
            botNotification.notify(bot, msg.id, 'Вы выбрали Компанию: ' + el.text,  false);
            return;
          }
        });

        subsId = tempTadata.subsidary.id;

        if(subsId){

          botDbHelper.getSubsDepartments(subsId, function (err, data) {
            if(err){
              bot.sendMessage(chatId, err.message);
              return;
            }
            inlButtHelp.makeButton('dep_', data, function (button, keyDataInfo) {
              tempTadata.department.keyboard.push(keyDataInfo) ;

              bot.editMessageText('В какой департамент направлен кандидат:', {
                chat_id: chatId,
                message_id: mesId,
                reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
              });
              // bot.sendMessage(chatId, " В какой департамент направлен кандидат:", {
              //   reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
              // });
            });
          });
        } else {

        }

        break;

      case 'dep':
        var depText = msg.data.slice(4);
        //TODO make cancelable choise
        tempTadata.department.keyboard[0].find(function (el, ind, array ){
          if(el.callback_data === depText){
            tempTadata.department.id = el.id;
            tempTadata.department.name = el.text;
            botNotification.notify(bot, msg.id, 'Вы выбрали департамент - ' + el.text,  false);
            return;
          }
        });

        botDbHelper.getPosDept(tempTadata.department.id, function (err, data) {
          inlButtHelp.makePosButtons('pos_', data, function (button, keyDataInfo) {
            tempTadata.position.keyboard.push(keyDataInfo);
            bot.editMessageText('Пожалуйста, выберите должность кандидат из списка:', {
              chat_id: chatId,
              message_id: mesId,
              reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
            });
            // bot.sendMessage(chatId, 'Пожалуйста, выберите должность кандидат из списка: ', {
            //   reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
            // });
          });
        });
        break;

      case 'pos': // выбранная должность
        var choosenPosition = msg.data.slice(4);

        tempTadata.position.keyboard[0].find(function (el, i, array) {
          if(el.callback_data === choosenPosition){
            tempTadata.position.id = el.id;
            tempTadata.position.name = el.text;
            botNotification.notify(bot, msg.id, "Теперь, укажите его должность: " + el.text, false);
            return;
          }
        });


        botDbHelper.getWorkerTypes(function (err, data) {
          inlButtHelp.makeRandomButtons('typ_', data, 'workertype', function (button, keyDataInfo) {
            tempTadata.workertype.keyboard.push(keyDataInfo);
            bot.editMessageText('Выберите условия приема на работу:', {
              chat_id: chatId,
              message_id: mesId,
              reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
            });
            // bot.sendMessage(chatId, 'Выберите условия приема на работу: ', {
            //   reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
            // });
          });
        });
        break;

      case  'typ': // workertype Стажировка или Испытательный срок
        var choosenType = msg.data.slice(4);


        tempTadata.workertype.keyboard[0].find(function (el, i, array) {
          if(el.callback_data === choosenType){
            tempTadata.workertype.id = el.id;
            tempTadata.workertype.name = el.text; //
            botNotification.notify(bot, msg.id, "Вы выбрали условия работы - " + el.text, false);
            return;
          }
        });

        // если условия работы Испытательный срок, то отправляется
        // кнопка с данными на испытательный срок (т.е. 2нед. 1 мес, 2 мес.)
        if(tempTadata.workertype.name === 'Испытательный срок'){

          botDbHelper.getProbPeriods(function (err, data) {
            inlButtHelp.makeRandomButtons('prb_', data, 'probperiod',
              function (button, keyDataInfo) {
                tempTadata.workerperiod.keyboard.push(keyDataInfo);
                bot.editMessageText('Укажите период испытательного срока:', {
                  chat_id: chatId,
                  message_id: mesId,
                  reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
                });
                // bot.sendMessage(chatId, "Укажите период испытательного срока:", {
                //   reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
                // });
              })
          });

        } // если условие работы Стажирока то отправл-ся кнопка с данными сроков Стажировки
        else if(tempTadata.workertype.name === 'Стажировка'){
          botDbHelper.getInternPeriods(function (err, data) {
            inlButtHelp.makeRandomButtons('inp_', data, 'intperiod',
              function (button, keyDataInfo) {
                tempTadata.workerperiod.keyboard.push(keyDataInfo);
                bot.editMessageText('Укажите период стажировки кандидата:', {
                  chat_id: chatId,
                  message_id: mesId,
                  reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
                });
                // bot.sendMessage(chatId, "Укажите период стажировки кандидата:", {
                //   reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
                // });
              })
          });
        }
        break;

      case 'inp': // if intern or not
        var choosenPeriod = msg.data.slice(4);
        tempTadata.workerperiod.keyboard[0].find(function (el, i, array) {
          if(el.callback_data === choosenPeriod){
            tempTadata.workerperiod.id = el.id;
            tempTadata.workerperiod.name = el.text;
            botNotification.notify(bot, msg.id, "Вы выбрали период стажировки - "  + el.text, false);
            return;
          }
        });

        botDbHelper.getWorkerMode(function (err, data) {
          inlButtHelp.makeRandomButtons('mod_', data, 'mode',
            function (button, keyDataInfo) {
              tempTadata.workermode.keyboard.push(keyDataInfo);
              bot.editMessageText('Пожалуйста, выберите тариф рабочего времени:', {
                chat_id: chatId,
                message_id: mesId,
                reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
              });
              // bot.sendMessage(chatId, "Пожалуйста, выберите тариф рабочего времени: ", {
              //   reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
              // });
            })
        });

        break;

      case 'prb': // if probation period
        var choosenPeriod = msg.data.slice(4);
        tempTadata.workerperiod.keyboard[0].find(function (el, i, array) {
          if(el.callback_data === choosenPeriod){
            tempTadata.workerperiod.id = el.id;
            tempTadata.workerperiod.name = el.text;
            botNotification.notify(bot, msg.id, "Вы выбрали период испытательного срока - "  + el.text, false);
            return;
          }
        });

        botDbHelper.getWorkerMode(function (err, data) {
          inlButtHelp.makeRandomButtons('mod_', data, 'mode',
            function (button, keyDataInfo) {
              tempTadata.workermode.keyboard.push(keyDataInfo);
              bot.editMessageText('Пожалуйста, выберите тариф рабочего времени: ', {
                chat_id: chatId,
                message_id: mesId,
                reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
              });
              // bot.sendMessage(chatId, "Пожалуйста, выберите тариф рабочего времени: ", {
              //   reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
              // });
            })
        });

        break;

      case 'mod': // worker mode(Fixed Free Flex)
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
          // botDbHelper.getWorkTimes(function (err, data) {
          //   inlButtHelp.makeRandomButtons('tim_', data, 'starttime',
          //     function (buttons, keyDataInfo) {
          //       tempTadata.workertime.keyboard.push(keyDataInfo);
          //       bot.sendMessage(chatId, "Пожалуйста, выберите рабочее время для сотрудника: ", {
          //         reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
          //       });
          //     })
          // });

          //sending message to set the workday starttime
          tempTadata.workstartime.isStarttime= true; //


          /*
           * Спасибо, Имя!
           Кандидат ФИО зарегистрирован в системе. Его новый ID: 17MD12
           Для получения доступа в систему предупредите кандидата сдать необходимый пакет документов.
           После того как, вы получите подтверждение Вам будет отправлена ссылка для перевода кандидата в статус сотрудника.
           *
           *
           * */

          //TODO generate ID
          //TODO get acceptence
          //TODO send mail and sms with link to telegram bot and new employee ID to candidate

          // bot.sendMessage(chatId, 'Пожалуйста, введите НАЧАЛО РАБОЧЕГО ' +
          //   'ВРЕМЕНИ для данного кандидата:\n' +
          //   '(Пример: 08:00 или 08:30)');
          bot.editMessageText('Пожалуйста, введите НАЧАЛО РАБОЧЕГО ' +
            'ВРЕМЕНИ для данного кандидата:\n' +
            '(Пример: 08:00 или 08:30)', {
            chat_id: chatId,
            message_id: mesId,
            // reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
          });

        } else if(tempTadata.workermode.name === 'Free'){
          // if not fixed then send
          botDbHelper.getWorkHours(function (err, data) {
            inlButtHelp.makeRandomButtons('hrs_', data, 'workhour',
              function (button, keyDataInfo) {
              tempTadata.workhour.keyboard.push(keyDataInfo);
              bot.editMessageText('Выберите количество рабочего часа', {
                chat_id: chatId,
                message_id: mesId,
                reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
              });
              // bot.sendMessage(chatId, "Выберите количество рабочего часа", {
              //   reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
              // })
            });
          });
        } else if(tempTadata.workermode.name === 'Flex') {
          //TODO workhours


        }

        break;

      case 'trg': // time regime Before or after midday



        break;

      case 'tim': //worker time

        var choosenTime = msg.data.slice(4);

        tempTadata.workertime.keyboard[0].find(function (el, i, array) {
          if(el.callback_data === choosenTime){
            tempTadata.workertime.id = el.id;
            tempTadata.workertime.name = el.text; //
            botNotification.notify(bot, msg.id, "Вы выбрали рабочее время  - " + (el.text).toUpperCase(), false);
            return;
          }
        });

        break;
      case 'hrs':
        var choosenWorkHour = msg.data.slice(4);

        tempTadata.workhour.keyboard[0].find(function (el, i, array) {
          if(el.callback_data === choosenWorkHour){
            tempTadata.workhour.id = el.id;
            tempTadata.workhour.name = el.text; //
            botNotification.notify(bot, msg.id, "Вы выбрали рабочий час для кандидата   - " + (el.text).toUpperCase(), false);
            return;
          }
        });
        break;

      default:
        break;
    }
  }



  if(notifyRoutine.isNotify){
    console.log(notifyRoutine.isNotify);
    // notifyRoutine.isNotify = false;
    test.push(notifyRoutine.isNotify );
    console.log(test);
    var mesId = msg.message.message_id;
    var  parsedData = msg.data.slice(4);
    // console.log(parsedData);
    // console.log(msg);

    if(caseText==='not') {
      inlineCbHandlers.notifyHandler(bot, parsedData, chatId, mesId);
    } else if(caseText==='ans') {
      inlineCbHandlers.answerInlineButtonCbHandler(bot, parsedData, chatId, mesId);
    }
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

    var sub = messText.slice(0,2);
    var last2DigitEmId = ( (messText.slice(4).length === 2) ? messText.slice(4) : null);// to verify the is this digits of employee id

    // 17MD1328AC
    var subsAbbr = messText.slice(2,4); // like MD
    var depAbbr = messText.slice(8); // 17A
    var userData = {};

    // userData.lastMessageId  = reply;
    // userData.userId = chatId;
    // userMess.push(userData);

    // 08: 30 12: 30
    var hourParsed = messText.slice(0,2);
    var hourDelimParsed = messText.slice(2,3);
    var minuteParsed = messText.slice(3);
    var hourParserLen = messText.length; // len

    if(
      tempTadata.workstartime.isStarttime
      && (hourParserLen===5)
      && (hourParsed.length === 1 || hourParsed.length === 2)
      && hourDelimParsed === ':'
      && (minuteParsed.length === 2)
    ){
      tempTadata.workstartime.startime = messText;
      tempTadata.workstartime.isStarttime = false;
      tempTadata.workendtime.isEndTime = true;
      bot.sendMessage(chatId, 'Пожалуйста, введите КОНЕЦ РАБОЧЕГО ' +
        'ВРЕМЕНИ для данного кандидата:\n' +
        '(Пример: 18:00 или 17:30)');

      // return;
    } else if( tempTadata.workendtime.isEndTime
      && (hourParserLen===5)
      && (hourParsed.length === 1 || hourParsed.length === 2)
      && hourDelimParsed === ':'
      && (minuteParsed.length === 2)
    ) {
        //TODO to Korlan acceptanse info
      //TODO getting HR name and generate ID according to department Name
      tempTadata.workendtime.endtime = messText;
      tempTadata.workendtime.isEndTime = false;
      // Спасибо, Имя!
      //   Кандидат ФИО зарегистрирован в системе. Его новый ID: 17MD12
      // Для получения доступа в систему предупредите кандидата сдать необходимый пакет документов.
      //   После того как, вы получите подтверждение Вам будет отправлена ссылка для перевода кандидата в статус сотрудника.
        bot.sendMessage(chatId, 'Спасибо, TODO' +
          '\nКандидат ФИО зарегистрирован в системе. Его новый ID: (TODO) 17MD12' +
          '\nДля получения доступа в систему предупредите кандидата сдать необходимый пакет документов.' +
          '\nПосле того как, вы получите подтверждение Вам будет отправлена ссылка для перевода кандидата в статус сотрудника.');
    }

    if( parseInt(sub) ){

      if(messText.length === 10){

          // if it is must to find by regex use this
        botDbHelper.getCandidatePos(subsAbbr, depAbbr, function (err, data) {
          if(err){
            bot.sendMessage(chatId, err.message + " \nПопробуйте еще раз!");
          } else {
            tempTadata.subsidary.id = data._id;
            tempTadata.subsidary.name = data.subsidary;
            // console.log(tempTadata);
            // newEmployeeData.push(tempTadata);
//Пожалуйста, подтвердите что кандидат Мирус Курмашев принят в компанию Automato:
            bot.sendMessage(chatId, "Пожалуйста, подтвердите что кандидат Джон Сноу принят в компанию " + data.subsidary + ":\n", {
              reply_markup: JSON.stringify({
                inline_keyboard:[
                  [{ text:'Подтверждаю', callback_data: '1_1'}, { text:'Сменить компанию', callback_data: '1_2' }]
                ]})
            })
          }
        });
//         botDbHelper.getCandidatePos(subsAbbr, depAbbr, function (err, data) {
//           if(err){
//             bot.sendMessage(chatId, err.message + " \nПопробуйте еще раз!");
//           } else {
//             tempTadata.subsidaryId = data._id;
//             tempTadata.candidateId = messText;
//             newEmployeeData.push(tempTadata);
// //Пожалуйста, подтвердите что кандидат Мирус Курмашев принят в компанию Automato:
//             bot.sendMessage(chatId, "Пожалуйста, подтвердите что кандидат Джон Сноу принят в компанию " + data.subsidary + ":\n", {
//               reply_markup: JSON.stringify({
//                 inline_keyboard:[
//                   [{ text:'Подтверждаю', callback_data: '1_1'}, { text:'Сменить компанию', callback_data: '1_2' }]
//                 ]})
//             })
//           }
//         });

        // console.log(ssss);
        //TODO if candidate with such candidate exists
        //TODO and send  applied subsidary and vacancy

        //for registering new employee after he/she presses start button
        //
      } else if( messText.length < 10  && startHandler.isStart) {
        // console.log(messText);

        // checks if employee id is valid format
        if(messText.length === 6 ){

          if(parseInt(last2DigitEmId) && last2DigitEmId.length === 2) {
            var emplId = msg.text.toUpperCase();
            // console.log(emplId);
            botDbHelper.checkAndRegisterEmpl(emplId, chatId, function (err, data) {
              if(err){
                if(err.status === 404){
                  bot.sendMessage(chatId, 'Не найдено сотрудника по введеному ID.' +
                    '\nПожалуйста, обратитесь в тех. специалисту!');
                  return;
                }
                return;
              }
              if(data){
                bot.sendMessage(chatId, 'Вы успешно зарегистрировались в системе.\nВаш ID бота - ' + data.botId);
                // console.log(data);
              }
            });
          }

        } else {
          // checks if employee id is not valid format and sends to user notification!
          bot.sendMessage(chatId, "Вы ввели неправильный формат рабочего ID! " +
            "\nПожайлуйста, введите свой ID еще раз");

        }

        // TODO check employee id
        //TODO after registration do not forget to asign false to starthandler.isStart

      }
    } /*else if (( messageId - msgId ) === 2 && msgId > 0){
      bot.sendMessage(chatId, 'Бот не может распознать вашу команду', replyOption);
    }*/

  } else if(breket === '/') {

    var id = messText.slice(1,3);
    var sub = messText.slice(1, 3);

    if(id ==='id'){


    } else if(parseInt(sub)) {
      var employee_id = messText.slice(1);

      if (employee_id.length >= 6 && employee_id.length <= 8 && (typeof parseInt(sub)) === 'number') {
        dbHelper.getEmployeeById(employee_id, function (err, emplData) {
          if (err) {
            bot.sendMessage(chatId, err.message + " \n\t Err: " + err);
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


bot.onText(/\/start/, function (msg, match) {
  // console.log(msg);
  var userId = msg.chat.id;
  startHandler.isStart = true;
  bot.sendMessage(userId, 'Пожалуйста, введите свой рабочий ID, ' +
    'чтобы зарегистрироваться в системе.\n' +
    'Рабочий ID выдается HR менеджером');
});

bot.onText(/\/salary/, function (msg, mathch) {

});

bot.onText(/\/salarycast/, function (msg, mathch) {

});

bot.onText(/\/time/, function (msg, mathch) {

});

bot.onText(/\/timelate/, function (msg, mathch) {

});

bot.onText(/\/getme/, function (msg, mathch) {
  var botId = msg.from.id;
  var username = msg.from.username;
  bot.sendMessage(botId, 'Ваш ID бота - ' + botId
  + "\nВаш Username -  @" + username);
});


bot.onText(/\/redis/, function (msg, match) {
  // console.log(msg);
  var userId = msg.from.id;

  // redisClient.hmset(userId, {
  //   // userId: userId,
  //   // msg: msg.message_id,
  //   // name: msg.from.username
  //   arr: [1, 3, 4]
  // });

  redisClient.hgetall(userId, function (err, reply) {
      if(err){
        console.log(err);
        return;
      }

      if(reply){
        console.log(reply);
        // console.log(reply.arr[2])
        // bot.sendMessage(userId, "Anser: " + reply);
      }
  });
  // redisClient.hmset(userId, function (err, reply) {
  //   if(err){
  //     console.log(err);
  //     return;
  //   }
  //
  //   if(reply){
  //     console.log(reply)
  //     bot.sendMessage(userId, "Anser: " + reply);
  //   }
  //
  // });

});


//
bot.onText(/\/notify/, function (msg, match) {
  var chatId = msg.from.id;
  // redisClient.hmset(chatId,{
  //
  // });
  var buttons = {
    button: inlineButtons.notifyButtonsInitial
  };

  // redisClient.del(chatId, function (err, reply) {
  //
  //   console.log(err);
  //   console.log(reply);
  //
  // })
  // redisClient.hgetall(chatId, function (err, reply) {
  //   if(err){
  //     console.log(err);
  //     return;
  //   }
  //
  //   if(reply){
  //     console.log(JSON.parse(reply.goOut).bank);
  //
  //
  //
  //
  //   } else {
  //     // set initial data to users cache
  //     redisClient.hmset(chatId, {
  //       goOut: JSON.stringify({
  //         bank: false,
  //         nk: false,
  //         personal: false
  //       }),
  //       late: JSON.stringify({
  //         time2: "30 минут",
  //         time3: "1 час",
  //         time4: "2 часа"
  //       }),
  //       initButton: JSON.stringify({
  //         goOutButton: 'Ухожу',
  //         lateButton: 'Опаздываю',
  //         notComeButton: 'не приду'
  //       }),
  //       isInitial: true
  //     })
  //   }
  // });

  notifyRoutine.isNotify = true;

  bot.sendMessage(chatId, 'Что вы хотите сделать?', {
    reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
  });

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

// user /data employee_id
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
        bot.sendMessage(bot_id, err.message + " \n\t Err:" + err);
        return
      }
      bot.sendMessage(bot_id, emplData);
    });
  } else {
    dbHelper.getEmployeeById();
  }
});


// user /id Firstname
bot.onText(/\/id (.+)/, function (msg, match) { // /employee_id - bot command

  var employeeName = match[1].slice(0,1).toUpperCase() + match[1].slice(1);
  var bot_id = msg.chat.id;

  dbHelper.getEmployeeId(bot_id, employeeName, function (err, data) {
    if(err){
      bot.sendMessage(bot_id, err.message);
      return;
    }

    if(data){
      bot.sendMessage(bot_id, 'Вы зарегистрированы в системе');
    }
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
         bot.sendMessage(bot_id, err.message);
         return;
       }
       bot.sendMessage(bot_id, data);
     })
   } else {
     bot.sendMessage(bot_id, "Неизвестная команда. Попробуйте еще раз");
   }
});

//Sends Employee ID for current user
bot.onText(/\/myid/, function (msg) {
  var botId = msg.chat.id;
  botDbHelper.getMyId(botId, function (err, data) {
    if(err){
      bot.sendMessage(botId, err.message);
      return;
    }
      bot.sendMessage(botId, data.firstname + ", Ваш рабочий ID: " + data.employee_id);

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
  console.log(msg);

  botDbHelper.getMyPass(botId, function (err, passwords) {
    if(err){
      bot.sendMessage(botId, err.message);
      return
    }
    bot.sendMessage(botId, passwords);
  });
});

bot.onText(/\/do/, function (msg, match) {
  console.log(msg);
  // var botId = msg.chat.id;
  //
  // botDbHelper.getMyPass(botId, function (err, passwords) {
  //   if(err){
  //     bot.sendMessage(botId, err.message);
  //     return
  //   }
  //   bot.sendMessage(botId, passwords);
  // });
});


module.exports = botrouter;