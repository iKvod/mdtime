/**
 * Created by rafa on 25/04/2017.
 */
var inlineButtons = require('../staticInlineButtons/staticInlineButtons');


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

var answerInlineButtonCbHandler = function (bot, parsedData, chatId, mesId) {
  switch (parsedData){
    //if Late
    case 'l15min':
      break;

    case 'l30min':
      break;
    case 'l1hour':
      break;
    case 'l2hour':
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