const { UserModel } = require("../models/user.model");

const checkEmailSignup = async (req,res,next)=>{
    const {email} = req.body;
    try{
        const matchedData = await UserModel.findOne({email});
        if(matchedData){
            res.status(400).send({msg : "User already registered. Please Login!"})
        }
        else
            next();
    }
    catch(err){
        res.status(500).send({msg : "Error Loading Data!"});
    }
}

const checkEmailLogin = async(req,res,next)=>{
    const {email} = req.body;
    try{
        const matchedData = await UserModel.findOne({email});
        if(!matchedData){
            res.status(400).send({msg : "User not registered. Signup first!"})
        }
        else
            next();
    }
    catch(err){
        res.status(500).send({msg : "Error Loading Data!"});
    }    
}

module.exports = {
    checkEmailLogin,
    checkEmailSignup
}