const { UNAUTHORIZED } = require('http-status-codes').StatusCodes;

const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/jwt');

class AuthService {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async verifyToken(token, secret) {
    const decodedToken = await verifyToken(token, secret);
    const { userId } = decodedToken;
    const user = await this.userDAO.findById(userId);
    if (!user) {
      throw new AppError('Account is deleted', UNAUTHORIZED);
    }
    return decodedToken;
  }

  async changedPasswordAfter(userId, date) {
    return this.userDAO.changedPasswordAfter(userId, date);
  }

  async getUserRole(userId) {
    return this.userDAO.getUserRole(userId);
  }
}

module.exports = AuthService;
