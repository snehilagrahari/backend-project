const checkPassword = (req,res,next) =>{
    const {password , confirmPassword} = req.body;
    if(password === confirmPassword)
        next();
    else
        res.status(400).send({msg : "Passwords do not match!"});
}

module.exports = {
    checkPassword
}