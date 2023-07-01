const catchAsync = require('../../../utils/catchAsync');

class UserController {
  constructor(userService) {
    this.userService = userService;
  }
}

module.exports = UserController;
