const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const { type, category, startDate, endDate, page = 1, limit = 20 } = req.query;

  const filter = { user: req.user._id };

  if (type) filter.type = type;
  if (category) filter.category = category;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate('category', 'name type')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum),
    Transaction.countDocuments(filter)
  ]);

  success(res, {
    transactions,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  });
});

exports.getById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id })
    .populate('category', 'name type');

  if (!transaction) {
    return error(res, 'Transaction not found', 404);
  }

  success(res, transaction);
});

exports.create = asyncHandler(async (req, res) => {
  const { category, type, amount, description, date } = req.body;

  const cat = await Category.findOne({ _id: category, user: req.user._id });
  if (!cat) {
    return error(res, 'Category not found', 404);
  }

  const transaction = await Transaction.create({
    user: req.user._id,
    category,
    type,
    amount,
    description,
    date: date || new Date()
  });

  const populated = await transaction.populate('category', 'name type');
  success(res, populated, 201);
});

exports.update = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
  if (!transaction) {
    return error(res, 'Transaction not found', 404);
  }

  const { category, type, amount, description, date } = req.body;

  if (category) {
    const cat = await Category.findOne({ _id: category, user: req.user._id });
    if (!cat) {
      return error(res, 'Category not found', 404);
    }
    transaction.category = category;
  }

  if (type) transaction.type = type;
  if (amount !== undefined) transaction.amount = amount;
  if (description !== undefined) transaction.description = description;
  if (date) transaction.date = date;

  await transaction.save();

  const populated = await transaction.populate('category', 'name type');
  success(res, populated);
});

exports.remove = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
  if (!transaction) {
    return error(res, 'Transaction not found', 404);
  }

  await transaction.deleteOne();
  success(res, { message: 'Transaction deleted' });
});
