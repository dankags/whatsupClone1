const mongoose=require("mongoose") ;

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        max:15
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phonenumber:{
        type:String,
        max:10,
        required:true
    },
    backImg:{
        type:String,
        default:""
    },
    userdesc:{
        type:String,
        default:""
    },
    friends:{
        type:Array,
        default:[]
    },
    profilePic:{
        type:String,
        default:""
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

module.exports=mongoose.model("user",userSchema);