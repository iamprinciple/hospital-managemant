const express = require("express");
const app = express()
const userrouter = require("./routes/userRouter");
const doctorrouter = require("./routes/doctorRouter")
require("dotenv").config()
const cors = require("cors");
const dbConnect = require("./Config/db.config");
const adminrouter = require("./routes/adminRouter");

app.use(express.urlencoded({extended: true}))
app.use(express.json({extended: true, limit:"50mb"}))
app.use(cors({origin: "*"}))
app.use('/user', userrouter)
app.use('/doctor', doctorrouter)
app.use('/admin', adminrouter)



dbConnect()
let port = process.env.PORT || 4000;
app.listen(port, () =>{
    console.log(`App started at port ${port}`);
    
})