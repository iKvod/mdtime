'use strict';

var Candidate = require('../models/candidates');


function generateId(dept, callback){

  if(dept){
    var subs = '';
    if(dept.length > 2){
      subs = (dept.substr(0,1) + 'd').toLowerCase();
    } else {
      subs = dept.toLowerCase();
    }
    Candidate.find().count(function (err, count) {
      if(err){
        callback(err, null);
        return;
      }
      if(count){
        count++;
        var id = (new Date()).getFullYear().toString().substr(2) + subs
          + ((count < 10) ? ('0' + count) : (count));
        callback(null, id);
        // console.log(id);
      } else {
        count = 1;
        var id = (new Date()).getFullYear().toString().substr(2) + subs
          + ((count < 10) ? ('0' + count) : (count));
        callback(null, id);
        //console.log(count);
      }
    });

  } else {
    var error = {message: "Неправильно выбран департамент!", status: 404};
    callback(error, null);
  }

}



var candidateFind = function (gId, bot_id, callback) {

  Candidate.findOne({ guest_id: gId })
    .select()
    .exec( function (err, candidate) {

      if(err){
        // bot.sendMessage(userId, 'Пожалуйста введит свой гостевой ID. \n');
        err.message = 'Ошибка. Обратитесь к техническому персоналу!';
        err.status = 500;
        callback(err, null);
        console.log(err);
        return;
      }
    // console.log(candidate);
      if(candidate){
        generateId("md", function (err, id) {
          if(err){
            callback(err, null);
            //bot.sendMessage(userId, 'Ошибка при получении ID.\n Обратитесть в тех. поддержку компании.\n ' + err.message);
            return
          }

          Candidate.findOne({ guest_id: gId })
            .select('general_name')
            .exec(function (err, cand) {

              if(cand){
                cand.employee_id = id;
                cand.bot_id = bot_id;

                cand.save(function (err, savedCand) {
                  if(err){
                    callback(err, null);
                    return
                  }
                  callback(null, savedCand);
                });
              }
            });
        });

      } else {

        var error = {};
        error.message = 'Ваш Гостевой ID неверный! Попробуйте еще раз.'
        error.status = 404;
        callback(error, null);
      }
    });
};

module.exports = {
  generateId: generateId,
  candidateFind: candidateFind
};