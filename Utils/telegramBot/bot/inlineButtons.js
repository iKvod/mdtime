var inlineKeyboardOption = function (buttons) {

  var inlineButtons = [];
  var inlineButton = [];

  for(var key1 in buttons.button){
    for(var key2 in buttons.button[key1]){
      var keyboard  = {};
      keyboard.text = buttons.button[key1][key2].text;
      keyboard.callback_data = buttons.button[key1][key2].callback_data ;
      inlineButton.push(keyboard);

    }
    inlineButtons.push(inlineButton);
    inlineButton = [];
  }
  // console.log(JSON.stringify({
  //   inline_keyboard: inlineButtons
  // }))
  return {
    reply_markup: JSON.stringify({
      inline_keyboard: inlineButtons
    })
  }
};

var makeReplyOption = function (button) {
  return replyOption = {
    reply_markup: inlineKeyboardOption(button).reply_markup
  };
};


// for making inline keyboard buttons from arbitrary data
//for departments
var makeButton = function (flag, data, callback) {
  var keyDataInfo = [];
  var yesOpt = {
    button: [
      [],
      [],
      []
    ]
  };

  if(data.departments.length){
    for (var i = 0, len = data.departments.length; i < len; i++){

      if(i < 2) {
        yesOpt.button[0].push(
          {text: data.departments[i].department, callback_data: flag + (2) + "_" + (i + 1) });
          keyDataInfo.push({id: data.departments[i]._id, text: data.departments[i].department, callback_data: (2) + "_" + (i + 1) });
      } else if(i > 2 && i < 5){
        yesOpt.button[1].push(
          {text: data.departments[i].department, callback_data: flag + (2) + "_" + (i + 1) });
          keyDataInfo.push({id: data.departments[i]._id, text: data.departments[i].department, callback_data: (2) + "_" + (i + 1) });
      } else {
        yesOpt.button[2].push(
          {text: data.departments[i].department, callback_data: flag + (2) + "_" + (i + 1) });
          keyDataInfo.push({id: data.departments[i]._id, text: data.departments[i].department, callback_data: (2) + "_" + (i + 1) });
      }
    }
    callback(yesOpt, keyDataInfo);
  }

};

var makePosButtons = function (flag, data, callback) {
  var keyDataInfo = [];
  var yesOpt = {
    button: [
      [],
      [],
      []
    ]
  };

  if(data.length){
    for (var i = 0, len = data.length; i < len; i++){

      if(i < 2) {
        yesOpt.button[0].push(
          { text: data[i].position, callback_data: flag + (2) + "_" + (i + 1) });
        keyDataInfo.push({id: data[i]._id, text: data[i].position, callback_data: (2) + "_" + (i + 1) });
      } else if(i > 2 && i < 5){
        yesOpt.button[1].push(
          {text: data[i].position, callback_data: flag + (2) + "_" + (i + 1) });
        keyDataInfo.push({id: data[i]._id, text: data[i].position, callback_data: (2) + "_" + (i + 1) });
      } else {
        yesOpt.button[2].push(
          {text: data[i].position, callback_data: flag + (2) + "_" + (i + 1) });
        keyDataInfo.push({id: data[i]._id, text: data[i].position, callback_data: (2) + "_" + (i + 1) });
      }
    }
    callback(yesOpt, keyDataInfo);
  }
};

var makeRandomButtons = function (flag, data, key, callback) {
  var keyDataInfo = [];
  var yesOpt = {
    button: [
      [],
      [],
      []
    ]
  };

  if(data.length){
    for (var i = 0, len = data.length; i < len; i++){

      if(i < 2) {
        yesOpt.button[0].push(
          { text: data[i][key].toString(), callback_data: flag + (2) + "_" + (i + 1) });
        keyDataInfo.push({id: data[i]._id, text: data[i][key].toString(), callback_data: (2) + "_" + (i + 1) });
      } else if(i > 2 && i < 5){
        yesOpt.button[1].push(
          {text: data[i][key].toString(), callback_data: flag + (2) + "_" + (i + 1) });
        keyDataInfo.push({id: data[i]._id, text: data[i][key].toString(), callback_data: (2) + "_" + (i + 1) });
      } else {
        yesOpt.button[2].push(
          { text: data[i][key].toString(), callback_data: flag + (2) + "_" + (i + 1) });
        keyDataInfo.push({id: data[i]._id, text: data[i][key].toString(), callback_data: (2) + "_" + (i + 1) });
      }
    }
    callback(yesOpt, keyDataInfo);
  }
};


var makeTimeButtons = function (flag, data, key1, key2, callback) {
  var keyDataInfo = [];
  var yesOpt = {
    button: [
      [],
      [],
      []
    ]
  };

  if(data.length){
    for (var i = 0, len = data.length; i < len; i++){

      if(i < 2) {
        yesOpt.button[0].push(
          { text: data[i][key1] + " - " + data[i][key2], callback_data: flag + (2) + "_" + (i + 1) });
        keyDataInfo.push({id: data[i]._id, text: data[i][key1] + " - " + data[i][key2], callback_data: (2) + "_" + (i + 1) });
      } else if(i > 2 && i < 5){
        yesOpt.button[1].push(
          {text: data[i][key1] + " - " + data[i][key2], callback_data: flag + (2) + "_" + (i + 1) });
        keyDataInfo.push({id: data[i]._id, text: data[i][key1] + " - " + data[i][key2], callback_data: (2) + "_" + (i + 1) });

      } else {
        yesOpt.button[2].push(
          { text: data[i][key] + " - " + data[i][key], callback_data: flag + (2) + "_" + (i + 1) });
        keyDataInfo.push({id: data[i]._id, text: data[i][key1] + " " + data[i][key2], callback_data: (2) + "_" + (i + 1) });
      }
    }
    callback(yesOpt, keyDataInfo);
  }
};

// var makeTimeButtons = function (flag, data, key1, key2, callback) {
//   var keyDataInfo = [];
//   var yesOpt = {
//     button: [
//       [],
//       [],
//       []
//     ]
//   };
//
//   if(data.length){
//     for (var i = 0, len = data.length; i < len; i++){
//
//       if(i < 2) {
//         yesOpt.button[0].push(
//           { text: data[i][key1] + " - " + data[i][key2], callback_data: flag + (2) + "_" + (i + 1) });
//         keyDataInfo.push({id: data[i]._id, text: data[i][key1] + " - " + data[i][key2], callback_data: (2) + "_" + (i + 1) });
//       } else if(i > 2 && i < 5){
//         yesOpt.button[1].push(
//           {text: data[i][key1] + " - " + data[i][key2], callback_data: flag + (2) + "_" + (i + 1) });
//         keyDataInfo.push({id: data[i]._id, text: data[i][key1] + " - " + data[i][key2], callback_data: (2) + "_" + (i + 1) });
//
//       } else {
//         yesOpt.button[2].push(
//           { text: data[i][key] + " - " + data[i][key], callback_data: flag + (2) + "_" + (i + 1) });
//         keyDataInfo.push({id: data[i]._id, text: data[i][key1] + " " + data[i][key2], callback_data: (2) + "_" + (i + 1) });
//       }
//     }
//     callback(yesOpt, keyDataInfo);
//   }
// };


module.exports = {
  firstButtons: {
    button: [[{text:'Да', callback_data: 'да1'}],
      [{text:'Нет', callback_data: 'нет1'}]]
  },
  makeReplyOption: makeReplyOption,
  inlineKeyboardOption : inlineKeyboardOption,
  makeButton: makeButton,
  makePosButtons: makePosButtons,
  makeRandomButtons: makeRandomButtons,
  makeTimeButtons: makeTimeButtons
};