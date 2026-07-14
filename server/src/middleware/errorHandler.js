const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, error: { message: messages.join(', ') } });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ success: false, error: { message: `Duplicate value for ${field}`, field } });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: { message: 'Invalid ID format' } });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({ success: false, error: { message } });
};

module.exports = errorHandler;
