import { Chat, PersonAdd } from '@mui/icons-material'
import './Friend.css'
import { Link } from 'react-router-dom'
import { useContext,useEffect, useState } from 'react'
import { Context } from '../../contextAPI/context'
import  axios  from 'axios'

export const Friend = ({friendsId,currentUserProfileId}) => {
   const {user}=useContext(Context);
   const [friend,setUserFriend]=useState(null);
   useEffect(()=>{
      const fetchFriend=async()=>{
        try {
          
          const res= await axios.get(`/api/chat/friends/profile/${friendsId}`);
          setUserFriend(res.data)
        } catch (error) {
          console.log(error);
        }
      }
      fetchFriend();
    },[friendsId])
  return (
    <div className='friendContainer'>
     <div className="friendImg">
        <img src={friend?.profilePic?`/assets/${friend.profilePic}`:"/assets/noAvatar2.webp"} alt="" />
     </div>
     <div className="friendsName">
      
        <span>{friend?.username}</span>
      
        </div>
     <div className="friendsContainerIcon">
        { currentUserProfileId===user._id&&
          <Link style={{textDecoration:"none"}} title='Start A  Chat'><Chat style={{color:"var(--textInputIcons)"}}/></Link>
         }
       </div>
    </div>
  )
}
