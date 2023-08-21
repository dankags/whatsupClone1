const io=require("socket.io")(7000,{
    cors:{
        origin:"http://localhost:3000"
    }
})

let users=[];
const removeUser=(socketId)=>{
    users=users.filter((user)=>user.socketId !== socketId);
}
const addUser=(socketId,newUserId)=>{
    !users.some((user)=>user.newUserId===newUserId)&&users.push({socketId,newUserId})
}
const getUser=(userId)=>{
    return users.find((user)=>user.newUserId===userId)
}

io.on("connection",(socket)=>{

   socket.on("newUser",(userId)=>{
    addUser(socket.id,userId);
    io.emit("getUsers",users);
    // console.log(users);
   })
    socket.on("sendMessage",({senderId,receiverId,textmessage})=>{
        
        const receiver=getUser(receiverId);
        
        // const sender=users.find((user)=>user.newUserId===senderId);
        // console.log(sender);
        // console.log(receiver);
        // console.log(textmessage);
        io.to(receiver.socketId).emit("getMessage",{
         senderId,
         textmessage,
        });
    })
    socket.on("sendOpenedConv",({senderId,receiverId,condition})=>{
        const receiver=getUser(receiverId);
        io.to(receiver?.socketId).emit("getOpenedConv",{
            senderId,
            condition,
           });
        //    console.log(sender);   
    })
    socket.on("changedProfile",({userChangerId,userImage})=>{
       
        io.emit("userChangedProfile",{userChangerId,userImage});
    })
   socket.on("disconnect",()=>{
    removeUser(socket.id);
    io.emit("getUsers",users)
   })

})

