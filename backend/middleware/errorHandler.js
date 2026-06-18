module.exports = (err, req, res, next) => {
  console.error('🔥 Server Error Handler:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    status: 'error',
    statusCode: status,
    message: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
