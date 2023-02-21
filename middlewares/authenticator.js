const bcrypt = require('bcrypt');
const { UserModel } = require('../models/user.model');

const authenticator = async(req,res,next)=>{
    const {email, password} = req.body;
    try{
        const matchedData = await UserModel.findOne({email});
        bcrypt.compare(password,matchedData.password,(err,result)=>{
            if(result == true){
                next();
            }
            else    
                res.status(400).send({msg : "Incorrect Password!"})
        })
    }
    catch(err){
        res.status(500).send({msg : "Error Loading data! Try again!"});
    }
}

module.exports = {
    authenticator
}