import { MoreVert, EmojiEmotionsOutlined, AttachFileOutlined, CallOutlined, VideocamOutlined, SendOutlined, CleaningServices} from '@mui/icons-material'
import './Main.css'
// eslint-disable-next-line no-unused-vars
import React ,{Component, useContext,useEffect,useRef,useState}from 'react';
import axios, { AxiosError } from 'axios';
import {io} from 'socket.io-client'
import Chats from '../userchats/Chats'
import { Context, LanguageContext } from '../../contextAPI/context';


export default function Main(props) {

  //  const [updateConv,setUpdateConv]=useState({});
  //  const [convId,setConvId]=useState(null);
   const [currentChat,setCurrentChat]=useState(null)
   const [chatIsOnline,setChatIsOnline]=useState(false)
   const getConv=useRef({
    conv:false
  })
  // const socket=useRef();
  const [arrivalmessage,setArrivalMessage]=useState(null)
  const [myOwnWrittenMess,setOwnWrittenMess]=useState(null)
  const [initialState,setInitialState]=useState(false)
   const {user}=useContext(Context);
   const senderMessage=useRef();
   const [userFriend, setUserFriend] = useState({})
   const [Messages, setMessages] = useState([])
   const scrollRef=useRef();
   const {language:conversation,setSocket}=useContext(LanguageContext);
   const socket=props.socket;
   let friendId=null;
  //  console.log(socket);
  // useEffect(()=>{
  //   socket.current=io("ws://localhost:7000");
  //   socket?.current.on("getMessage",(data)=>{
  //     console.log(data);
  //     setInCommingMessage({
  //           senderId:data.senderId,
  //           messages:data.textmessage,
  //           createdAt: Date.now()
  //          })
  //       })
  //     //   socket?.current.on("getWrittenMessage",(data)=>{
  //     //    console.log(data)
  //     //    setOwnWrittenMess(data)
  //     //  })
  // },[])
  useEffect(()=>{
    // socket.current=io("ws://localhost:7000");
    setSocket(socket)
    socket.current?.on("getMessage",data=>{
      setArrivalMessage({
        senderId:data.senderId,
        messages:data.textmessage,
        createdAt: Date.now()
       })
       console.log(data);
    })
    // socket?.current.on("getOwnMessage",data=>{
    //   setOwnWrittenMess({
    //     senderId:data.senderId,
    //     messages:data.textmessage,
    //     createdAt: Date.now()
    //    })
    //    console.log(data);
    // })
  },[])
  
  console.log(arrivalmessage);
  console.log(myOwnWrittenMess);
  console.log(socket);
  console.log(arrivalmessage)
 

  useEffect(() => {
    arrivalmessage&&conversation?.members.includes(arrivalmessage.sender)&&setMessages([...Messages,arrivalmessage])
   
  
  }, [arrivalmessage])
  console.log(Messages);
  
   //add user to socket server
   useEffect(()=>{
    const friendId=conversation?.members.find(m=>m!==user._id);
    socket.current?.emit("newUser",user._id);

    socket.current?.on("getUsers",users=>{
      console.log(users);
      users.some((onlineuser)=>onlineuser.newSenderId===friendId)?setChatIsOnline(true):setChatIsOnline(false)
    })
  },[conversation,user])
  


//fetch friends profile
useEffect(()=>{
    conversation!==null?getConv.current.conv=true:getConv.current.conv=false;
    conversation!==null?setCurrentChat(conversation):setCurrentChat(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    friendId=conversation&&conversation.members.find(m=>m!==user._id);
    setInitialState(true)
    const fetchFriend=async()=>{
      try {
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const res= await axios.get("/api/chat/friends/profile/"+friendId);
        setUserFriend(res.data)
        
       //}
      } catch (error) {
        if (error===AxiosError) {
          console.log(AxiosError.ERR_BAD_REQUEST);
        }
      }
    }
    fetchFriend();
  },[conversation])

//fetch messages from data base
useEffect(()=>{ 
  scrollRef.current?.scrollIntoView({behavior:"smooth"});
  console.log(scrollRef);
    
     const fetchMessages=async()=>{
       try {
       
        const res=await axios.get("/api/message/"+currentChat?._id);
        setMessages(res.data)
        
       } catch (error) {
        console.log(error);
       }
     }
     fetchMessages()
  },[currentChat])

//handle send message button
const handleSubmit=async(e)=>{
  e.preventDefault();
  const currentMessage={
    conversationId:conversation._id,
    senderId:user._id,
    messages:senderMessage.current.value
  }
  
  
  
  const receiverId=conversation.members.find(member=>member!==user._id);
  console.log(receiverId)
  //send message to socket Server
  socket.current.emit("sendMessage",{
    senderId:user._id,
    receiverId:receiverId,
    textmessage:senderMessage.current.value
  });
  socket.current.emit("sendOwnMessage",{
    senderId:user._id,
    receiverId:receiverId,
    textmessage:senderMessage.current.value
  });
 
  // {
  //   senderId:null,
  //   messages:null,
  //   createdAt:null
  // };

 
  // setMessages([...messages,inCommingMessage])    
  senderMessage.current.value="";
  //save the message in the dataBase
  try {
    const res=await axios.post("/api/message",currentMessage);
    setMessages([...Messages,res.data])
  } catch (error) {
    console.log(error);
  }
}

//get message from soocket server


//main function 
const display=(chat,status, calls)=>{
       if (chat) {
        if(currentChat){
          return(   
            <div className="chatmainContainer">
              <div className="chatsTopbarContainer">
                <div className="topbarLeft">
                 {/* <ArrowBack className="TopbarIcon"/> */}
                 <div>
                  <img src={userFriend.profilePic?`/assets/${userFriend.profilePic}`:"/assets/noAvatar2.webp"} alt="" className="chatsProfile" height="45px" width="45px"/>
                  </div>
                  <div className="chatsCredentials">
                   <span className="chatsName">{userFriend.username}</span>
                   <span className="chatsLastseen">{chatIsOnline?"Online":"offLine"}</span>
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
               {
               Messages.map((info)=>
                   <div ref={scrollRef} key={info._id}>
                     <Chats friend={userFriend} messageObj={info} own={user._id===info?.senderId} key={info?._id} />
                 </div>
               )
 
             }
              </div>
              <div className="messageinputContainer">
               <div className="inputContainer">
                 <div className="emojisContainer">
                  <span title="emojies"><EmojiEmotionsOutlined className="messageinputIcon"/></span>  
                   <span title="shareFile"><AttachFileOutlined className="messageinputIcon" style={{transform:"rotate(214deg)"}}/></span> 
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
         )
       }else{
         return(
           <div className='defaultChatPage'>
             <span>  
              Open a conversation to start chating
             </span>
           </div>
         )

       }
       
       } else if(status){
        return(
           <div className="statusmainContainer">
            status
           </div>
        )
       }else if(calls){
        return(
           <div className="callsmainContainer">
            calls
           </div>
        )
       }
   }
  return (
    <div className='maincontainer'>
         {display(props.chat,props.status,props.calls)}
    </div>
  )
}
