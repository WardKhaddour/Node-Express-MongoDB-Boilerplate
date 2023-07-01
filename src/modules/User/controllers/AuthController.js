const catchAsync = require('../../../utils/catchAsync');

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }
}

module.exports = AuthController;
