const jwt = require("jsonwebtoken");

const { User } = require("../models");
const { secret } = require("./env");

module.exports = async ({ req }) => {
  let token = null;
  let currentUser = null;

  token = req.headers["authorization"];
  if (!token) return {};

  const decodedInfo = jwt.verify(token, secret);

  if (token && decodedInfo) {
    currentUser = await User.findById(decodedInfo.id);
    if (!currentUser) throw new Error("Invalid token");
  }

  // !Protect all your schemas
  /* if (!currentUser) {
    throw new Error("Need token");
  } */

  return { token, currentUser };
};
