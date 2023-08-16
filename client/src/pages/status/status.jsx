import Main from '../../components/mainplace/Main'
import Side from '../../components/sideplace/Side'
import './Status.css'
import React ,{Component}from 'react';

export default function status() {
  return (
    <div className='statuscontainer'>
    <Side status="true"/>
    <Main status="true"/>
    <div className="conversationContainer">   
      <Topbar/>
    <div className="chatpagecontainer">
    <div className="chatpagelist">
      <div className="conversationWrapper">
     {conversations.map((person)=>
       <div onClick={()=>setCurrentCoversation(person)} key={person._id}>
         {/* check this place if there is error */}
       <Message conversation={person} currentUser={User} onlineUsers={onlineFriends} message={person.members.some(m=>inCommingMessage?.senderId===m)?inCommingMessage:null} ownMessage={myOwnWrittenMess} receiverId={receiver}  />
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
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem magni aliquid voluptates nulla dolorum quaerat, labore eius iste fugit placeat voluptatibus, voluptatum dolor vero repellat dolore nobis officia, cupiditate m
    </div>
  )
}
