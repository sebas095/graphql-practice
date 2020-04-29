const mongoose = require("mongoose");
const { Schema } = mongoose;

const CourseSchema = new Schema(
  {
    title: String,
    views: { type: Number, default: 0 },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model("Course", CourseSchema);
