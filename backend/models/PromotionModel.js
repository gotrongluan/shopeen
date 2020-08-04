var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var PromotionSchema = mongoose.Schema({
  category: { type: String, enum: ['disount', 'bogof'] },
  description: { type: String },
});

module.exports = mongoose.model('Promotion', PromotionSchema);
