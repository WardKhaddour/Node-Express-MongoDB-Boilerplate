const { validationResult } = require('express-validator');
const { UNPROCESSABLE_ENTITY } = require('http-status-codes').StatusCodes;

const msgValidationResult = validationResult.withDefaults({
  formatter: error => ({ filed: error.param, error: error.msg }),
});

const validateRequest = (req, res, next) => {
  const errors = msgValidationResult(req);

  if (!errors.isEmpty())
    return res.status(UNPROCESSABLE_ENTITY).json({
      success: false,
      message: 'Invalid data',
      data: {
        errors: errors.array(),
      },
    });

  return next();
};

module.exports = validateRequest;
