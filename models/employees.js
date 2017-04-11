/**
 * Created by rafa on 08/04/2017.
 */
'use strict';

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var password = require('password-generator');

var Schema = mongoose.Schema;
//var passportLocalMongoose = require('passport-local-mongoose');

var Employee = new Schema({
  employee_id: {type: String, unique: true},
  botId: {type: String, unique: true},
  username: String,
  firstname: {type: String, default:'NoName'},
  lastname: {type: String, default: 'NoLastname'},
  email: String,
  fired: {type: Boolean, default: false},
  firedDate: {type: Date},
  hiredDate: {type: Date},
  phonenumber: {type:String},
  department: { type: String},
  position: {type:String},
  hired: {type: Boolean, default: true},
  // department: { type: Schema.Types.Number, ref: 'Departments' },
  // position: { type: Schema.Types.Number, ref: 'Positions' },
  salary_fixed: {
    type: Number,
    default: 0.0
  },
  bonus: {
    type: Number,
    default: 0.0
  },
  worker_type: {type: String, default: null},
  work_time: { //fixed work time
    type: Number,
    default: 0
  },
  registered_at: { type: Date, default: Date.now },
  checked: {
    type: Boolean,
    default:false
  },
  updated: Date,
  rating: [{type: Number}],
  report: [{
    type: Schema.Types.ObjectId,
    ref: 'Reporting'
  }],
  // book: [{ type: Schema.Types.ObjectId, ref: 'Books' }],
  admin: {
    type: Boolean,
    default: false
  },
  code: [{type: String}],
  'megaplan': { type: String, default: null}, // poroli
  'one_c': { type: String, default: null},// poroli
  'computer': { type: String, default: null},// poroli
},{
  timestamp:true
});
// var Employee = new Schema({
//   employee_id: {type: String, unique: true},
//   botId: {type: String, unique: true},
//   username: String,
//   firstname: {type: String, default:'NoName'},
//   lastname: {type: String, default: 'NoLastname'},
//   email: String,
//   disabled: {type: Boolean, default: false},
//   phonenumber: {type:String},
//   department: { type: Schema.Types.ObjectId, ref: 'Departments' },
//   position: { type: Schema.Types.ObjectId, ref: 'Positions' },
//   salary_fixed: {
//     type: Number,
//     default: 0.0
//   },
//   bonus: {
//     type: Number,
//     default: 0.0
//   },
//   work_time: { //fixed work time
//     type: Number,
//     default: 0
//   },
//   registered_at: { type: Date, default: Date.now },
//   checked: {
//     type: Boolean,
//     default:false
//   },
//   updated: Date,
//   rating: [{type: Number}],
//   report: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Reporting'
//   }],
//   book: [{ type: Schema.Types.ObjectId, ref: 'Books' }],
//   admin: {
//     type: Boolean,
//     default: false
//   },
//   code: [{type: String}],
// },{
//   timestamp:true
// });

Employee.methods.generatePasswords = function () {
  // this.megaplan = Math.floor(Math.random() * (90000000 - 1000) + 1000);
  // this.one_c = Math.floor(Math.random() * (90000000 - 1000) + 1000);
  // this.computer = Math.floor(Math.random() * (90000000 - 1000) + 1000);
  this.megaplan = password(12, false);
  this.one_c = password(12, false);
  this.computer = password(12, false);
};

Employee.pre('save', function (next) {
  var currentDate = new Date();
  this.updated = currentDate;
  next();
});

Employee.methods.disableEmployee = function () {
  this.fired = true;
};

Employee.methods.enableEmployee = function () {
  this.fired = false;
};

Employee.methods.getName = function () {
  return this.firstname + ' ' + this.lastname;
};

Employee.methods.getId = function(){
  return this.id;
};

Employee.methods.getBotId = function(){
  return this.botId;
};

Employee.methods.generateCode = function(){
  var code = [];
  var index = Math.floor(Math.random() * (9 - 8) + 8);

  for(var i = 0; i < index; ++i){
    var number = Math.floor(Math.random() * (9000 - 1000) + 1000);
    code[i] = number;
    // console.log(code[i] = number);
  }
  return code;
};

//User.plugin(passportLocalMongoose);

module.exports = mongoose.model('Employee', Employee);