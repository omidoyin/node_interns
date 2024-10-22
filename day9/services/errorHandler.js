const createError = require('http-errors');

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'An unexpected error occurred. Please try again later.';

  res.status(status).json({
    error: message,
  });
};

module.exports = errorHandler;
