const express=require('express')
const cors=require('cors')
require("dotenv").config();

const app = express();
app.use(express.json())



app.listen(7000,()=>{
    console.log("Server started At port 7000")
})