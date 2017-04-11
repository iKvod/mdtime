/**
 * Created by rafa on 13/03/2017.
 */

'use strict';

// for rating system among employees

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var PositionsSchema = new Schema({
  id: {type: Number},
  filter_sex: {type: String},
  title: {type: String},
  title_2: {type: String},
  characters: {type: String},
  status: {type: String},
  slug: {type: String},
  end_date: {type: Date, default: Date.now},
  slogan: {type: String},
  department_id: {type: Schema.Types.ObjectId, ref: 'Departments'}
});

// var PositionsSchema = new Schema({
//   position: {type: String, default: 'Intern'},
//   // departments: [{type: Schema.ObjectId, ref:'Departments'}],
//   employees: [{type: Schema.ObjectId, ref:'Employee'}]
// });

module.exports = mongoose.model('Positions', PositionsSchema);