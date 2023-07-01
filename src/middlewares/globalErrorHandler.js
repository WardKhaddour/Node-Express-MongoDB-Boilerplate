const { INTERNAL_SERVER_ERROR, BAD_REQUEST, UNAUTHORIZED } =
  require('http-status-codes').StatusCodes;

const AppError = require('../utils/AppError');

const handleCastErrorDB = err => {
  const message = `Invalid data, ${err.path}: ${err.value}`;
  return new AppError(message, BAD_REQUEST);
};

const handleDuplicateFieldsDB = err => {
  let message = 'Duplicate field value. Please use another value.';
  const regEx = /(["'])(\\?.)*?\1/;
  if (err.errmsg && err.errmsg.match(regEx)) {
    const value = err.errmsg.match(regEx)[0] || '';
    message = `Duplicate field value: ${value}. Please use another value.`;
  }

  return new AppError(message, BAD_REQUEST);
};

const handleValidationErrorDB = () => {
  const message = 'Invalid Input Data';
  return new AppError(message, BAD_REQUEST);
};

const handleJWTError = () => {
  return new AppError('Invalid Token. Please login again', UNAUTHORIZED);
};

const handleJWTExpiredError = () => {
  return new AppError(
    'An Error occurred. Please try again later',
    UNAUTHORIZED
  );
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
    error: err,
    data: null,
  });
};

// eslint-disable-next-line consistent-return
const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
    });
  }

  console.error('Error 💣️💣️', err);

  res.status(INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'An Error occurred. Please try again later',
    data: null,
  });
};

const globalErrorHandler = (err, req, res, next) => {
  let error = new AppError(
    err.message,
    err.statusCode,
    err.path,
    err.value,
    err.code,
    err.errmsg
  );
  error.statusCode ||= INTERNAL_SERVER_ERROR;
  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(error, res);
  }

  console.log(error);

  if (error.name === 'CastError') {
    error = handleCastErrorDB(error, req);
  }

  if (error.code === 11000) {
    error = handleDuplicateFieldsDB(error, req);
  }

  if (error.name === 'ValidationError') {
    error = handleValidationErrorDB(error, req);
  }

  if (error.name === 'JsonWebTokenError') {
    error = handleJWTError(req);
  }

  if (error.name === 'TokenExpiredError') {
    error = handleJWTExpiredError(req);
  }

  return sendErrorProd(error, req, res);
};

module.exports = globalErrorHandler;
