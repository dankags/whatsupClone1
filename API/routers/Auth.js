const router=require("express").Router();
const User=require("../models/user");
const bcrypt=require("bcrypt");

//register
router.post("/register",async(req,res)=>{
  try {
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(req.body.password,salt);
    const newUser=new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword,
        phonenumber:req.body.phonenumber
    });
    const user=await newUser.save();
    res.status(200).json("regestration successful!");
  } catch (err) {
    res.status(400).json(err);
  }
});
//login 
router.post("/login",async(req,res)=>{
  try {
    const user=await User.findOne({email:req.body.email});
    !user&&res.status(404).json("user not found");
    const validatePassword=await bcrypt.compare(req.body.password,user.password);
    !validatePassword&&res.status(400).json("wrong password");
    const {password,updatedAt,createdAt,...other}=user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
})
//update user info in database
router.put("/user/profile/:id",async(req,res)=>{
  try {
      const userId=req.params.userId;
       const friendInfo=await User.findOne({_id:req.params.id});
       const apdateAbout=await friendInfo.updateOne({userdesc:req.body.about})
        const updateUser=await friendInfo.updateOne({username:req.body.name})
      res.status(200).json("updated successfully");
    
  } catch (err) {
      res.status(404).json(err);
  }
});
module.exports=router;