const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;  // Default to 500 if no status code is set
  res.status(statusCode).json({
    message: err.message,
    // Only show the stack trace in development mode (useful for debugging)
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
