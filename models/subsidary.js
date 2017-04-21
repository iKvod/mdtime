'use strict';
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var Subsidary = new Schema({
  subsidary: { type: String },
  departments: [{type: Schema.Types.ObjectId, ref: 'Departments'}],
  registred_at: { type: Date, default: Date.now }
});

// var Subsidary = new Schema({
//   firstname: { type: String },
//   post: [{type: mongoose.Schema.ObjectId, ref: 'Departments'}],
//   registred_at: { type: Date, default: Date.now }
// });


module.exports = mongoose.model('Subsidary', Subsidary);