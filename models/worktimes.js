/**
 * Created by rafa on 14/04/2017.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WorkTimesSchema =  new Schema({
  starttime: { type: String },
  endtime: { type: String }
  // position: { type: mongoose.Schema.ObjectId, ref:'Positions' }
});

module.exports = mongoose.model('Worktimes', WorkTimesSchema);