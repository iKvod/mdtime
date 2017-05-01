/**
 * Created by rafa on 20/04/2017.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// 3 month
// 2 month
// 1 month

var InternPeriodTypeSchema = new Schema({
  intperiod: { type: String }
});

module.exports = mongoose.model('Internperiods',  InternPeriodTypeSchema );
