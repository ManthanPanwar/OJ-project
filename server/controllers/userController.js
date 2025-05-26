// @desc Current user Information
// @route GET /api/users/current
// @access private
const currentUser = async (req, res) => {
  const user = req.user;
  res.json({ 
    success: true,
    message: "Current User information retrieved successfully!",
    user: {
      username: user.username,
      email: user.email
    }
  });
};

module.exports = {currentUser};