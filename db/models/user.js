const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcrypt");

const { secret } = require("../config/env");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: String,
    hashedPassword: {
      type: String,
      //required: true,
    },
    token: String,
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

UserSchema.virtual("password");

UserSchema.pre("validate", async function () {
  if (!this.password) return;

  try {
    this.hashedPassword = await hash(this.password, 10);
    //console.log(this.hashedPassword, this.password);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

UserSchema.statics.authenticate = async function ({ email, password }) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("Email or password are wrong");

  const result = await compare(password, user.hashedPassword);
  if (!result) throw new Error("Email or password are wrong");

  // JWT
  user.token = jwt.sign({ id: user._id }, secret, { expiresIn: "4h" });
  await user.save();

  return user;
};

module.exports = mongoose.model("User", UserSchema);
