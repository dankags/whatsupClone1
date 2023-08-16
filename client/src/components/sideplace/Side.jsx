/* eslint-disable no-unused-vars */
import './Side.css'
import Topbar from '../topbar/Topbar'
import Message from '../message/Message'
import  Person from '../personstaus/Person'
import {Lock} from "@mui/icons-material"
import Calls from '../personCalls/Calls'
import React ,{Component,useContext,useState,useRef,useEffect}from 'react';
import { Context, LanguageContext } from '../../contextAPI/context'
import axios from 'axios'
import {io} from 'socket.io-client'


export default function Side(props) {
  const {user}=useContext(Context);
  const [conversations,setConversations] =useState([]);
  const {setLanguage,setSocket}=useContext(LanguageContext)
  const socket=useRef();
  const {language:conversation}=useContext(LanguageContext);
  const [onlineFriends,setOnlineFriends]=useState(null);
  const [arrivalmessage,setArrivalMessage]=useState(null)
  const [myOwnWrittenMess,setOwnWrittenMess]=useState(null) 
  const [inCommingMessage,setInCommingMessage]=useState(null)

  useEffect(()=>{
    socket.current=io("ws://localhost:7000");
    // setSocket(socket)
    socket.current?.on("getMessage",data=>{
      setInCommingMessage({
        senderId:data.senderId,
        messages:data.textmessage,
        createdAt: Date.now()
       })
       console.log(data);
    })
    socket?.current.on("getOwnMessage",data=>{
      setOwnWrittenMess({
        senderId:data.senderId,
        messages:data.textmessage,
        createdAt: Date.now()
       })
       console.log(data);
    })
  },[])
  console.log(inCommingMessage);
  console.log(myOwnWrittenMess);
  console.log(socket);

  // useEffect(()=>{
  //   console.log(socket);
  //   // socket.current=io("ws://localhost:7000");
  //   socket?.current.on("getMessage",data=>{
  //     setInCommingMessage({
  //       senderId:data.senderId,
  //       messages:data.textmessage,
  //       createdAt: Date.now()
  //      })
  //      console.log(data);
  //   })
  // },[])   
// console.log(arrivalmessage);
// console.log(myOwnWrittenMess);
 

// useEffect(()=>{
//   setMessage(arrivalmessage)
  
// },[arrivalmessage])

useEffect(()=>{
  socket?.current.emit("newUser",user._id);
  socket?.current.on("getUsers",users=>{
    console.log(users);
    setOnlineFriends(users);
    console.log(onlineFriends);
    // setOnlineFriends(users)
  })
},[user])
console.log(onlineFriends);

  useEffect(()=>{
    const fetchFriendsConv=async()=>{
      try {
        const res= await axios.get("/api/conversations/"+user._id);
        setConversations(res.data)
      } catch (error) {
        console.log(error);
      }
    }
    fetchFriendsConv();
  },[user._id])
  
  const display=(chat,status,calls)=>{
    if (chat) {
      return(
        <div className="chatpagecontainer">
       <div className="chatpagelist">
        {conversations.map((person)=>
          <div onClick={()=>setLanguage(person)} key={person._id}>
            {/* check this place if there is error */}
          <Message conversation={person} currentUser={user} onlineUsers={onlineFriends} message={inCommingMessage} ownMessage={myOwnWrittenMess}/>
          </div>
          )
          }
       </div>
       <div className="chatpageFooter">
        <p className="footerdescription">
          <span className='appName'>Whats up </span>made by Daniel kirungu
             <br/>
        <span className="footerdescription copyright">
          @ copy right
        </span>
        </p>
      
       </div>
       </div>
    )
    } else if(status){
      return(
        
        <div className="StatusContainer">
        <div className="ownerStatus">
          <div className="profilepic">
            <img src="/assets/crow.jpg" alt="" className="ownerPic" />
            <span className="ownerBadge">
                 <svg className="ownerBadgeIcon" xmlns="http://www.w3.org/2000/svg" height="15px" width="15px" fill="currentColor" viewBox="0 0 24 24" stroke-width="3.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                 </svg>
            </span>
          </div>
          <div className="ownrStatsRight">
            <span className="righttopInfo">My status</span>
            <span className="Rightbottomdesc">Tap to add status update</span>
          </div>
        </div>
        <div className="recentUpdates">
          <span className="statusUpdates">Recent updates</span>
        </div>

        <ul className="statuspageList">
         <Person/>
         <Person/>
         <Person/>
        </ul>

         <div className="recentUpdates">
          <span className="statusUpdates">Viewed updates</span>
        </div>
         <ul className="statuspageList">
         <Person viewed/>
         <Person viewed/>
         <Person viewed/>
        </ul>
        <hr/>
        <div className="statusFooter">
         <p className='footerDesc'>
          <Lock className="footericon"/>  Your status updates are<span className="footermessage"> end-to-end encrypted</span>
        </p> 
        </div>
      </div>
      )
      } else if(calls){
        return(
          <div className='callContainer'>
            <div className="callLink">
              <div className="linkImg">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 27 25" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" className='callLink'>
               <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
               </svg>
              </div>
              <div className="linkDesc">
                <span className="Desc">Create call link</span>
                <span className="Desc info">Share a link for your WhatsApp call</span>
              </div>
            </div>
            <div className="recentUpdates">
             <span className="callsUpdates">Recent</span>
           </div>
           <div className="callspageList">
           <Calls/>
           <Calls/>
           <Calls/>
           <Calls/>
           <Calls/>
           <Calls/>
           <Calls/>
           <Calls/>
           <Calls/>
           <Calls/>
           <Calls/>
           <Calls/>
           </div>
           <hr/>
           <div className="statusFooter">
            <p className='footerDesc'>
             <Lock className="footericon"/> Your personal calls are<span className="footermessage"> end-to-end encrypted</span>
            </p> 
           </div> 
         </div>
        )
    }
    
  }

    return (
    <div className='sidecontainer'>
      <Topbar/>
      <div className="sidebarwrapper">
        {display(props.chat,props.status,props.calls)}
      </div>
    </div>
  )
}
