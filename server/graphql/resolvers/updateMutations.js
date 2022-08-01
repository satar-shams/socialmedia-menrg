const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { UserInputError, AuthenticationError } = require('apollo-server');

const checkAuth = require('../../util/check-auth');
const { validatedRegisterInput } = require('../../util/validators');

const User = require('../../models/User');
const { SECRET_KEY } = require('../../confing');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
};

const Mutation = {
  Mutation: {
    async updateUser(
      _,
      { registerInput: { username, email, password, confirmPassword, image } },
      context
    ) {
      const user = checkAuth(context);
      const { valid, errors } = validatedRegisterInput(
        username,
        email,
        password,
        confirmPassword,
        image
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      if (user.username !== username) {
        throw new UserInputError('Username is not valid', {
          errors: {
            username: 'Username is not valid',
          },
        });
      }

      password = await bcrypt.hash(password, 12);

      const userUpdated = await User.findOneAndUpdate(
        { username: user.username },
        {
          email,
          username,
          password,
        },
        { new: true }
      );
      const token = generateToken(userUpdated);
      return {
        ...userUpdated._doc,
        id: userUpdated._id,
        token,
      };
    },
  },
};
module.exports = Mutation;
