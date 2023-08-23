// import Main from '../../components/mainplace/Main'
// import Side from '../../components/sideplace/Side'
import './Chat.css'
import Chats from '../../components/userchats/Chats';
import { CallOutlined,VideocamOutlined,MoreVert,SendOutlined,EmojiEmotionsOutlined,AttachFileOutlined, Cancel, InsertComment, Close } from '@mui/icons-material';
import axios,{AxiosError} from 'axios';
import React ,{Component, useContext, useEffect,useMemo,useRef, useState}from 'react';
import {io} from 'socket.io-client'
import { Link } from 'react-router-dom';
import Message from '../../components/message/Message';
import { Context, ThemeContext} from '../../contextAPI/context';
import { Layout } from '../../components/layout/Layout';
import Topbar from '../../components/topbar/Topbar';


export default function Chat(user) {
  const socket=useRef(); 
  const {user:User,dispatch}=useContext(Context)
  const {theme,chatBackImg}=useContext(ThemeContext)
  const [inCommingMessage,setInCommingMessage]=useState(null)
  const [onlineFriends,setOnlineFriends]=useState(null);
  const [currentConversation,setCurrentCoversation]=useState(null)
  const [conversations,setConversations]=useState(null);
  const [userFriend,setUserFriend]=useState(null);
  const [messages,setMessages]=useState(null);
  const [changedProfileId,setChangedProfileId]=useState(null);
  const senderMessage=useRef();
  const scrollRef=useRef();
  const phoneNumber=useRef()
  const [isImage,setIsImage]=useState(false)
  const [file,setFile]=useState(null)
  const [showFile,setShowFile]=useState(false)
  const [imgSrc,setImgSrc]=useState(null)
  const [initialMessIsRead,setInitialMessIsRead]=useState(false)
  const [chatIsOnline,setChatIsOnline]=useState(null);
  const [myOwnWrittenMess,setOwnWrittenMess]=useState(null);
  const [receiver,setReceiverId]=useState(null);
  const [isLoading,setIsLoading]=useState(true)
  const [recentConv,setRecentConv]=useState(null)
  const [openedConv,setOpenedConv]=useState(null);
  const [prevConv,setPrevConv]=useState(null);
  const [refetchConv,setRefetchConv]=useState(false)

  //initialize socket and waits for conversation to be fetched for 3 secs
useEffect(()=>{
   const controller=new AbortController();
   
  const fetchFriendsConv=async()=>{
    try {
      const res= await axios.get("/api/conversations/"+User._id,{headers:{token:"Bearer "+User.accessToken},signal:controller.signal});
      setConversations(res.data)
      if(res.status===200){

        setIsLoading(false)
      }
    } catch (error) {
      console.log(error);
    }
  }
  fetchFriendsConv(User);
  socket.current=io("ws://localhost:7000");
  
  socket.current.on("getMessage",data=>{
    setInCommingMessage({
      senderId:data.senderId,
      media:data.media,
      messages:data.textmessage,
      createdAt: Date.now()
     }
    )
  })
  socket.current.on("getOpenedConv",data=>{
    setOpenedConv(data)
    setInitialMessIsRead(data.condition)
    
  })
  socket.current.on("userChangedProfile",data=>{
    
     setChangedProfileId(data)
    
  })
  return()=>controller.abort()
},[])

//get online users from socket server
useEffect(()=>{
  socket?.current.emit("newUser",User._id);
  socket&&dispatch({type:"INITIALIZE_SOCKET",payload:socket})
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
useMemo(()=>{
  // const fetchFriendsConv=async()=>{
  //   try {
  //     const res= await axios.get("/api/conversations/"+User._id);
  //     setConversations(res.data)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // fetchFriendsConv(User);
},[User._id])

//fetch messages from a database and notify the convesation users that you opened this conversation
//thats if the user is in online in order to register that messages are read by using blue tick
useEffect(()=>{ 
  const controller=new AbortController();
  
  socket?.current.emit("sendOpenedConv",{
    senderId:User._id,
    receiverId:currentConversation?.members.find(m=>m!==User._id),
    condition:true,
  })
  socket?.current.emit("sendOpenedConv",{
    senderId:User._id,
    receiverId:prevConv?.members.find(m=>m!==User._id),
    condition:false,
  })
  
  const updateUnReadMess=async()=>{
    try {
      const res=await axios.put("/api/message/toReadMessages/"+currentConversation?._id,{signal:controller.signal});
    } catch (error) {
      console.log(error);
    }
  }
  const fetchMessages=async()=>{
    try {
       
      const res=await axios.get("/api/message/"+currentConversation?._id,{signal:controller.signal});
      setMessages(res.data)
      
    } catch (error) {
      console.log(error);
    }
  }
  currentConversation?.members.includes(openedConv?.senderId)&&updateUnReadMess()
  fetchMessages()
  setPrevConv(currentConversation)
  return()=>controller.abort();
  },[currentConversation])

// update currecnt opened conversation and updates the grey ticks into blue ticks 
useEffect(()=>{
  const updateUnReadMess=async()=>{
    if (currentConversation?.members.includes(openedConv?.senderId)) {
    try {
      const res=await axios.put("/api/message/toReadMessages/"+currentConversation?._id);
      if(res.status===200){
        openedConv&&setMessages(messages.map(item=>({...item,isRead:true})))
      }
     
    } catch (error) {
      console.log(error);
    }
  }
  }
  if(openedConv?.condition){
   
    setInitialMessIsRead(true)
   currentConversation?.members.includes(openedConv?.senderId)&&updateUnReadMess()
}else{
// setInitialMessIsRead(false)
}
},[openedConv])

  //scroll into view or to the last message
  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior:"smooth"});
  },[messages])

  //fetch user friend information
  useEffect(()=>{
    const controller=new AbortController();
   let friendId=currentConversation?currentConversation.members.find(m=>m!==User._id):null;
    // setInitialState(true)
    const fetchFriend=async(friendId)=>{
      try { 
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const res= await axios.get("/api/chat/friends/profile/"+friendId,{signal:controller.signal});
        setUserFriend(res.data);
      } catch (error) {
        if (error===AxiosError) {
          console.log(AxiosError.ERR_BAD_REQUEST);
        }
      }
    }
    fetchFriend(friendId);
    return()=>controller.abort();
  },[currentConversation])

  useEffect(()=>{
    changedProfileId&&setUserFriend(prev=>({...prev,profilePic:changedProfileId.userImage}))
  },[changedProfileId])

//update messages or adds incomming message from socket to the conversation message array=>(messages,set message)
//refresh conversations whenenever there is a new user texting you throughe message from socket
useEffect(() => {
  let conv=conversations?.find(item=>item.members.find(m=>m===inCommingMessage?.senderId))
  if (inCommingMessage) {
    setRecentConv(conversations.find(item=>item.members.includes(inCommingMessage.senderId)))
 
  let filteredArray= conversations.filter(item=>item!==conv)
  setConversations(filteredArray)
  setConversations(prev=>[conv,...prev])
  }
  inCommingMessage&&currentConversation?.members.includes(inCommingMessage.senderId)&&setMessages(prev=>[...prev,inCommingMessage])
  setReceiverId(User._id)
  inCommingMessage&&conversations?.map((element)=>
  element.members.includes(inCommingMessage.senderId)&& setRefetchConv(true)
)
const fetchFriendsConv=async()=>{
  try {
    const res= await axios.get("/api/conversations/"+User._id,{headers:{token:"Bearer "+User.accessToken}});
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
  let confirm=false
  console.log(file);
  const fileName=Date.now() + file?.name;
  const currentMessage={
    conversationId:currentConversation._id,
    senderId:User._id,
    messages:senderMessage.current.value,
    media:fileName,
    isRead:openedConv?.condition ? currentConversation?.members.includes(openedConv?.senderId):currentConversation?.members.includes(openedConv?.senderId)&&openedConv?.condition===false&&confirm
  }
  console.log(User._id);
  console.log(openedConv?.senderId);
  currentMessage.messages&&setOwnWrittenMess({
    senderId:User._id,
    messages:senderMessage.current.value,
    createdAt: Date.now(),
  })
  const receiverId=currentConversation.members.find(member=>member!==User._id);
  currentMessage.messages&&setOwnWrittenMess({
    senderId:receiverId,
    messages:senderMessage.current.value,
    createdAt: Date.now(),
  })
  let conv=conversations.find(item=>item.members.find(m=>m===receiverId))
 
  setReceiverId(receiverId);
  
  //send message to socket Server
  
  // socket.current.emit("sendOwnMessage",{
  //   senderId:User._id,
  //   receiverId:receiverId,
  //   textmessage:senderMessage.current.value
  // });
  senderMessage.current.value="";
  //save the message in the dataBase
  if(currentMessage.messages || currentMessage.media){
    if (file) {
      const data=new FormData()
      data.append("file",file)
      data.append("name",fileName)
      console.log(data);
      try {
       const res=await axios.post(`/api/upload?name=${fileName}`,data) 
       if(res.status===200){
        setFile(null)
        if(onlineFriends.some((member)=>member.newUserId===receiverId)){
          currentMessage.messages&&socket?.current.emit("sendMessage",{
           senderId:User._id,
           receiverId:receiverId,
           media:fileName,
           textmessage:senderMessage.current.value
         });
       }
       }
      } catch (error) {
          console.log(error);
      }
  }

  try {
    const res=await axios.post("/api/message",currentMessage);
    setMessages([...messages,res.data])
    let filteredConv=conversations.filter(item=>item!==conv)
    if(res.status===201){
    setConversations(filteredConv)
    setConversations(prev=>[conv,...prev])
    const formWrapper=document.querySelector(".messageInputWrapper")
    const messageWrapper=document.querySelector(".messageContainer")
     setShowFile(false)
    formWrapper.style.flex="1.3"
    messageWrapper.style.flex="9.7"
  }
  } catch (error) {
    console.log(error);
  }}
}



const handleShowFile=()=>{
  const formWrapper=document.querySelector(".messageInputWrapper")
  const messageWrapper=document.querySelector(".messageContainer")
  setShowFile(false)
  formWrapper.style.flex="1.3"
  messageWrapper.style.flex="9.7"
  senderMessage.current.value="";
  setIsImage(false)
}

const handleFile=(e)=>{
  let files=e.target.files[0]
  // setFile(prev=>e.target.files[0])
  const formWrapper=document.querySelector(".messageInputWrapper")
  const messageWrapper=document.querySelector(".messageContainer")
  const imgViewer=document.querySelector(".viewFileDiv")
  // imgViewer.removeChild()
  senderMessage.current.value=files?.name;
  
  
  setShowFile(true)
  if (files) {
    formWrapper.style.flex="3"
    messageWrapper.style.flex="8"
    console.log(files); 
    setFile(files)
    
    const url=URL.createObjectURL(files)
    setImgSrc(url)
    console.log(files.type);
    if(files?.type==="image/jpeg"||files?.type==="image/png"||file?.type==="image/jpg"){
      setIsImage(true)
    }else{
      setIsImage(false)
    }

    // imgViewer.appendChild(Image)
  }
}

const handleConversation=()=>{
const conversation=document.querySelector(".createConversationPage")
conversation.style.display="flex"
}
const handleCancel=()=>{
  const conversation=document.querySelector(".createConversationPage")
  conversation.style.display="none"
}
const handleCreateConv=async(e)=>{
  e.preventDefault()
  if(phoneNumber.current.value){
    try {
      const res=await axios.post(`/api/conversations/`,{phonenumber:phoneNumber.current.value,senderId:User._id},{headers:{token:"Bearer "+User.accessToken}});
      if(res.status===200){
        const conversation=document.querySelector(".createConversationPage")
        setConversations(prev=>[res.data,...prev])
        setCurrentCoversation(res.data)
        phoneNumber.current.value=""
        conversation.style.display="none"
      }
    } catch (error) {
      console.log(error);
    }
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
      <main className='createConversationPage' style={{display:"none"}}>
          <form onSubmit={handleCreateConv}>
            <h2>Create Conversation</h2>
            <div className="createConvInput">
            <label htmlFor="">Enter Number</label>
            <input type="number" ref={phoneNumber} name="" id="" placeholder='Enter Number...'/>
            </div>
            <span onClick={handleCancel}><Close className='RightIcons'/></span>
             <button type="submit">create</button>
          </form>
        </main>
    <div className="chatpagecontainer">
    <div className="chatpagelist">
      <div className="conversationWrapper">
     {conversations?.map((person)=>
       <div onClick={()=>setCurrentCoversation(person)} key={person._id}>
         {/* check this place if there is error */}
       <Message changedProfile={person.members.includes(changedProfileId?.userChangerId)?changedProfileId:null} currentConv={currentConversation} conversation={person} currentUser={User} onlineUsers={onlineFriends} message={person.members.some(m=>inCommingMessage?.senderId===m)?inCommingMessage:null} ownMessage={myOwnWrittenMess} receiverId={receiver}  />
       </div>
       )
       }
       {/* <button className='createConversationBtn'><Chat className="createConversationIcon"/></button> */}
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
    <button className='createConversationBtn' title='Create conversation' onClick={handleConversation}><InsertComment className='createConversationIcon'/></button>
    </div>
    {currentConversation?
   
      <div className="chatmainContainer" style={theme==="light"?{backgroundImage:`url(${chatBackImg})`}:{backgroundImage:`url(${chatBackImg})`}}>
            <div className="chatsTopbarContainer">
              
              <div className="topbarLeft">
               {/* <ArrowBack className="TopbarIcon"/> */}
               <div>
               <Link to={`/profile/${userFriend?._id}`} style={{textDecoration:"none"}}>
                <img src={userFriend?.profilePic?`${process.env.REACT_APP_PUBLIC_FOLDER}${userFriend.profilePic}`:"/assets/noAvatar2.webp"} alt="" className="chatsProfile" height="40px" width="40px"/>
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
             messages?.map((info)=>
             
                  <div ref={scrollRef} key={info._id}>
                   <Chats friend={userFriend} messageObj={info} own={User._id===info?.senderId}  />
                </div>
             )
             
           }
           </div>
            </div>
            <form className='messageInputWrapper' onSubmit={handleSubmit}>
              <div className='viewFileDiv'style={showFile?{display:"flex"}:{display:"none"}}>
                <div className="FileInfo">
                {isImage?
                  <img src={imgSrc&&imgSrc} alt="" width="100px" height="100px" style={{objectFit:"cover"}}/>
                :
                  <div className='otherTypeOfFile'>
                    {file?.name}
                  </div>
                }
                <span onClick={handleShowFile}><Cancel className='messageinputIcon'/></span>
                </div>
              </div>
             <div className="messageinputContainer">
             <div className="inputContainer">
               <div className="emojisContainer">
                <span title="emojies"><EmojiEmotionsOutlined className="messageinputIcon"/></span>
                <label htmlFor="sendFile"> 
                 <span title="shareFile"><AttachFileOutlined className="messageinputIcon" style={{transform:"rotate(214deg)"}}/></span> 
                 <input style={{display:"none"}} type="file"  name="" id="sendFile" onChange={handleFile} accept='image/*'/>
                 </label> 
              </div>
               <input type="text" cols="50" rows="5" name='' placeholder='Type a message' className="textarea" ref={senderMessage} />
               <div className="shareCameraIcons">
               
                {/* <CameraAlt className="messageinputIcon"/> */}
               </div>
             </div>
             <div className="sendbuttonCntainer">
               <button type='submit' className="submit" title="send">
                 <SendOutlined className="messageinputIcon"/>
               </button>
             </div>
            </div>
            </form>
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
