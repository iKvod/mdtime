/**
 * Created by rafa on 05/05/2017.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var LateReportSchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  created_at: { type: Date },
  latetype: { type: String },
  latetime: { type: Number }
},{
  timestamps: { createdAt: 'created_at' }
});

module.exports = mongoose.model('LateReports', LateReportSchema);