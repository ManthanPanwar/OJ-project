const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Register a new user
// @route   POST /api/users/register
// @access  public
const registerUser = async (req, res) => {
  try {
    // get the data
    const { username, email, password } = req.body;

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({
          message: "User with same Email already exists",
          success: false,
        });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // save the user
    // User.create() already saves the document
    // await newUser.save();

    res.status(201).json({message: "User registered successfully", success: true})
  } catch (error) {
    res.status(500).json({message: "Internal Server error", success: false})

  }
};

// @desc    Login a user
// @route   POST /api/auth/login
// @access  public
const loginUser = async (req, res) => {
  try {
    // store the data
  const { email, password } = req.body;
  errMsg = "Auth failed, please check your login credentials";

  // check if user exists and password matches
  const user = await User.findOne({ email });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!user || !isMatch) {
    return res.status(403).json({message: errMsg, success: false});
  }

  // create and assign a token to the user
  const signToken = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.cookie("token", signToken, { 
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 3600000), 
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
  res.status(200).json({ message: "Login Success", signToken, email, username: user.username, success: true});
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully", success: true });
}
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
