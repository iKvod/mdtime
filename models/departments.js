'use strict';

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var DepartmensSchema = new Schema({
  dep_id: {type: Number},
  department: { type: String},
  slug: {type: String},
  slogan: {type: String}
});

module.exports = mongoose.model('Departments', DepartmensSchema);