const express = require("express");
const { connection } = require("./db");
const cors = require('cors')
require('dotenv').config()

const {userRouter} = require('./routes/user.routes')

const app = express();

app.use(express.json());
app.use(cors());

app.use('/users',userRouter);

app.listen(process.env.PORT, async ()=>{
    try{
        await connection;
        console.log("Connected to DB");
    }
    catch(err){
        console.log({msg:  "Error Connecting to DB!" , err : err})
    }
    console.log(`Running server at PORT ${process.env.PORT}`);
})