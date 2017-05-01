/**
 * Created by rafa on 24/04/2017.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//
//
// полный день пол дня

var DaylyModeTypeSchema = new Schema({
  mode: { type: String }
});

module.exports = mongoose.model('Daylymodes',  DaylyModeTypeSchema  );
