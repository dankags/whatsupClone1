import axios from 'axios';
import './Message.css'
// import {format} from "timeago.js"
// eslint-disable-next-line no-unused-vars
import React ,{Component, useEffect, useState,useRef}from 'react';
// import {io} from 'socket.io-client'

const timeToLocal=(message)=>{
  let messageTime=message?.createdAt
  const date=new Date(messageTime);
  let hours=date.getHours();
  let minutes=date.getMinutes();
  let localTime=hours<=24&&hours>=12?"pm":"am";
  let toTwelveSystem=hours<=24&&hours>12?hours-12:hours;
  return `${toTwelveSystem}:${minutes<10?"0"+minutes:minutes} ${localTime}`
}
export default function Message({changedProfile,currentConv,currentUser,conversation,onlineUsers,message,ownMessage,receiverId}) {
  
  const [updateProfile,setUpdateProfile]=useState(false)
  const [userFriend,setuserFriend]=useState({})
  const [isOnline,setIsOnline]=useState(false);
  const [noNewMess,setNoNewMess]=useState(0)
  const [lastMess,setLastMess]=useState({});
  const userFriendId=useRef({
    id:null
  });
  const ownMessageId=useRef({
    id:null
  });
  const [checkChat,setUserChat]=useState(false);
 
  //fetch conversation friends profile
 useEffect(()=>{
  const fetchLastMessage=async()=>{
    try {
      const res=await axios("/api/message/lastMessage/"+conversation?._id);
      setLastMess(res.data)
    } catch (error) {
      console.log(error);
    }
 }
 fetchLastMessage()
 },[])

 useEffect(()=>{
  setUpdateProfile(changedProfile)
  const friendId=conversation.members.find(m=>m!==currentUser._id);
  userFriendId.current.id=friendId;
  // !onlineUsers.some((user)=>user.newUserId===friendId)&&setIsOnline(true);
  const fetchFriend=async()=>{
    try {
      const res= await axios.get("/api/chat/friends/profile/"+friendId);
      setuserFriend(res.data)
    } catch (error) {
      console.log(error);
    }
  }
  updateProfile&&fetchFriend();
 
 },[changedProfile])

 useEffect(()=>{
  conversation?._id===currentConv?._id&&setNoNewMess(0)
 },[currentConv])

 useEffect(()=>{
   const fetchUnReadMess=async()=>{
    const friendId=conversation.members.find(m=>m!==currentUser._id);
     try {
      const res=await axios(`/api/message/unReadMessages/${conversation._id}?friendsId=${friendId}`)
      setNoNewMess(res.data);
     } catch (error) {
      console.log(error);
     }
   }
   fetchUnReadMess() 
 },[message])
  
 useEffect(()=>{
  checkChat?setUserChat(!checkChat):setUserChat(!checkChat)
},[message])

 useEffect(()=>{
  const friendId=conversation.members.find(m=>m!==currentUser._id);
  userFriendId.current.id=friendId;
  // !onlineUsers.some((user)=>user.newUserId===friendId)&&setIsOnline(true);
  const fetchFriend=async()=>{
    try {
      const res= await axios.get("/api/chat/friends/profile/"+friendId);
      setuserFriend(res.data)
    } catch (error) {
      console.log(error);
    }
  }
  fetchFriend();
},[currentUser])

//new message counter and fetch last message of conversation
useEffect(()=>{
 message===null?setNoNewMess(0):setNoNewMess((prev)=>prev++)
 const fetchLastMessage=async()=>{
    try {
      const res=await axios(`/api/message/lastMessage/${conversation._id}`);
      setLastMess(res.data)
    } catch (error) {
      console.log(error);
    }
 }
 fetchLastMessage()
},[ownMessage,message])
console.log(lastMess);
console.log("incomming mess:"+message);
useEffect(()=>{
  ownMessage?.senderId?ownMessageId.current.id=ownMessage.senderId:ownMessageId.current.id=null;
},[ownMessage])

useEffect(()=>{
  const friendId=conversation.members.find(m=>m!==currentUser._id);
  onlineUsers?.some((user)=>user.newUserId===friendId)?setIsOnline(true):setIsOnline(false)
},[currentUser,onlineUsers])

  return (
    <div className="messageitem">
      <div className="imgInfo"> 
       <img src={userFriend.profilePic?`/assets/${userFriend.profilePic}`:"/assets/noAvatar2.webp"} alt="chats profile" className="userImg" />
       <span className="onlinebadge" style={isOnline?{display:"block"}:{display:"none"}}></span>
      </div>
        <div className="messagedesc">
            <div className='messagedescTop'>
              <div className="messageNamecontainer">
               <span className="messagedescName">{userFriend.username}</span>
              </div>
            <div className="messageTimeContainer"> 
            {/* receiverId===currentUser._id */}
            {receiverId===currentUser._id?
               <span className="messagedescTime">{message?.senderId===userFriendId.current?.id?timeToLocal(message):timeToLocal(lastMess)}</span>
             :
             <span className="messagedescTime">{ownMessage?.senderId===userFriendId.current?.id?timeToLocal(ownMessage):timeToLocal(lastMess)}</span>
            }
            </div>
           
            </div>
            <div className="messagedescbottom">
              <div className="mainmessagecontainer">
               {receiverId===currentUser._id?
                <span className="mainMessage">{message?.senderId===userFriendId.current?.id?message.messages:lastMess.messages} </span>
               :
               <span className="mainMessage">{ownMessage?.senderId===userFriendId.current?.id?ownMessage.messages:lastMess.messages} </span>
              }
                </div>
                <div className="messagenumbers">
                  {message?.senderId===conversation?.members.find(member=>member===message?.senderId)&&
                  <div className="messagenumbersBadge" style={noNewMess===0?{display:"none"}:{display:"flex"}}>
                    <span className="messagenumber" >{noNewMess}</span>
                  </div>
                  }
                </div>
            </div>
        </div>
            <hr className="messageDescHr" />
    </div>
  )
}
