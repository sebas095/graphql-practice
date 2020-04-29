const { Course, User } = require("../models");

module.exports = {
  Query: {
    async getCourses(obj, { page, limit }) {
      if (page !== undefined) {
        return await Course.find()
          .skip((page - 1) * limit)
          .limit(limit);
      }

      return await Course.find();
    },

    async getCourse(obj, { id }) {
      return await Course.findById(id);
    },
  },

  Mutation: {
    async addCourse(obj, { input, user_id }, ctx) {
      if (!ctx || !ctx.currentUser)
        throw new Error("User must be authenticated");

      const course = await Course.create({ ...input, user: user_id });
      const user = await User.findById(user_id);

      user.courses.push(course);
      await user.save();

      return course;
    },

    async updateCourse(obj, { id, input }) {
      return await Course.findByIdAndUpdate(id, input, { new: true });
    },

    async deleteCourse(obj, { id }) {
      await Course.findOneAndDelete(id);
      return { message: `El curso con id ${id} fue eliminado!` };
    },
  },

  Course: {
    async user({ user }) {
      return await User.findById(user);
    },
  },
};
