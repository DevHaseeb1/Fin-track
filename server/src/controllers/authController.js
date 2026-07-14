const { registerUser, loginUser, getProfile } = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

exports.register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  success(res, result, 201);
});

exports.login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  success(res, result);
});

exports.getMe = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);
  success(res, profile);
});
