'use strict';

var Candidate = require('../models/candidates');
var Employees = require('../models/employees');


function generateId(dept, callback){

  if(dept){
    var subs = '';
    if(dept.length > 2){
      subs = (dept.substr(0,1) + 'd').toLowerCase();
    } else {
      subs = dept.toLowerCase();
    }
    Employees.find().count(function (err, count) {
      if(err){
        err.message = "Неизвестная ошибка; r/cand: 18";
        callback(err, null);
        return;
      }
      if(count){
        count++;
        var id = (new Date()).getFullYear().toString().substr(2) + subs
          + ((count < 10) ? ('0' + count) : (count));
        callback(null, id);
      } else {
        count = 1;
        var id = (new Date()).getFullYear().toString().substr(2) + subs
          + ((count < 10) ? ('0' + count) : (count));
        callback(null, id);
      }
    });
  } else {
    var error = {message: "Неправильно выбран департамент!", status: 404};
    callback(error, null);
  }
}



var candidateFind = function (gId, obj, callback) {

  Candidate.findOne({ guest_id: gId })
    .select()
    .exec( function (err, candidate) {

      if(err){
        // bot.sendMessage(userId, 'Пожалуйста введит свой гостевой ID. \n');
        err.message = 'Ошибка. Обратитесь к техническому персоналу!';
        err.status = 500;
        callback(err, null);
        return;
      }
      // console.log(candidate);
      if(candidate){
        generateId("MD", function (err, id) {
          if(err){
            callback(err, null);
            //bot.sendMessage(userId, 'Ошибка при получении ID.\n Обратитесть в тех. поддержку компании.\n ' + err.message);
            return
          }

          var empl = new Employees({
            employee_id: id,
            botId: obj.botId,
            username: obj.username,
            firstname: candidate.general_name,
            lastname: candidate.general_surname,
            email: candidate.personal_email,
            phonenumber:candidate.personal_phone,
            position: candidate.vacancy_id.toString()
          });
          empl.generatePasswords();

          empl.save(function (err, savedEmpl) {
            if(err){
              if(err.code === 11000){
                err.message = "Пользователь усуществует с " +
                   id + " уже существует";
                err.status = 500;
                callback(err, null);
                return;
              } else {
                err.message = "Неизвестная ошибка";
                err.status = 500;
                callback(err, null);
                return;
              }
            }
            callback(null, savedEmpl);
          });
        });

      } else {

        var error = {};
        error.message = 'Ваш Гостевой ID неверный! Попробуйте еще раз.\n' +
          'Или обратитесь в тех. поддержку компании';
        error.status = 404;
        callback(error, null);
      }
    });
};

module.exports = {
  generateId: generateId,
  candidateFind: candidateFind
};




//First Edidtion
// 'use strict';
//
// var Candidate = require('../models/candidates');
// var Employees = require('../models/employees');
//
//
// function generateId(dept, callback){
//
//   if(dept){
//     var subs = '';
//     if(dept.length > 2){
//       subs = (dept.substr(0,1) + 'd').toLowerCase();
//     } else {
//       subs = dept.toLowerCase();
//     }
//     Candidate.find().count(function (err, count) {
//       if(err){
//         callback(err, null);
//         return;
//       }
//       if(count){
//         count++;
//         var id = (new Date()).getFullYear().toString().substr(2) + subs
//           + ((count < 10) ? ('0' + count) : (count));
//         callback(null, id);
//       } else {
//         count = 1;
//         var id = (new Date()).getFullYear().toString().substr(2) + subs
//           + ((count < 10) ? ('0' + count) : (count));
//         callback(null, id);
//       }
//     });
//   } else {
//     var error = {message: "Неправильно выбран департамент!", status: 404};
//     callback(error, null);
//   }
// }
//
//
//
// var candidateFind = function (gId, bot_id, callback) {
//
//   Candidate.findOne({ guest_id: gId })
//     .select()
//     .exec( function (err, candidate) {
//
//       if(err){
//         // bot.sendMessage(userId, 'Пожалуйста введит свой гостевой ID. \n');
//         err.message = 'Ошибка. Обратитесь к техническому персоналу!';
//         err.status = 500;
//         callback(err, null);
//         console.log(err);
//         return;
//       }
//     // console.log(candidate);
//       if(candidate){
//         generateId("md", function (err, id) {
//           if(err){
//             callback(err, null);
//             //bot.sendMessage(userId, 'Ошибка при получении ID.\n Обратитесть в тех. поддержку компании.\n ' + err.message);
//             return
//           }
//
//           Candidate.findOne({ guest_id: gId })
//             .select('general_name')
//             .exec(function (err, cand) {
//
//               if(cand){
//                 cand.employee_id = id;
//                 cand.bot_id = bot_id;
//
//                 cand.save(function (err, savedCand) {
//                   if(err){
//                     callback(err, null);
//                     return
//                   }
//                   callback(null, savedCand);
//                 });
//               }
//             });
//         });
//
//       } else {
//
//         var error = {};
//         error.message = 'Ваш Гостевой ID неверный! Попробуйте еще раз.'
//         error.status = 404;
//         callback(error, null);
//       }
//     });
// };
//
// module.exports = {
//   generateId: generateId,
//   candidateFind: candidateFind
// };