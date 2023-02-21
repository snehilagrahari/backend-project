const express = require('express');
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const { UserModel } = require('../models/user.model');
const { checkEmailLogin, checkEmailSignup } = require('../middlewares/checkEmail');
const { authenticator } = require('../middlewares/authenticator');
const { userLogger } = require('../middlewares/userLogger');
const {validator} = require('../middlewares/validator');
const { checkPassword } = require('../middlewares/checkPassword');

const userRouter = express.Router();

userRouter.get("/",async(req,res)=>{
    try{
        const user = await UserModel.find();
        res.status(200).send(user);
    }
    catch(err){
        res.status(400).send({err : err.message, msg : "Error fetching data"} )
    }
})

userRouter.get('/:id',async (req,res)=>{
    const id = req.params.id;
    try{
        const user = await UserModel.findOne({_id : id});
        res.status(200).send(user);
    }
    catch(err){
        res.status(400).send({err : err.message, msg : "Error fetching data"} )
    }
})

userRouter.post('/register',checkEmailSignup,checkPassword,async(req,res)=>{
    try{
        const {email, username, password, role, location,dob} = req.body;
        bcrypt.hash(password,6,async (err,encrypted)=>{
            if(err){
                res.status(400).send({
                    msg : 'Error hashing password'
                })
            }
            else{
                const user = new UserModel({email,username,password : encrypted,role,location,dob});
                await user.save();
                res.status(200).send({
                    msg : "User registered successfully!"
                })
            }
        })
    }
    catch(err){
        res.status(500).send({
            err : err.message
        })
    }
})

userRouter.post("/login",checkEmailLogin,authenticator,userLogger,async (req,res)=>{
    try{
        const {email} = req.body
        const userDetails = await UserModel.findOne({email});
        const loginToken = jwt.sign({ email },process.env.jwtKey,{expiresIn : '1h'});
        res.status(200).send({msg : "Login Successful!", token : loginToken, userDetails});
    }
    catch(err){
        res.status(500).send({msg : 'Error Logging in!'});
    }
})

userRouter.patch('/changePassword/:id',async(req,res)=>{
    try{
        const id = req.params.id
        const {oldPassword,newPassword} = req.body;
        const matchedData = await UserModel.findOne({_id : id})
        bcrypt.compare(oldPassword,matchedData.password,async (err,result)=>{
            if(result==true){
                bcrypt.hash(newPassword,6,async (err,encrypted)=>{
                    if(err){
                        res.status(400).send({
                            msg : 'Error hashing new password!'
                        })
                    }
                    else{
                        await UserModel.updateOne({email},{password : encrypted})
                        res.status(200).send({
                            msg : "Password updated successfully!"
                        })
                    }
                })
            }
            else{
                res.status(400).send({msg : "Incorrect Password"})
            }
        })
    }
    catch(err){
        res.status(500).send("Something went wrong. Try again!")
    }
})

userRouter.patch("/:id",validator,async (req,res)=>{
    const id = req.params.id;
    try{
        const details = req.body;
        await UserModel.findByIdAndUpdate({_id : id},req.body);
        res.status(200).send({msg : "User Details have been Updated!"});
    }
    catch(err){
        res.status(500).send({msg : "Something went wrong", error : err.message});
    }
})

userRouter.delete("/:id",validator, async (req,res)=>{
    const userId = req.params.id;
    try{
        await UserModel.findByIdAndDelete({_id : userId});
        res.status(200).send({msg : "User has been deleted!"})
    }
    catch(err){
        res.status(500).send({msg : "Error Occurred! Try Again!", error : err.message})
    }
})

module.exports = {
    userRouter
}