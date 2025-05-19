const jwt = require("jsonwebtoken");
const User = require("../models/User");

// const userAuth = async (req, res, next) => {
//     let token;
//     let authHeader = req.headers.authorization || req.headers.authorization
//     if(authHeader && authHeader.startsWith('Bearer ')) {
//         token = authHeader.split(' ')[1]
//         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//             if(err){
//                 res.status(401);
//                 throw new Error('Invalid token');
//             }
//             console.log(decoded)
//             req.user = decoded.user;  // add user to request object for later use in routes.js
//             next();
//         });
//     }

//     if(!token){
//         res.status(401);
//         throw new Error('No token provided');
//     }
//     next();
// }

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token)
      throw new Error("No token provided");

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const {_id} = decoded;

    const user = await User.findById(_id);
    if(!user)
        throw new Error("User not found");
    req.user = user;
    next();

  } catch (error) {
    return res.status(403).json({ message: error.message, success: false});
  }
};

module.exports = userAuth;
