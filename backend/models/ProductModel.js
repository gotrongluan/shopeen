var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ProductSchema = mongoose.Schema({
  name: { type: String, required: true },
  shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  description: { type: String },
  promotion: { type: Schema.Types.ObjectId, ref: 'Promotion', default: null },
});

module.exports = mongoose.model('Product', ProductSchema);
