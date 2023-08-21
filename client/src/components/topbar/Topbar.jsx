import './Topbar.css'
import {  MoreVert, NightsStay, PersonAdd, Search } from '@mui/icons-material'
import { useContext, useEffect, useReducer, useState } from 'react';
import {Link} from "react-router-dom"
import React ,{Component}from 'react';
import { Context } from '../../contextAPI/context';

export default function Topbar() {
  const [currentUser, setcurrentUser] = useState({})
  const {user}=useContext(Context);
  useEffect(()=>{
    setcurrentUser(user);
  },[user])

   const [searchClass, setsearchClass] = useState("searchBarDefault");
   const [pageTitle, setpageTitle]=useState("Chats");
   const chatPage=()=>{setpageTitle("Chats");}
   const statusPage=()=>{setpageTitle("Status");}
   const callPage=()=>{setpageTitle("Calls");}
 const changebar=()=>{
   let check=false;
   if (EventTarget) {
    console.log("true")
    check=true;
   }
   if (check) {
    setsearchClass("searchBar");
    check=false;
   } else{
     setsearchClass("searchBarDefault");   
   }
  
 };
 let validateTheme=false;
 const theme=()=>{
    if(validateTheme===false){
      document.getElementById("root").setAttribute("data-theme","dark");
      if(document.getElementById("root").getAttribute("data-theme")==="dark"){
        // document.querySelector(".chatmainContainer").style.backgroundImage="url('/public/assets/light_bak_w.jpg')"
      };
      validateTheme=true;
    }else{
      document.getElementById("root").setAttribute("data-theme","light");
      if(document.getElementById("root").getAttribute("data-theme")==="light"){
        // document.querySelector(".chatmainContainer").style.backgroundImage="url('/public/assets/HD-wallpaper-whatsapp-v-background-doodle-pattern-patterns-whatsapp-thumbnail.jpg')"
      };
      validateTheme=false;
    }
 };
 let show;
 const showMenu=()=>{
  if(show===true){
    document.getElementById("Menu").style.display="block";
    show=false;
  }else{
    document.getElementById("Menu").style.display="none";
    show=true;
  }
 }

  return (
    <div className='topbarContainer'>
      <div className="containerTop">
        <div className="topLeft">
          <div className="Imgcontainer">
            <Link to={`/profile/${user._id}`} style={{textDecoration:"none"}}>
            <img src={currentUser.profilePic?`${process.env.REACT_APP_PUBLIC_FOLDER}${user.profilePic}`:"/assets/noAvatar.jpg"} alt="" className="userProfile" />
            </Link>
          </div>
          <span className="username">Chat</span>
        </div>
        <div className="topRight">
          <div className="RightIconcontainer">
          <span title="Theme" onClick={theme}>{validateTheme===false ? <NightsStay className='topbarIcon'/> : "dark" }</span>
          <span title="Acconts"><PersonAdd className='topbarIcon'/></span>
          <span title="Menu" onClick={showMenu}><MoreVert className='topbarIcon'/></span>
          <div id='Menu' className='menu' >
            <ul className="menuList">
            <li className="list"><Link to="/"onClick={chatPage} style={{textDecoration:"none",color:"black"}}><span className="menuListItem">Chats</span></Link></li>
             <li className="list"><Link to="/status" onClick={statusPage} style={{textDecoration:"none",color:"black"}}><span className="menuListItem">Status</span></Link></li>
             <li className="list"><Link to="/calls" onClick={callPage} style={{textDecoration:"none",color:"black"}}><span className="menuListItem">Calls</span></Link></li>   
            </ul>  
          </div>
          </div>
        </div>
      </div>
      <div className="containerBottom">
       <div className={searchClass}>
          <input type="search" onFocus={changebar} placeholder='Search some chats...' name="" id="" className="searchInput" />
          <span title="Search"><Search className='searchIcon'/></span>
       </div>
      </div>
      
    </div>
  )
}
