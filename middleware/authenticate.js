const jwt = require('jsonwebtoken')
const User = require("../db/user")
const Admin = require("../db/admin")
const Authenticate = async (req,res,next) => {
    try {
        const token = req.cookies.jwtoken;
        const varifyToken = jwt.verify(token,process.env.SECRET_KEY);
        const rootUser = await User.findOne({_id:varifyToken._id,"tokens.token":token})

        if(!rootUser){throw new Error('User not found') } 

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next()
    } catch (error) {
        console.log(error)
    }
}
const AuthenticateAdmin = async (req,res,next) => {
    try {
        const token = req.cookies.jwtoken;
        const varifyToken = jwt.verify(token,process.env.SECRET_KEY);
        const rootAdmin = await Admin.findOne({_id:varifyToken._id,"tokens.token":token})

        if(!rootAdmin){throw new Error('Admin not found') } 

        req.token = token;
        req.rootAdmin = rootAdmin;
        req.AdminID = rootAdmin._id;
        next()
    } catch (error) {
        console.log(error)
    }
}
module.exports = Authenticate,AuthenticateAdmin;