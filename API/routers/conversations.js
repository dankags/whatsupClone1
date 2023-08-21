const router=require("express").Router();
const Conversation = require('../models/conversation');
const User=require("../models/user")

// create new friends conversation 
router.post("/",async(req,res)=>{
    const newConversation=new Conversation({
      members:[ req.body.senderId,
       req.body.receiverId
      ]
    });
    try {  
      const saveNewConv=await newConversation.save();
      res.status(200).json(saveNewConv);
    } catch (err) {
     res.status(500).json(err);
    }
 });
 //get user conv
 router.get("/:userId",async(req,res)=>{
   try {
    const conversation=await Conversation.find({
        members:{$in:[req.params.userId]}
    });
    res.status(200).json(conversation);
   } catch (err) {
    res.status(500).json(err);
   }
 })


module.exports=router;