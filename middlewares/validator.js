const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user.model');
require('dotenv').config();

const validator =async  (req,res,next)=>{
    const token = req.headers.authorization;
    try{
        jwt.verify(token,process.env.jwtKey,async (err,decrypted)=>{
            if(err)
                res.status(400).send({msg : "Invalid Token Provided!"})
            else{
                const user = await UserModel.findOne({email : decrypted.email})
                const userRole = user.role;
                if(userRole === 'Admin')
                    next();
                else
                    res.send({msg : 'You are not authorized for this operation.'})
            }
        })
    }
    catch(err){
        res.status(500).send({msg : 'Error while validating', err : err.message});
    }
}

module.exports = {
    validator
}