const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc Register a new user
// @route POST /api/users/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!(username && email && password)) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const userExists = await User.findOne({ email });
  if(userExists){
    res.status(400);
    throw new Error("User with same Email already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create new user
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  if(newUser) {
    res.status(201).json({_id : newUser._id , email : newUser.email  });
  }else{
    res.status(400);
    throw new Error("Failed to create user");
  }
});

// @desc Login a user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user ||!(await bcrypt.compare(password, user.password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const signToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    res.status(200).json({ token: signToken }); 
});

// @desc Current user Information
// @route POST /api/users/current
// @access private
const currentUser = asyncHandler(async (req, res) => {
  res.json({ message: "Current User information retrieved successfully!" });
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
