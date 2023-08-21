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
//add as friend
router.put("/addFriend/:id",async(req,res)=>{
    if (req.params.id!==req.query.friendId) {
        try {
            const user=await User.findById(req.params.id);
            const newFriend=await User.findById(req.query.friendId)
          if (!user.friends.includes(req.query.friendId)||!newFriend.friends.includes(req.params.id)) {
            await user.updateOne({$push:{friends:req.query.friendId}})
            await newFriend.updateOne({$push:{friends:req.params.id}})
            res.status(200).json("friend added successfully")
          } else {
            res.status(403).json("user already your fiend")
          }
        } catch (err) {
            res.status(404).json(err);
        }
    } else {
        res.status(403).json("you cannot be your own friend")
    }
    
});
//update background Image
router.put("/updateBackground/:id",async(req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        await user.updateOne({backImg:req.body.filename})
        res.status(200).json("updated background Successfully");
    } catch (err) {
        res.status(500).json(err);
    }
  })
   //update user profile
 router.put("/updateProfile/:id",async(req,res)=>{
    try {
        const user=await User.findById(req.params.id);
       await user.updateOne({profilePic:req.body.filename})
        res.status(200).json("updated profile Successfully");
    } catch (err) {
        res.status(500).json(err);
    }
  });
module.exports=router;