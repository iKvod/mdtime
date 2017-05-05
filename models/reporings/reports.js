/**
 * Created by rafa on 26/04/2017.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TimeReportingSchema = new Schema({
  created_at: { type: Date },
  employee: { type: Schema.Types.ObjectId, ref: 'Employees' },
  checkin: { type: Date, default: null },
  checkout: { type: Date, default: null },
  goOutFromWork: { type: Number, default: null },// only for fixed tarifed employees
  lateToWorkTime: { type: Number, default: null },// only for fixed tarifed employees
  willBeAbsent: { type: Boolean, default: false }, //
  report: { type: String, default: null},
  insight: { type: String, default: null }

}, {
  timestamps: {createdAt: 'created_at'}
});


// TimeReportingSchema.pre('save', function () {
//
// })


module.exports = mongoose.model('Timereportings', TimeReportingSchema);