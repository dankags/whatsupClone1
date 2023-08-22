import { AddAPhoto, Close, Edit, SearchOutlined } from '@mui/icons-material'
import './Profile.css'
import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import { Friend } from '../../components/friends/Friend'
import { NewUser } from '../../components/newUser/NewUser'
import axios from 'axios'
import { Context, LanguageContext } from '../../contextAPI/context'
import { UserImages } from '../../components/changeUserImages/UserImages'

const Profile = () => {
    const [isName,setIsName]=useState(false)
    const [isAbout,setIsAbout]=useState(false)
    const [userFriends,setUserFriends]=useState(null)
    const [userFriend,setUserFriend]=useState(null)
    const [allUsers,setAllUsers]=useState(null);
    const [usersId,setUsersId]=useState(null);
    const [showForm,setShowForm]=useState(false)
    const {user,dispatch,socket}=useContext(Context)
    const [finishedFetching,setFinishedFetching]=useState(true)
    const [imageSettings,setImageSettings]=useState(false)
    const About=useRef();
    const Name=useRef();
    const params=useParams().id
    // console.log(params);
    // console.log(socket.current);
    useEffect(()=>{
      
      params===user._id&&setFinishedFetching(false)
      params===user._id&&setUserFriends(user.friends)
      const fetchUsers=async()=>{
        try {
          const res=await axios.get("/api/chat/allUsers");
          // setAllUsers(res.data)
          let data=res.data.filter((u)=>u._id!==user?._id)
          let useFriends=user?.friends
          useFriends.forEach(item=>data=data.filter(i=>i._id!==item))
           setAllUsers(data);
          
        } catch (error) {
          console.log(error);
        }
      }
      fetchUsers();
    
      if(params===user?._id){
        setUserFriends(user?.friends)

      }
      
    },[])
    
   
   useEffect(()=>{
   
    allUsers&&user?.friends.map((element)=>
    setAllUsers(allUsers.filter((u)=>u._id!==element))
    )
   },[userFriend])
  //fetch user or friend profile according to parameter provided
   useEffect(()=>{
    const fetchFriend=async()=>{
      try {
        const res= await axios.get(`/api/chat/friends/profile/${params}`);
          setUserFriend(res.data)
          setUserFriends(res.data.friends)
          if(res.status===200){
            setFinishedFetching(!finishedFetching);
           }
      } catch (error) {
        console.log(error);
      }
    }
    
    if (params!==user._id) {
      fetchFriend()
    } else {
     setAllUsers( allUsers?.filter((u)=>u._id!==user?.friends.map((Id)=>Id)))
    }
   },[params])


useEffect(()=>{
  usersId&&allUsers.filter((u)=>u._id!==usersId)
  
  const addFriends=async()=>{
    try {
      const res=await axios.put(`/api/chat/addFriend/${user._id}?friendId=${usersId}`);
      console.log(res.data);
      if(res.status===200){
      dispatch({type:"UPDATE_FRIENDS",payload:usersId})
      params===user._id&&setUserFriends(prev=>[...prev,usersId])
      setAllUsers(allUsers.filter((u)=>u._id!==usersId))
      console.log(userFriends);
      console.log(allUsers);  
    }
    } catch (error) {
      console.log(error);
    }
  }
  usersId&&addFriends();
},[usersId])

    //update name and about
    const submitHandler=async(e)=>{
        e.preventDefault();
        if(Name.current?.value){
          try {
            const res=await axios.put(`/api/auth/user/profile/${params}`,{name:Name.current.value}) 
            if(res.status===200){
              dispatch({type:"UPDATE_USERNAME",payload:Name.current.value})
            }
            setIsName(!isName)
          } catch (error) {
            console.log(error);
          }
        }
        if(About.current?.value){
          try {
            const res=await axios.put(`/api/auth/user/profile/${params}`,{about:About.current.value})
            if(res.status===200){
              dispatch({type:"UPDATE_DESCRIPTION",payload:About.current.value})
            }
            setIsAbout(!isAbout)
          } catch (error) {
            console.log(error);
          }
        }
    }
    const handleProfileImg=(e)=>{
      setShowForm(!showForm);
      setImageSettings(false)
    }
    const handleBackImg=()=>{
      setShowForm(!showForm);
      setImageSettings(true)
    }
  return (
    <div className='profileContainer'>
      {finishedFetching?
      <span>Loading...</span>
      :
      <>
       {showForm&&<UserImages changeSettings={imageSettings} /> }
      <div className="profileLeftWrapper">
          <div className="topLeftWrapper">
            {params===user._id?
             <img src={user?.backImg ? `${process.env.REACT_APP_PUBLIC_FOLDER}${user.backImg}`:"/assets/noImage.jpg"} alt="" style={{objectFit:"cover",borderRadius:"0 0 10px 0"}}  width="100%" height="85%"/>
            :
            <img src={userFriend?.backImg?`${process.env.REACT_APP_PUBLIC_FOLDER}${userFriend.backImg}`:"/assets/noImage.jpg"} alt="" style={{objectFit:"cover",borderRadius:"0 0 10px 0"}}  width="100%" height="85%"/>
            }
                
           {params===user?._id&&
            <button  title='change Back Image' className='backImageBtn' onClick={handleBackImg} >
                <AddAPhoto/>
            </button>
            }
            <div className='profileImgHolder'>
                {params===user._id?
                  <img src={user?.profilePic ? `${process.env.REACT_APP_PUBLIC_FOLDER}${user.profilePic}`:"/assets/noAvatar2.webp"} alt="profileImg"  />
                :
                <img src={userFriend?.profilePic?`${process.env.REACT_APP_PUBLIC_FOLDER}${userFriend.profilePic}`:"/assets/noAvatar2.webp"} alt="profileImg"  />
                }
                {params===user?._id&&
                // <form onSubmit={uploadFile}>
                <button className='changeProfileBtn' title="Change Profile Image" onClick={handleProfileImg}>
                    <AddAPhoto/>
                </button>
                
                }
                {/* <input type="file" name="" id="" /> */}
            </div>
          </div>
          <div className="bottomLeftWarapper">
            <div className="userInfoContainer">
              <div className="infoWrapper">
                <span className="titleContainer">Name :</span>
                    <form onSubmit={submitHandler}>
                    {isName?
                    <>
                    <input type="text" name="" placeholder="Name..." ref={Name}/>
                    <button type='submit'>submit</button>
                    </>
                    :
                    <>
                    {params===user._id?
                    <span className="userInfo name" >{user.username}</span>
                    :
                    <span className="userInfo name" >{userFriend?.username}</span>
                    }
                    {params===user?._id&&
                    <span onClick={()=>setIsName(!isName)} className='editButton' title='Change Name'><Edit style={{color:"var(--textInputIcons)"}}/></span>
                  }
                  </>
                    }
                    </form>
              </div>
              <div className="infoWrapper">
               <span className="titleContainer">About :</span>
               <form onSubmit={submitHandler}>
                    {isAbout?
                     params===user?._id&&<>
                    <input type="text" name="" placeholder="About..." ref={About}/>
                    <button type='submit'>submit</button>
                    </>
                    :
                    <>
                    {params===user._id?
                    <span className="userInfo">{user.userdesc}</span>
                    :
                    <span className="userInfo">{userFriend?.userdesc}</span>
                    }
                    {params===user?._id&&
                    <span onClick={()=>setIsAbout(!isAbout)} className='editButton' title='Change About'><Edit style={{color:"var(--textInputIcons)"}}/></span>
                    }
                    </>
                    }
                    </form>
              </div>
              <div className="infoWrapper">
               <span className="titleContainer">Contacts :</span>
               {params===user._id?
               <span className="userNumberWrapper">{user?.phonenumber}</span>
              :
              <span className="userNumberWrapper">{userFriend?.phonenumber}</span>
              }
              </div>
            </div>
            <hr />
            <div className="userFriendsContainer">
                <div className="searchBarWrapper">
                    <input type="search" placeholder='Search friend...' name="" id="" />
                    <button><SearchOutlined style={{color:"var(--textInputIcons)"}}/></button>
                </div>
                <span>Friends</span>
                <div className="friendListWrapper">
                {
            
                userFriends?.map((friend)=>
                 <Friend friendsId={friend} currentUserProfileId={params} key={friend}/>)
                
                }
                </div>
            </div>
          </div>
      </div>
      <div className="profileRightWrapper">
       <span>New Users
        <Link to="/" style={{textDecoration:"none"}} title='go to ChatPage'><Close style={{color:"var(--textInputIcons)"}}/></Link>
       </span>
       <div className="newUsersContainer">
        {allUsers?.map((element)=>
          <div onClick={()=>setUsersId(element._id)} key={element._id}>
          <NewUser userHolder={element}/>
          </div>
        )

        }

       </div>
      </div>
      </>
}
    </div>
  )
}

export default Profile