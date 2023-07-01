const BaseDAO = require('../../../DAO/BaseDAO');
const { hashToken } = require('../../../utils/cryptoTokenHelper');
const User = require('../models/User');

class UserDAO extends BaseDAO {
  static #isInternalConstructing = false;

  constructor() {
    super(User);
    if (!UserDAO.#isInternalConstructing) {
      throw new TypeError('PrivateConstructor is not constructable');
    }
    UserDAO.#isInternalConstructing = false;
  }

  static getInstance() {
    UserDAO.#isInternalConstructing = true;

    if (!UserDAO.instance) {
      UserDAO.instance = new UserDAO();
    }
    return UserDAO.instance;
  }

  async findAll() {
    const users = await this.Model.find().select('+active');
    return users.map(user => this.formatEntity(user));
  }

  async findByEmail(email, options) {
    const query = this.Model.findOne({ email });
    if (options?.withPassword) {
      query.select('+active +password');
    } else {
      query.select('+active');
    }
    const user = await query;
    return this.formatEntity(user);
  }

  async findById(userId) {
    const user = await this.Model.findById(userId).select('+active');
    return this.formatEntity(user);
  }

  async findByResetPasswordToken(token) {
    const hashedToken = hashToken(token);
    const user = await this.Model.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    return this.formatEntity(user);
  }

  async findByConfirmEmailToken(token) {
    const hashedToken = hashToken(token);
    const user = await this.Model.findOne({
      emailConfirmToken: hashedToken,
      emailConfirmExpires: { $gt: Date.now() },
    });
    return this.formatEntity(user);
  }

  async getUserPhotoSrc(userId) {
    const userData = await this.Model.findById(userId).select('photoSrc');
    return userData.photoSrc;
  }

  async deactivateUser(userId) {
    const user = await this.Model.findById(userId);
    user.active = false;
    user.emailIsConfirmed = false;
    user.email = undefined;
    user.name = 'Deleted Account';
    user.photo = undefined;
    user.password = undefined;
    await this.saveEntity(user);
    return null;
  }

  async createEmailConfirmToken(userObj) {
    const user = await this.Model.findById(userObj.id);
    const confirmToken = user.createEmailConfirmToken();
    await this.saveEntity(user);
    return confirmToken;
  }

  async createPasswordResetToken(userObj) {
    const user = await this.Model.findById(userObj.id);
    const resetToken = user.createPasswordResetToken();
    await this.saveEntity(user);
    return resetToken;
  }

  async clearConfirmToken(userObj) {
    const user = await this.Model.findById(userObj.id);
    user.emailConfirmToken = undefined;
    user.emailConfirmExpires = undefined;
    await this.saveEntity(user);
  }

  async clearResetToken(userObj) {
    const user = await this.Model.findById(userObj.id);
    user.emailConfirmToken = undefined;
    user.emailConfirmExpires = undefined;
    await this.saveEntity(user);
  }

  async compareEmails(userId, newEmail) {
    const user = await this.Model.findById(userId);
    return user.email === newEmail;
  }

  async isCorrectPassword(userObj, password) {
    const user = await this.Model.findById(userObj.id).select('+password');
    return user.isCorrectPassword(password, user.password);
  }

  async changedPasswordAfter(userId, date) {
    const user = await this.Model.findById(userId).select('+password');
    return user.changedPasswordAfter(date);
  }

  async getUserRole(userId) {
    const user = await this.Model.findById(userId);
    return user && user.role;
  }
}
module.exports = UserDAO;
