const mongoose=require("mongoose") ;

const mediaSchema= new mongoose.Schema({
    sendersId:{
        type:String,
        required:true
    },
    message:{
        type:String,
        default:""
    },
    image:{
        type:String,
        default:""
    },
    video:{
        type:String,
        default:""
    },
    doc:{
        type:String,
        default:""
    }

},{timestamps:true});

module.exports=mongoose.model("media",mediaSchema);