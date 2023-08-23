import { Done, DoneAll} from '@mui/icons-material'
import  './Chats.css'
import React ,{Component, useContext, useState}from 'react';
import { Context } from '../../contextAPI/context';
import {format} from "timeago.js"

export default function Chats ({own,friend,messageObj}) {
  const message=messageObj;
  const {user}=useContext(Context)
  const [friends,setFriends]=useState(null)
  const getChatProfile=(userPic)=>{
     if (userPic) {
      return `${process.env.REACT_APP_PUBLIC_FOLDER}${userPic}`;
     }
     return"/assets/noAvatar2.webp";
  }
  const timeToLocal=(message)=>{
    let messageTime=message?.createdAt
    const date=new Date(messageTime);
    let hours=date.getHours();
    let minutes=date.getMinutes();
    let localTime=hours<=24&&hours>=12?"pm":"am";
    let toTwelveSystem=hours<=24&&hours>12?hours-12:hours;
    return `${toTwelveSystem}:${minutes<10?"0"+minutes:minutes} ${localTime}`
  }
  return (
    <div className={own ? 'chatsContainer own' : 'chatsContainer '} >
     <div className="chatsWrapper">
      <div className="chatsMain">
       <img src={own ? getChatProfile(user?.profilePic) :getChatProfile(friend?.profilePic)} alt="" className="profilePic" />  
       
      </div>
      <div className="chatsWrapperContent">
        {message.media&&<img src={`${process.env.REACT_APP_PUBLIC_FOLDER}${message?.media}`} alt={message?.media} style={{objectFit:"cover",padding:"10px"}} width="250px" height="250px" loading='lazy'/>}
      <p className="actualtext">{message.messages}</p>
       <div className="bottomchatsWrapper">
        {message.isRead?
        <DoneAll className="bottomwrapperIcon" style={{fontSize:"medium",color:"#42a1db",display:own ? "block" : "none"}}/>
        :
        <Done className="bottomwrapperIcon" style={{fontSize:"medium",color:"var(--seenMessages)",display:own ? "block" : "none"}}/>
        }
        <span className="timeSent">{message.createdAt?timeToLocal(message):"11:34 AM"}</span> 
       </div>
      </div>
      </div>
     </div>
  )
}
