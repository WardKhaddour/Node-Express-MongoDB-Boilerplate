const isMatchedPasswords =
  ({ compareWith }) =>
  (value, { req }) => {
    if (value !== req.body[compareWith]) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  };

module.exports = isMatchedPasswords;
