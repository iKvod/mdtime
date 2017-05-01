/**
 * Created by rafa on 22/04/2017.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// 2 week
// 1 month
// 2 month
// 3 month

var ProbPeriodTypeSchema = new Schema({
  probperiod: { type: String }
});

module.exports = mongoose.model('Probperiods',  ProbPeriodTypeSchema);
