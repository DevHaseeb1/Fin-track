const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  type: { type: String, enum: ['income', 'expense'], required: [true, 'Transaction type is required'] },
  amount: { type: Number, required: [true, 'Amount is required'], min: [0, 'Amount must be positive'] },
  description: { type: String, trim: true, default: '' },
  date: { type: Date, required: true, default: Date.now }
}, { timestamps: true });

transactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
