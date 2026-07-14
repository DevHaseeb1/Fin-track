const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const categories = await Category.find({ user: req.user._id }).sort({ type: 1, name: 1 });
  success(res, categories);
});

exports.create = asyncHandler(async (req, res) => {
  const { name, type } = req.body;
  const existing = await Category.findOne({ user: req.user._id, name });
  if (existing) {
    return error(res, 'Category already exists', 409);
  }
  const category = await Category.create({ name, type, user: req.user._id });
  success(res, category, 201);
});

exports.update = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, user: req.user._id });
  if (!category) {
    return error(res, 'Category not found', 404);
  }
  category.name = req.body.name || category.name;
  category.type = req.body.type || category.type;
  await category.save();
  success(res, category);
});

exports.remove = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, user: req.user._id });
  if (!category) {
    return error(res, 'Category not found', 404);
  }

  const txCount = await Transaction.countDocuments({ category: category._id });
  if (txCount > 0) {
    return error(res, 'Cannot delete category with existing transactions. Reassign or delete transactions first.', 409);
  }

  await category.deleteOne();
  success(res, { message: 'Category deleted' });
});
