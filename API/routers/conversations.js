const router=require("express").Router();
const Conversation = require('../models/conversation');
const User=require("../models/user");
const verify = require("../verifyToken");

// create new friends conversation 
router.post("/",verify,async(req,res)=>{
  if(req.user.id===req.body.senderId){
  const user= await User.findOne({phonenumber:req.body.phonenumber})
  !user&&res.status(404).json("user doesnot exist")
  const conversations=await Conversation.find({
    members:{$in:[req.body.senderId]}
  });

  let checkConversationExist=await conversations.some(item=>item.members.includes(user._id))
  if (checkConversationExist===false) {
  const newConversation=new Conversation({
    members:[ req.body.senderId,
     user._id
    ]
  });
  try {  
    const saveNewConv=await newConversation.save();
    res.status(200).json(saveNewConv);
  } catch (err) {
   res.status(500).json(err);
  }
}else{
  res.status(403).json("conversation already exists")
}
}else{
  res.status(403).json("you can create only your own conversations")
}
 });
 //get user conv
 router.get("/:userId",verify,async(req,res)=>{
  if(req.user.id===req.params.userId){
   try {
    const conversation=await Conversation.find({
        members:{$in:[req.params.userId]}
    });
    res.status(200).json(conversation);
   } catch (err) {
    res.status(500).json(err);
   }
  }else{
    res.status(403).json("you can fetch only your conversations")
  }
 })


module.exports=router;