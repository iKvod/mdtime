'use strict';

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var DepartmentsSchema = new Schema({
  department: {type: String},
  subsidary: {type: Schema.Types.ObjectId, ref: 'Subsidary'},
  positions: [{type: Schema.Types.ObjectId, ref: 'Positions'}]
});

// var DepartmentsSchema = new Schema({
//   title: {type: String},
//   content: {type: String},
//   photoUtl: {type: String},
//   // author: {type: mongoose.Schema.ObjectId, ref: 'Users'}
//   // comments: [{type: mongoose.Schema.ObjectId, ref: 'Comments'}]
//   // positions: [{type: mongoose.Schema.ObjectId, ref: 'Positions'}]
// });

module.exports = mongoose.model('Departments', DepartmentsSchema );