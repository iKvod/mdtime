/**
 * Created by rafa on 15/05/2017.
 */
// previous inline command handler
if(!notifyRoutine.isNotify){
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
          bot.sendMessage(chatId, " В какой департамент направлен кандидат:", {
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
          bot.sendMessage(chatId, 'Пожалуйста, выберите компанию для регистрации:', {
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
            bot.sendMessage(chatId, " В какой департамент направлен кандидат:", {
              reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
            });
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
          bot.sendMessage(chatId, 'Пожалуйста, выберите должность кандидат из списка: ', {
            reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
          });
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
          bot.sendMessage(chatId, 'Выберите условия приема на работу: ', {
            reply_markup: inlButtHelp.inlineKeyboardOption(button).reply_markup
          });
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
            function (buttons, keyDataInfo) {
              tempTadata.workerperiod.keyboard.push(keyDataInfo);
              bot.sendMessage(chatId, "Укажите период испытательного срока:", {
                reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
              });
            })
        });

      } // если условие работы Стажирока то отправл-ся кнопка с данными сроков Стажировки
      else if(tempTadata.workertype.name === 'Стажировка'){
        botDbHelper.getInternPeriods(function (err, data) {
          inlButtHelp.makeRandomButtons('inp_', data, 'intperiod',
            function (buttons, keyDataInfo) {
              tempTadata.workerperiod.keyboard.push(keyDataInfo);
              bot.sendMessage(chatId, "Укажите период стажировки кандидата:", {
                reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
              });
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
          function (buttons, keyDataInfo) {
            tempTadata.workermode.keyboard.push(keyDataInfo);
            bot.sendMessage(chatId, "Пожалуйста, выберите тариф рабочего времени: ", {
              reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
            });
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
          function (buttons, keyDataInfo) {
            tempTadata.workermode.keyboard.push(keyDataInfo);
            bot.sendMessage(chatId, "Пожалуйста, выберите тариф рабочего времени: ", {
              reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
            });
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

        bot.sendMessage(chatId, 'Пожалуйста, введите НАЧАЛО РАБОЧЕГО ' +
          'ВРЕМЕНИ для данного кандидата:\n' +
          '(Пример: 08:00 или 08:30)');

      } else if(tempTadata.workermode.name === 'Free'){
        // if not fixed then send
        botDbHelper.getWorkHours(function (err, data) {
          inlButtHelp.makeRandomButtons('hrs_', data, 'workhour', function (buttons, keyDataInfo) {
            tempTadata.workhour.keyboard.push(keyDataInfo);
            bot.sendMessage(chatId, "Выберите количество рабочего часа", {
              reply_markup: inlButtHelp.inlineKeyboardOption(buttons).reply_markup
            })
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