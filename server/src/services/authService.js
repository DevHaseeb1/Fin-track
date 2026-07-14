const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Category = require('../models/Category');

const DEFAULT_CATEGORIES = [
  { name: 'Salary', type: 'income' },
  { name: 'Freelance', type: 'income' },
  { name: 'Investments', type: 'income' },
  { name: 'Food', type: 'expense' },
  { name: 'Transport', type: 'expense' },
  { name: 'Bills', type: 'expense' },
  { name: 'Rent', type: 'expense' },
  { name: 'Shopping', type: 'expense' },
  { name: 'Healthcare', type: 'expense' },
  { name: 'Other', type: 'expense' }
];

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }

  const user = await User.create({ name, email, password });

  const defaultCategories = DEFAULT_CATEGORIES.map(c => ({
    ...c,
    user: user._id
  }));
  await Category.insertMany(defaultCategories);

  const token = generateToken(user._id);

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email }
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken(user._id);

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email }
  };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return { id: user._id, name: user.name, email: user.email };
};

module.exports = { registerUser, loginUser, getProfile };
