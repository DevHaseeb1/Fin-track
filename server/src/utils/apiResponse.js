const success = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, data });
};

const error = (res, message, statusCode = 500, field = null) => {
  const error = { message };
  if (field) error.field = field;
  return res.status(statusCode).json({ success: false, error });
};

module.exports = { success, error };
