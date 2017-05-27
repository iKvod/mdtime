/**
 * Created by rafa on 11/05/2017.
 */
var mongoose =require('mongoose');
var Schema = mongoose.Schema;

var InsightSchema = new Schema({
  created_at: {type: Date},
  owner: { type: Schema.Types.ObjectId, ref: 'Employee' },
  insight: { type: String }
},{
  timestamps: {createdAt: 'created_at'}
});

module.exports = mongoose.model('Insights', InsightSchema);