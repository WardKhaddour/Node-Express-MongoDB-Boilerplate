class AuthService {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }
}

module.exports = AuthService;
