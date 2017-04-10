'use strict';

var config = {
    // token: '324830524:AAF_QWatxxdsHbxrC2cB82jxKj8tZmd6wWE', // production token for telegram bot api
    // token: '10039703:AAGMkR2KexAXlItRkRXowzw0Y6POZmjxBjQ', //test token for telegram bot MD
    token: '342706056:AAGUu9tR287bJoD2B83lYu3gcPa_2o4RIwg', //@mdChecklist2_bot
    botName: '@mdtime_bot',
    // mongoUrl: 'mongodb://127.0.0.1:27017/checklistTest',
    mongoUrl: 'mongodb://127.0.0.1:27017/mdchecklist', //
    opt: {
        user: 'rafa',
        pass: 'Automatodev',
        auth: { authdb: "checklist"}
    },
    // ceoBotID : 78923920,
    // managerBotID : 228106138
    ceoBotID: 207925830,     //for testing
    managerBotID: 207925830 // for testing
    //pip:"10.130.39.7"
   // pip:"127.0.0.1"
};

module.exports =  config;


//Client identifier -  1071047485832-m4nbek27ukmfepibg3a39g5343ltrvtn.apps.googleusercontent.com
//Client secret - d1HBMkb-zjKtKB-RXVoorX4W


// Tutorial url
//https://codelabs.developers.google.com/codelabs/sheets-api/#3