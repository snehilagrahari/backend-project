const fs = require('fs');
const mongoose = require('mongoose');
const { UserModel } = require('../models/user.model');

const currentTimeGen = ()=>{
    const now = new Date();
    const string = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} +05:30 GMT (IST)`;
    return string;
}

const userLogger = async (req,res,next)=>{
    const {email} = req.body;
    const authenticatedUser = await UserModel.findOne({email});
    const userRole = authenticatedUser.role;
    fs.appendFileSync("logs.txt",`\${email} | ${authenticatedUser.username} | ${currentTimeGen()}.\n`);
    next();
}

module.exports = {
    userLogger
}