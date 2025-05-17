const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.authorization
    if(authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                res.status(401);
                throw new Error('Invalid token');
            }
            console.log(decoded)
            req.user = decoded.user;  // add user to request object for later use in routes.js
            next();  
        });
    }

    if(!token){
        res.status(401);
        throw new Error('No token provided');
    }
    next();
})

module.exports = authMiddleware;