const asyncHandler = require("express-async-handler");
require("dotenv").config();

const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const validateLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    res.status(400);
    throw new Error("Username not found");
  } else {
    if (user.password === password) {
      const accessToken = jwt.sign(
        {
          user: {
            id: user._id,
            username: user.username,
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      res.status(200).json({
        id: user._id,
        username: user.username,
        token: accessToken,
      });
    } else {
      res.status(400);
      throw new Error("Invalid password");
    }
  }
});

module.exports = validateLogin;
