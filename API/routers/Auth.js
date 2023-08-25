const router=require("express").Router();
const User=require("../models/user");
const bcrypt=require("bcrypt");
const CryptoJS=require("crypto-js")
const jwt =require("jsonwebtoken");
const verify = require("../verifyToken");
const {v4:uuidv4}=require("uuid")
//register
router.post("/register",async(req,res)=>{
  
  try {
    const newUser=new User({
      _id:uuidv4(),
      username:req.body.username,
      email:req.body.email,
      password:CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString(),
      phonenumber:req.body.phonenumber
  });
    const user=await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json(err);
 }
});
//login 
router.post("/login",async(req,res)=>{
  const user=await User.findOne({email:req.body.email});
  try {
  if(user){
    try {

      const bytes=CryptoJS.AES.decrypt(user.password,process.env.SECRET_KEY);
      const originalPassword=bytes.toString(CryptoJS.enc.Utf8)
  
      if(originalPassword !== req.body.password){
        res.status(401).json("wrong password or email");
      }else{
        const accessToken=jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.TOKEN_SECRET_KEY,{expiresIn:"1d"})
      const {password,updatedAt,createdAt,...other}=user._doc;
      res.status(200).json({...other,accessToken});
    }
    } catch (err) {
      res.status(500).json(err);
    }
  }else{
  !user&&res.status(401).json("wrong password or email");
}
} catch (error) {
  res.status(500).json(error)
}
});
//update user info in database
router.put("/user/profile/:id",verify,async(req,res)=>{
  if (req.user.id===req.params.id) {
    
    try {
      const userId=req.params.userId;
      const friendInfo=await User.findOne({_id:req.params.id});
      const apdateAbout=await friendInfo.updateOne({userdesc:req.body.about})
      const updateUser=await friendInfo.updateOne({username:req.body.name})
      res.status(200).json("updated successfully");
      
    } catch (err) {
      res.status(404).json(err);
    }
  }else{
    res.status(403).json("You can update olny your account")
  }
  });
//update password
router.put("/user/password/:id",verify,async(req,res)=>{
  if(req.user.id===req.params.id){
  try {
      const userId=req.params.userId;
       const friendInfo=await User.findOne({_id:req.params.id});
       await friendInfo.updateOne({password:CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString()})
      res.status(200).json("updated successfully");
    
  } catch (err) {
      res.status(404).json(err);
  }
}else{
  res.status(403).json("You can change your password only")
}
});
module.exports=router;