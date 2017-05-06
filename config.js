'use strict';

var config = {
    token: '210039703:AAFjqrxT3EyLpRJGxfPP4_ob3ZSjp1vC4k0', //token for telegram bot MD @mdtime_bot
    // token: '342706056:AAGUu9tR287bJoD2B83lYu3gcPa_2o4RIwg', // test @mdChecklist2_bot
    botName: '@mdtime_bot',
    // mongoUrl: 'mongodb://127.0.0.1:27017/checklistTest',
    mongoUrl: 'mongodb://127.0.0.1:27017/mdchecklist', //
    opt: {
        user: 'rafa',
        pass: 'Automatodev',
        auth: { authdb: "checklist"}
    },
    // ceoBotID : 33103333 ,// Miruses tb bot id
    ceoBotID: 207925830,     //for testing
    techSupportBotId: 207925830 // for testing
};

module.exports =  config;