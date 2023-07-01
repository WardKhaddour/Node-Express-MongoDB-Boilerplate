const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { createToken } = require('../../../utils/cryptoTokenHelper');
const isValidEmail = require('../validators/custom/isValidEmail');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      validate: {
        validator: isValidEmail,
        message: props => `${props.value} is not a valid email`,
      },
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      select: false,
    },
    photoSrc: {
      type: String,
      required: false,
      default: 'default-user-photo.png',
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    emailIsConfirmed: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    emailConfirmToken: {
      type: String,
    },
    emailConfirmExpires: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual('photo').get(function () {
  const currentUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.PROD_URL
      : process.env.DEV_URL;

  const userPhotoUrl = `${currentUrl}/images/users/${this.photoSrc}`;
  return userPhotoUrl;
});

UserSchema.pre(/^find/, function (next) {
  if (!this.getOptions().getDisabled) {
    this.find({ active: true });
  }
  next();
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);

  return next();
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('email')) {
    this.emailIsConfirmed = false;
  }
  next();
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
  return next();
});

UserSchema.methods.isCorrectPassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      `${this.passwordChangedAt.getTime() / 1000}`,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means not changed
  return false;
};
UserSchema.methods.createEmailConfirmToken = function () {
  const { token, hashedToken } = createToken();
  this.emailConfirmToken = hashedToken;

  this.emailConfirmExpires = Date.now() + 10 * 60 * 1000;

  return token;
};

UserSchema.methods.createPasswordResetToken = function () {
  const { token, hashedToken } = createToken();
  this.passwordResetToken = hashedToken;

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return token;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
