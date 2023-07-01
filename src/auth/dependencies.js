const UserDAO = require('../modules/User/DAO/UserDAO');
const AuthService = require('./AuthService');
const AuthManager = require('./AuthManager');

const userDAO = UserDAO.getInstance();
const authService = new AuthService(userDAO);
const authManager = new AuthManager(authService);

module.exports = authManager;
