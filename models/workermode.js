/**
 * Created by rafa on 18/04/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// Flexible Fixed Freelancer
var WorkerModeSchema = new Schema({
  mode: {type: String}
});

module.exports = mongoose.model('Workermodes', WorkerModeSchema);