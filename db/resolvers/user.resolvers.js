const { User, Course } = require("../models");

module.exports = {
  Query: {
    async getUser(obj, { id }) {
      return await User.findById(id);
    },

    async getUsers(obj) {
      return await User.find();
    },
  },

  Mutation: {
    async signUp(obj, { input }) {
      return await User.create(input);
    },

    async logIn(obj, { input }) {
      try {
        const user = User.authenticate(input);
        return user;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
  },

  User: {
    async courses({ _id }) {
      return await Course.find({ user: _id });
    },
  },
};
