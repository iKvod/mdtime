/**
 * Created by rafa on 19/04/2017.
 */
'use strict';

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;


var Schema = mongoose.Schema;

var WorkHoursSchema = new Schema({
  workhour: { type: Number },
  // workermode: {type: Schema.Types.ObjectId, ref: 'Workermodes'}
});

module.exports = mongoose.model('Workhours', WorkHoursSchema);
