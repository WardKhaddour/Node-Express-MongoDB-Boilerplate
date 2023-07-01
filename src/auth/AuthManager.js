const { UNAUTHORIZED, INTERNAL_SERVER_ERROR, FORBIDDEN } =
  require('http-status-codes').StatusCodes;
const {
  UNAUTHORIZED: UNAUTHORIZED_PHRASE,
  INTERNAL_SERVER_ERROR: INTERNAL_SERVER_ERROR_PHRASE,
} = require('http-status-codes').ReasonPhrases;
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

class AuthManager {
  constructor(authService) {
    this.authService = authService;
  }

  restrictAuthenticated = catchAsync(async (req, res, next) => {
    // 1) Getting the token and check if exist

    if (!req.headers.authorization) {
      return next(new AppError(UNAUTHORIZED_PHRASE, UNAUTHORIZED));
    }

    const token = req.headers.authorization.split('Bearer')[1].trim();
    if (!token) {
      return next(new AppError(UNAUTHORIZED_PHRASE, UNAUTHORIZED));
    }

    // 2) Verification token
    try {
      const decodedToken = await this.authService.verifyToken(
        token,
        process.env.JWT_SECRET
      );

      // 4) Check if user changed password after the token was issued

      const tokenIssuedAt = decodedToken.iat || 0;
      if (
        await this.authService.changedPasswordAfter(
          decodedToken.userId,
          tokenIssuedAt
        )
      ) {
        return next(
          new AppError(
            'Password Changed Recently, Please Login Again ',
            UNAUTHORIZED
          )
        );
      }

      // Populate User to Request Object
      req.userId = decodedToken.userId;
      return next();
    } catch (err) {
      console.log(err);
      return next(
        new AppError(INTERNAL_SERVER_ERROR_PHRASE, INTERNAL_SERVER_ERROR)
      );
    }
  });

  restrictTo(...roles) {
    return async (req, res, next) => {
      const role = await this.authService.getUserRole(req.userId);
      if (!roles.includes(role)) {
        return next(new AppError('Unauthorized', FORBIDDEN));
      }
      return next();
    };
  }
}

module.exports = AuthManager;
