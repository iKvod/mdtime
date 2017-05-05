/**
 * Created by rafa on 25/04/2017.
 */
var inlineButtons = require('../staticInlineButtons/staticInlineButtons');
var LateTimeReports = require('../../../../models/reporings/latereports');
var Employees = require('../../../../models/employees');
var dbHelper = require('../../../../routes/Helpers/dbRouteCommon');

var notifyHandler = function (bot, parsedData, chatId, mesId) {
  switch(parsedData){
    case 'late':
      bot.editMessageText('Выберите, на сколько вы опаздаете:', {
        chat_id: chatId,
        message_id: mesId,
        reply_markup: JSON.stringify({
          inline_keyboard: inlineButtons.lateCallButton
        })
      });
      break;

    case 'out':
      bot.editMessageText('Выберите, с какого времени вы уходите:', {
        chat_id: chatId,
        message_id: mesId,
        reply_markup: JSON.stringify({
          inline_keyboard: inlineButtons.outCallButton
        })
      });

      break;
    case 'nc':

      break;
    case 'tbank':

      break;
    case 'fbank':

      break;
    case 'tnk':

      break;
    case 'fnk':

      break;
    case 'tlunch':

      break;
    case 'flunch':

      break;
    default:
      break;
  }



};

function handleLateTimes (lateTime, lateType, userId, bot, chatId, mesId) {
  var lateReport = new LateTimeReports({
    latetype: lateType ,
    latetime: lateTime,
    userId: userId
  });

  lateReport.save(function (err, savedRep) {
    if(err){
      bot.editMessageText(chatId, 'Неизвестная ошибка', {
        chat_id: chatId,
        message_id: mesId
      });
      return;
    }
    bot.editMessageText('Данные записаны в базу', {
      chat_id: chatId,
      message_id: mesId
    });
  });
}

function getUserId (chatId, callback) {
  dbHelper.getByQueryRoute(Employees,{
    botId: chatId //query
  },{
    _id: 1, botId: 1 // select
  }, null, function (err, data) {
    if(err){
      callback(err, null);
      return;
    }
    callback(null, data);
  });
}

function saveLateReport(lateTime, lateType, bot, chatId, mesId) {

  getUserId(chatId, function (err, data) {
    if(err){
      bot.editMessage(chatId, err.message, {
        chat_id: chatId,
        message_id: mesId
      });
    return;
    }

    if(data && (data.botId == chatId)){
      var userId = data._id;
      //saveing late time report
      handleLateTimes(lateTime, lateType, userId, bot, chatId, mesId);
    } else {
      bot.editMessageText(chatId, 'Информация по Вашему чату не найдена (id чата не верна)\n' +
        'Попробуйте еще раз или обратитесь тех. специалисту ', {
        chat_id: chatId,
        message_id: mesId
      });
    }
  });
}

//TODO
//rewrite it according to users type (if it fixed or not);
//AND!!! check if employee notifies 30 minutes before the his fixed work time

var answerInlineButtonCbHandler = function (bot, parsedData, chatId, mesId, callback) {
  switch (parsedData){
    //if Late
    case 'l15min':
      saveLateReport(15, 'На работу', bot, chatId, mesId );
      callback();
      break;
    case 'l30min':
      saveLateReport(30, 'На работу', bot, chatId, mesId );
      callback();
      break;
    case 'l1hour':
      saveLateReport(60, 'На работу', bot, chatId, mesId );
      callback();
      break;
    case 'l2hour':
      saveLateReport(120, 'На работу', bot, chatId, mesId );
      callback();
      break;
    //if Go out
    case 'o1hour':
      break;
    case 'o2hour':
      break;
    case 'o3hour':
      break;
    case 'o4hour':
      break;
    default:
      break;
  }
};


module.exports = {
  answerInlineButtonCbHandler: answerInlineButtonCbHandler,
  notifyHandler: notifyHandler
};