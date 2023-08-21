const router=require("express").Router();
const { Promise } = require("mongoose");
const Chat=require("../models/chats");


//add message
router.post("/",async(req,res)=>{
    const newChat=new Chat(req.body);
    try {
     const saveMessage=await newChat.save();
     res.status(201).json(saveMessage)
    } catch (err) {
        res.status(500).json(err);
    }

})
//get messages
router.get("/:convId",async(req,res)=>{
    try {
        const allMessages=await Chat.find({conversationId:req.params.convId});
        res.status(200).json(allMessages);
    } catch (err) {
        res.status(500).json(err);
    }
})
//get last message
router.get("/lastMessage/:convId",async(req,res)=>{
    try {
        const allMessages=await Chat.find({conversationId:req.params.convId});
        const messageLength=allMessages.length-1;
        const lastMessage=allMessages[messageLength]
        res.status(200).json(lastMessage);
    } catch (err) {
        res.status(500).json(err);
    }
})
//get number of unread message
router.get("/unReadMessages/:convId",async(req,res)=>{
    try {
        const allMessages=await Chat.find({conversationId:req.params.convId});
        const unReadMessages=allMessages.filter((message)=>message.isRead!=true)
         const friendsUnReadMessages=unReadMessages.filter((message)=>message.senderId===req.query.friendsId).length
        res.status(200).json(friendsUnReadMessages);
    } catch (err) {
        res.status(500).json(err);
    }
})
//update unread message to read
router.put("/toReadMessages/:convId",async(req,res)=>{
    try {
        const allMessages=await Chat.find({conversationId:req.params.convId});
        allMessages.map(async(message)=>
         await message.updateOne({isRead:true})
        )
        res.status(200).json("updated Successfully");
    } catch (err) {
        res.status(500).json(err);
    }
})
//update user
router.put("/toReadMessages/:Id",async(req,res)=>{
    try {
        const allMessages=await User.find({conversationId:req.params.Id});
        allMessages.map(async(message)=>
         await message.updateOne({isRead:true})
        )
        res.status(200).json("updated Successfully");
    } catch (err) {
        res.status(500).json(err);
    }
})
module.exports=router;