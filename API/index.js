const express = require("express");
const app=express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer=require("multer")
const path=require("path")
const chatRoute=require("./routers/chat");
const authRouter=require("./routers/Auth");
const conversationRouter=require("./routers/conversations");
const messageRouter=require("./routers/message");

dotenv.config();
mongoose.connect(process.env.MONGO_URL,()=>{
    console.log("connected to MongoDB");
});
mongoose.set('strictQuery', false);

app.use("/images",express.static(path.join(__dirname,"public/images")));
//middleWare
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/chat",chatRoute);
app.use("/api/auth",authRouter)
app.use("/api/conversations",conversationRouter);
app.use("/api/message",messageRouter)

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/images")
    },
    filename:(req,file,cb)=>{
        // cb(null,req.body.name)
        const name=req.body.name
        console.log(name);
        const filename=Date.now()+file.originalname
        cb(null,req.query.name)
    },
});

const upload=multer({storage});
app.post("/api/upload",upload.single("file"),(req,res)=>{
    try {
   
       return res.status(200).json("file uploaded successfully.");
    } catch (err) {
        console.log(err);  
    }
})

app.listen(8000,()=>{
   console.log("backend is running");
});