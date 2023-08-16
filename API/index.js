const express = require("express");
const app=express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer=require("multer")
const chatRoute=require("./routers/chat");
const authRouter=require("./routers/Auth");
const conversationRouter=require("./routers/conversations");
const messageRouter=require("./routers/message");

dotenv.config();
mongoose.connect(process.env.MONGO_URL,()=>{
    console.log("connected to MongoDB");
});
mongoose.set('strictQuery', false);

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
        cb(null,file.originalname)
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