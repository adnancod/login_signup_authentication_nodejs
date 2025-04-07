const { error } = require('console');
const jwt= require('jsonwebtoken');
require('dotenv').config();

const jwtAuthMiddleware = (req, res, next) => {
    const authorization= req.headers.authorization;
    if(!authorization){
        return res.status(404).json({error: 'Token not found'});
    }

    //Extract the jwt token from request header
    const token = req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(404).json({error: 'Unauthorized'});
    }
    try {
        const decoded= jwt.verify(token, process.env.JWT_SECRET, {expiresIn: 30000});

        req.user= decoded;
        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'})
    }

}

const generateToken= (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET);
}

module.exports= {jwtAuthMiddleware, generateToken}