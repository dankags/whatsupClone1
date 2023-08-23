const jwt=require("jsonwebtoken")

function verify(req,res,next) {
 const authorizedToken=req.headers.token
 if (authorizedToken) {
    const token=authorizedToken.split(" ")[1]

    jwt.verify(token,process.env.TOKEN_SECRET_KEY,(err,userInfo)=>{
        if(err)res.status(403).json("token not valid")
        req.user=userInfo;
    next();
    })
 }else{
    return res.status(401).json("you are not autheticated")
 }   

}

module.exports=verify;