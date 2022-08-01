const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError, AuthenticationError } = require('apollo-server');
const checkAuth = require('../../util/check-auth');

const {
  validatedRegisterInput,
  validateLoginInput,
} = require('../../util/validators');

const User = require('../../models/User');

const { SECRET_KEY } = require('../../confing');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      image: user.image,
    },
    SECRET_KEY,
    { expiresIn: '24h' }
  );
};

const Mutation = {
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });
      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = 'Wrong credential';
        throw new UserInputError('Wrong credential', { errors });
      }

      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(
      _,
      { registerInput: { username, email, password, confirmPassword, image } }
    ) {
      const { valid, errors } = validatedRegisterInput(
        username,
        email,
        password,
        confirmPassword,
        image
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors }); //include payload
      }

      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This user name is taken', //this is payload for frontend
          },
        });
      }
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        image,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();

      const token = generateToken(res);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
module.exports = Mutation;
