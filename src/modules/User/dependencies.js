const UserDAO = require('./DAO/UserDAO');
const AuthController = require('./controllers/AuthController');
const AuthService = require('./services/AuthService');
const PasswordService = require('./services/PasswordService');
const PasswordController = require('./controllers/PasswordController');
const UserService = require('./services/UserService');
const UserController = require('./controllers/UserController');

const userDAO = UserDAO.getInstance();

const authService = new AuthService(userDAO);
const passwordService = new PasswordService(userDAO);
const userService = new UserService(userDAO);
const authController = new AuthController(authService);
const passwordController = new PasswordController(passwordService);
const userController = new UserController(userService);

module.exports = {
  authController,
  passwordController,
  userController,
};
