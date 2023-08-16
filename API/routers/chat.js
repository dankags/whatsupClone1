const router=require("express").Router();
const Chat=require("../models/chats");
const User=require("../models/user")
const Conversation = require('../models/conversation');
const Media = require("../models/media");

//get all user friends 
router.get("/friends/:userId",async(req,res)=>{
    try {
        const user=await User.findById({_id:req.params.userId});
        const followedFriends=[];
        const groupFriends=user.friends.map(person=>{return person});
       for (let friend of groupFriends) {
         let person=await User.findById(friend);
         const {password,updatedAt,friends,createdAt,...other}=person._doc;
         followedFriends.push(other);
       }
       res.status(200).json(followedFriends);
        
    } catch (err) {
        res.status(404).json(err);
    }
})
//fetch all users
router.get("/allUsers",async(req,res)=>{
    try {
        const users=await User.find();
        let usersSentSchema=[]
        users.forEach((user)=>{
          const {password,friends,userdesc,backImg,phonenumber,email,isAdmin,updatedAt,createdAt,...others}=user._doc;
          usersSentSchema.push(others)
        })
       res.status(200).json(usersSentSchema);
        
    } catch (err) {
        res.status(404).json(err);
    }
})
//get friends profile
router.get("/friends/profile/:id",async(req,res)=>{
    try {
        const userId=req.params.userId;
         const friendInfo=await User.findOne({_id:req.params.id});
        const{password,updatedAt,createdAt,...other}=friendInfo._doc;
        res.status(200).json(other);
      
    } catch (err) {
        res.status(404).json(err);
    }
});

module.exports=router;