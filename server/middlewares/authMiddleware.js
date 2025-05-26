const jwt = require("jsonwebtoken");
const User = require("../models/User");  

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]
    }else if(req.cookies.token){
        token = req.cookies.token
    }
    if (!token)
      return res.status(403).json({ message: "Unauthorized", success: false});

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const {_id} = decoded;

    const user = await User.findById(_id);
    if(!user) return res.status(401).json({ message: "User not found", success: false});
        
    req.user = user;
    next();

  } catch (error) {
    return res.status(403).json({ message: "JWT token expired or invalid", success: false});
  }
};

module.exports = authMiddleware;
