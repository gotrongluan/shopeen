var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ShopSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true, unique: true },
  category: { type: String, enum: ['food', 'beverage', 'clothes'] },
  description: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

module.exports = mongoose.model('Shop', ShopSchema);
