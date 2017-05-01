/**
 * Created by rafa on 14/04/2017.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// workertype
// Intern
// Probation period

var WorkerTypeSchema = new Schema({
  workertype: { type: String },// Intern, prob
  // positions: [{type: Schema.Types.ObjectId, ref: 'Positions'}]
});

module.exports = mongoose.model('Workertypes',  WorkerTypeSchema);
