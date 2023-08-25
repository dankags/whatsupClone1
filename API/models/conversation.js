const mongoose=require("mongoose") ;

const conversationSchema=new mongoose.Schema({
    _id:{
        type:String,
        default:""
    },
    members:{
        type:Array,
    },
    
},{timestamps:true});
module.exports=mongoose.model("conversation",conversationSchema);