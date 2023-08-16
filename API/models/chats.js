const mongoose=require("mongoose") ;

const chatSchema= new mongoose.Schema({
    conversationId:{
        type:String
    },
    senderId:{
        type:String
    },
    messages:{
        type:String
    },
    media:{
        type:String,
    },
    isRead:{
        type:Boolean,
        default:false  
    }
},{timestamps:true});

module.exports=mongoose.model("chats",chatSchema);