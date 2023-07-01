class AppError extends Error {
  constructor(message, statusCode, path, value, code, errmsg) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.path = path;
    this.value = value;
    this.code = code;
    this.errmsg = errmsg;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
