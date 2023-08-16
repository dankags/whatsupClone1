import { AddAPhoto, Close, Edit, SearchOutlined } from '@mui/icons-material'
import './Profile.css'
import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import { Friend } from '../../components/friends/Friend'
import { NewUser } from '../../components/newUser/NewUser'
import axios from 'axios'
import { Context, LanguageContext } from '../../contextAPI/context'

const Profile = () => {
    const [isName,setIsName]=useState(false)
    const {socket}=useContext(LanguageContext)
    const [isAbout,setIsAbout]=useState(false)
    const [userFriends,setUserFriends]=useState(null)
    const [users,setUsers]=useState(null);
    const [usersId,setUsersId]=useState(null);
    const {user}=useContext(Context)
    const [finishedFetching,setFinishedFetching]=useState(true)
    const About=useRef();
    const Name=useRef();
    const params=useParams().id
    // console.log(params);
    console.log(socket.current);
    useEffect(()=>{
      setTimeout(()=>{
        console.log("hello");
        setFinishedFetching(!finishedFetching);

      },3000)
      const fetchUsers=async()=>{
        try {
          const res=await axios.get("/api/chat/allUsers");
          setUsers(res.data);
        } catch (error) {
          console.log(error);
        }
      }
      fetchUsers();
      params===user._id&&setUserFriends(user.friends)
    },[])
   

  //fetch user or friend profile according to parameter provided
   useEffect(()=>{
    const fetchFriend=async()=>{
      try {
        const res= await axios.get(`/api/chat/friends/profile/${params}`);
          setUserFriends(res.data)

      } catch (error) {
        console.log(error);
      }
    }
    
    if (params!==user._id) {
      fetchFriend()
      userFriends?.friends.forEach((friendId)=>
      users.filter((user)=>user._id!==friendId)
     )
    } else {
      user?.friends.forEach((friendId)=>
       users.filter((user)=>user._id!==friendId)
      )
    }
   },[params])


// useEffect(()=>{

// },[usersId])

    //update name and about
    const submitHandler=async(e)=>{
        e.preventDefault();
        if(Name.current?.value){
          try {
            const req=await axios.put(`/api/auth/user/profile/${params}`,{name:Name.current.value})
            console.log(req.data);
            setIsName(!isName)
          } catch (error) {
            console.log(error);
          }
        }
        if(About.current?.value){
          try {
            const req=await axios.put(`/api/auth/user/profile/${params}`,{about:About.current.value})
            console.log(req.data);
            setIsAbout(!isAbout)
          } catch (error) {
            console.log(error);
          }
        }
    }
    const uploadFile=(e)=>{
      e.preventDefault()
    }
  return (
    <div className='profileContainer'>
      {finishedFetching?
      <span>Loading...</span>
      :
      <>
      <div className="profileLeftWrapper">
          <div className="topLeftWrapper">
            {params===user._id?
             <img src={user?.backImg?`/images/${user.backImg}`:"/assets/noImage.jpg"} alt="" style={{objectFit:"cover",borderRadius:"0 0 10px 0"}}  width="100%" height="85%"/>
            :
            <img src={userFriends?.backImg?`/images/${userFriends.backImg}`:"/assets/noImage.jpg"} alt="" style={{objectFit:"cover",borderRadius:"0 0 10px 0"}}  width="100%" height="85%"/>
            }
                
           {params===user?._id&&
            <label htmlFor="backImg" title='change Back Image' className='backImageBtn' >
                <AddAPhoto/>
                <input style={{display:"none"}} type="file" name="" id="backImg" />
            </label>
            }
            <div className='profileImgHolder'>
                {params===user._id?
                  <img src={user.profilePic?`/assets/${user.profilePic}`:"/assets/noAvatar2.webp"} alt="profileImg"  />
                :
                <img src={userFriends.profilePic?`/assets/${userFriends.profilePic}`:"/assets/noAvatar2.webp"} alt="profileImg"  />
                }
                {params===user?._id&&
                // <form onSubmit={uploadFile}>
                <label htmlFor="file" className='changeProfileBtn' title="Change Profile Image" >
                    <AddAPhoto/>
                    <input style={{display:"none"}} type="file" name="" id="file" />
                </label>
                
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
                    <span className="userInfo name" >{userFriends.username}</span>
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
                    <span className="userInfo">{userFriends.userdesc}</span>
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
              <span className="userNumberWrapper">{userFriends?.phonenumber}</span>
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
                { user._id===params?
                user.friends.map((eachFriend)=>
                <Friend friendsId={eachFriend} currentUserProfileId={params} key={eachFriend}/>
               )
                :
                userFriends.friends?.map((friends)=>
                 <Friend friendsId={friends} currentUserProfileId={params} key={friends}/>
                )

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
        {users.map((element)=>{
          <div onClick={()=>setUsersId(element._id)}>
          <NewUser userHolder={element}/>
          </div>
        })

        }

       </div>
      </div>
      </>
}
    </div>
  )
}

export default Profile