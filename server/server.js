const express=require('express')
const cors=require('cors');
const scanRoute=require('./controller/scanner');
require("dotenv").config();

const app = express();
app.use(express.json())
app.use(cors())

app.use(scanRoute);



app.get('/',(req,res)=>{
    res.send("Api is running!....")
})

app.listen(7000,()=>{
    console.log("Server started At port 7000")
})