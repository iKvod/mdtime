

//anser inline keyboard notification
var notify = function (bot, msgId, message, bool ) {
  bot.answerCallbackQuery(msgId, message, bool);
};


module.exports = {
  notify : notify
};