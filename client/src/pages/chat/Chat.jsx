// import Main from '../../components/mainplace/Main'
// import Side from '../../components/sideplace/Side'
import './Chat.css'
import Chats from '../../components/userchats/Chats';
import { CallOutlined,VideocamOutlined,MoreVert,SendOutlined,EmojiEmotionsOutlined,AttachFileOutlined } from '@mui/icons-material';
import axios,{AxiosError} from 'axios';
import React ,{Component, useContext, useEffect,useRef, useState}from 'react';
import {io} from 'socket.io-client'
import { Link } from 'react-router-dom';
import Message from '../../components/message/Message';
import { Context, LanguageContext } from '../../contextAPI/context';
import { Layout } from '../../components/layout/Layout';
import Topbar from '../../components/topbar/Topbar';


export default function Chat(user) {
  const socket=useRef(); 
  const {setSocket}=useContext(LanguageContext)
  const {user:User}=useContext(Context)
  const [inCommingMessage,setInCommingMessage]=useState(null)
  const [onlineFriends,setOnlineFriends]=useState(null);
  const [currentConversation,setCurrentCoversation]=useState(null)
  const [conversations,setConversations]=useState(null);
  const [userFriend,setUserFriend]=useState(null);
  const [messages,setMessages]=useState(null);
  const [changedProfileId,setChangedProfileId]=useState(null);
  const senderMessage=useRef();
  const scrollRef=useRef();
  const [chatIsOnline,setChatIsOnline]=useState(null);
  const [myOwnWrittenMess,setOwnWrittenMess]=useState(null);
  const [receiver,setReceiverId]=useState(null);
  const [isLoading,setIsLoading]=useState(true)
  const [openedConv,setOpenedConv]=useState(false);
  const [prevConv,setPrevConv]=useState(null);
  const [refetchConv,setRefetchConv]=useState(false)

  //initialize socket and waits for conversation to be fetched for 3 secs
useEffect(()=>{
  setTimeout(()=>{
    // socket.current=io("ws://localhost:7000");
    // setSocket(socket);
   
  // setConversations(fetchFriendsConv(User))
  setIsLoading(false)
  },3000)
  socket.current=io("ws://localhost:7000");
  setSocket(socket.current)
  socket.current.on("getMessage",data=>{
    setInCommingMessage({
      senderId:data.senderId,
      messages:data.textmessage,
      createdAt: Date.now()
     }
    )
  })
  socket.current.on("getOpenedConv",data=>{
    setOpenedConv(data.condition)
  })
  socket.current.on("userChangedProfile",data=>{
     setChangedProfileId(data)
    
  })
},[])

//get online users from socket server
useEffect(()=>{
  socket?.current.emit("newUser",User._id);
  socket?.current.on("getUsers",users=>{
    setOnlineFriends(users);
    // setOnlineFriends(users)
  })
},[User])

// check if user is online in the currentConversation
useEffect(()=>{
  
  let currentConvFriend=currentConversation?.members.find((member)=>member!==User._id);
  onlineFriends?.some((friend)=>friend.newUserId===currentConvFriend)?setChatIsOnline("Online"):setChatIsOnline("Offline");
},[currentConversation,onlineFriends])

//fetch conversations
useEffect(()=>{
  const fetchFriendsConv=async()=>{
    try {
      const res= await axios.get("/api/conversations/"+User._id);
      setConversations(res.data)
    } catch (error) {
      console.log(error);
    }
  }
  fetchFriendsConv(User);
},[User._id])

//fetch messages from a database and notify the convesation users that you opened this conversation
//thats if the user is in online in order to register that messages are read by using blue tick
useEffect(()=>{ 
  socket?.current.emit("sendOpenedConv",{
    senderId:user._id,
    receiverId:currentConversation?.members.find(m=>m!==User._id),
    condition:true,
  })
  socket?.current.emit("sendOpenedConv",{
    senderId:user._id,
    receiverId:prevConv?.members.find(m=>m!==User._id),
    condition:false,
  })
  const updateUnReadMess=async()=>{
    try {
      const res=await axios.put("/api/message/toReadMessages/"+currentConversation?._id);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchMessages=async()=>{
    try {
       
      const res=await axios.get("/api/message/"+currentConversation?._id);
      setMessages(res.data)
      
    } catch (error) {
      console.log(error);
    }
  }
  updateUnReadMess()
  fetchMessages()
  setPrevConv(currentConversation)
  },[currentConversation])

// update currecnt opened conversation and updates the grey ticks into blue ticks 
useEffect(()=>{
  const updateUnReadMess=async()=>{
    try {
      const res=await axios.put("/api/message/toReadMessages/"+currentConversation?._id);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchMessages=async()=>{
    try {
       
      const res=await axios.get("/api/message/"+currentConversation?._id);
      setMessages(res.data)
      
    } catch (error) {
      console.log(error);
    }
  }
  if (openedConv) {
    updateUnReadMess()
  fetchMessages()
  }
},[openedConv])

  //scroll into view or to the last message
  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior:"smooth"});
  },[messages])

  //fetch user friend information
  useEffect(()=>{
   let friendId=currentConversation?currentConversation.members.find(m=>m!==User._id):null;
    // setInitialState(true)
    const fetchFriend=async(friendId)=>{
      try { 
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const res= await axios.get("/api/chat/friends/profile/"+friendId);
        setUserFriend(res.data);
      } catch (error) {
        if (error===AxiosError) {
          console.log(AxiosError.ERR_BAD_REQUEST);
        }
      }
    }
    fetchFriend(friendId);
  },[currentConversation])

//update messages or adds incomming message from socket to the conversation message array=>(messages,set message)
//refresh conversations whenenever there is a new user texting you throughe message from socket
useEffect(() => {
  inCommingMessage&&currentConversation?.members.includes(inCommingMessage.senderId)&&setMessages(prev=>[...prev,inCommingMessage])
  setReceiverId(User._id)
  conversations?.map((element)=>
  element.members.includes(inCommingMessage.senderId)&& setRefetchConv(true)
)
const fetchFriendsConv=async()=>{
  try {
    const res= await axios.get("/api/conversations/"+User._id);
    setConversations(res.data)
    setRefetchConv(false)
  } catch (error) {
    console.log(error);
  }
}
  refetchConv&&fetchFriendsConv()
}, [inCommingMessage])

//refresh conversations whenenever there is a new user texting you throughe message from socket


//upload new message to database and sends the new message to the other user in the conversation via socket
const handleSubmit=async(e)=>{
  e.preventDefault();
  const currentMessage={
    conversationId:currentConversation._id,
    senderId:User._id,
    messages:senderMessage.current.value,
    isRead:openedConv
  }
  setOwnWrittenMess({
    senderId:User._id,
    messages:senderMessage.current.value,
    createdAt: Date.now(),
  })
  const receiverId=currentConversation.members.find(member=>member!==User._id);
  setOwnWrittenMess({
    senderId:receiverId,
    messages:senderMessage.current.value,
    createdAt: Date.now(),
  })
  setReceiverId(receiverId);
  console.log(receiverId)
  //send message to socket Server
  if(onlineFriends.some((member)=>member.newUserId===receiverId)){
    socket.current.emit("sendMessage",{
    senderId:User._id,
    receiverId:receiverId,
    textmessage:senderMessage.current.value
  });
}
  // socket.current.emit("sendOwnMessage",{
  //   senderId:User._id,
  //   receiverId:receiverId,
  //   textmessage:senderMessage.current.value
  // });
  senderMessage.current.value="";
  //save the message in the dataBase
  try {
    const res=await axios.post("/api/message",currentMessage);
    setMessages([...messages,res.data])
  } catch (error) {
    console.log(error);
  }
}


  return (
    <div>
    {isLoading?
    // layout first
     <Layout/>
      //else main statement
      :
      
      <div className='chatcontainer'>
        {/* sidePlace rendering */}
     <div className="conversationContainer">   
      <Topbar/>
    <div className="chatpagecontainer">
    <div className="chatpagelist">
      <div className="conversationWrapper">
     {conversations.map((person)=>
       <div onClick={()=>setCurrentCoversation(person)} key={person._id}>
         {/* check this place if there is error */}
       <Message changedProfile={person.members.includes(changedProfileId)?true:false} currentConv={currentConversation} conversation={person} currentUser={User} onlineUsers={onlineFriends} message={person.members.some(m=>inCommingMessage?.senderId===m)?inCommingMessage:null} ownMessage={myOwnWrittenMess} receiverId={receiver}  />
       </div>
       )
       }
       </div>
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
    </div>
    {currentConversation?
   
      <div className="chatmainContainer">
            <div className="chatsTopbarContainer">
              
              <div className="topbarLeft">
               {/* <ArrowBack className="TopbarIcon"/> */}
               <div>
               <Link to={`/profile/${userFriend?._id}`} style={{textDecoration:"none"}}>
                <img src={userFriend?.profilePic?`/assets/${userFriend.profilePic}`:"/assets/noAvatar2.webp"} alt="" className="chatsProfile" height="40px" width="40px"/>
                </Link>
                </div>
                <div className="chatsCredentials">
                 <span className="chatsName">{userFriend?.username}</span>
                 <span className="chatsLastseen">{chatIsOnline}</span>
                </div>
              </div>
                
              <div className="topbarRight">
               <div className="topRightIcons">
                <span title="call"><CallOutlined className="RightIcons"/></span> 
                <span title="videoCall"><VideocamOutlined className="RightIcons" style={{fontSize:"30px"}}/></span>
               <hr className='topRightLine'/>
               <span title="settings"><MoreVert title="settings" className="RightIcons"  style={{fontSize:"30px"}}/></span>
               </div>
                 
              </div>
            </div>
            <div className="messageContainer">
            <div  >
             {
             messages.map((info)=>
             
                  <div ref={scrollRef}>
                   <Chats friend={userFriend} messageObj={info} own={User._id===info?.senderId} key={info?._id} />
                </div>
             )
             
           }
           </div>
            </div>
            <div className="messageinputContainer">
             <div className="inputContainer">
               <div className="emojisContainer">
                <span title="emojies"><EmojiEmotionsOutlined className="messageinputIcon"/></span>
                <label htmlFor="sendFile"> 
                 <span title="shareFile"><AttachFileOutlined className="messageinputIcon" style={{transform:"rotate(214deg)"}}/></span> 
                 <input style={{display:"none"}} type="file" name="" id="sendFile" />
                 </label> 
              </div>
               <input type="text" cols="50" rows="5" name='' placeholder='Type a message' className="textarea" ref={senderMessage} />
               <div className="shareCameraIcons">
               
                {/* <CameraAlt className="messageinputIcon"/> */}
               </div>
             </div>
             <div className="sendbuttonCntainer">
               <button onClick={handleSubmit} className="submit" title="send">
                 <SendOutlined className="messageinputIcon"/>
               </button>
             </div>
            </div>
          </div>
    
    // else statement after there is no current conversation
    :
    
    <div className='defaultChatPage'>
      <span>  
       Open a conversation to start chating
      </span>
    </div>
  }
    </div>
   
  }
</div>

  )
}
