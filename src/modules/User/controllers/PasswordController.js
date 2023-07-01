const catchAsync = require('../../../utils/catchAsync');

class PasswordController {
  constructor(passwordService) {
    this.passwordService = passwordService;
  }
}

module.exports = PasswordController;
