import './NewUser.css'
import { Link } from 'react-router-dom'
import { PersonAdd } from '@mui/icons-material'
import { useContext, useEffect, useState } from 'react'
import { Context } from '../../contextAPI/context'

export const NewUser = ({userHolder}) => {
  const {socket}=useContext(Context)
  const [changedProfileUser,setChangedProfileUser]=useState(null)
  const [newUser,setNewUser]=useState(userHolder)

  useEffect(()=>{
    socket?.current.on("userChangedProfile",data=>{
     setChangedProfileUser(data)
    })
   },[])

   useEffect(()=>{
    changedProfileUser&&userHolder._id===changedProfileUser.userChangerId&&setNewUser(prev=>({...prev,profilePic:changedProfileUser.userImage}))
   },[changedProfileUser])

  return (
    <div className='friendContainer'>
     <div className="friendImg">
        <img src={newUser?.profilePic?`${process.env.REACT_APP_PUBLIC_FOLDER}${newUser.profilePic}`:"/assets/noAvatar2.webp"} alt="" />
     </div>
     <div className="friendsName">
        <span>{newUser?.username}</span>
        </div>
     <div className="friendsContainerIcon">
         <Link style={{textDecoration:"none"}} title='Add As Friend'><PersonAdd style={{color:"var(--textInputIcons)"}}/></Link>
       </div>
    </div>
  )
}
