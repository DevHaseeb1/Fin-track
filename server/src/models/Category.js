const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: [true, 'Category name is required'], trim: true },
  type: { type: String, enum: ['income', 'expense'], required: [true, 'Category type is required'] }
}, { timestamps: true });

categorySchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
