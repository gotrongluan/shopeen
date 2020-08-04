var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var PromotionSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

module.exports = mongoose.model('Promotion', PromotionSchema);
