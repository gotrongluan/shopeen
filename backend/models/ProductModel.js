var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ProductSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  promotion: { type: Schema.Types.ObjectId, ref: 'Promotion' },
});

module.exports = mongoose.model('Product', ProductSchema);
