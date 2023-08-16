import './NewUser.css'
import { Link } from 'react-router-dom'
import { PersonAdd } from '@mui/icons-material'

export const NewUser = ({userHolder}) => {
  return (
    <div className='friendContainer'>
     <div className="friendImg">
        <img src={userHolder?.profilePic?`/assets/${userHolder.profilePic}`:"/assets/noAvatar2.webp"} alt="" />
     </div>
     <div className="friendsName">
        <span>{userHolder?.username}</span>
        </div>
     <div className="friendsContainerIcon">
         <Link style={{textDecoration:"none"}} title='Add As Friend'><PersonAdd style={{color:"var(--textInputIcons)"}}/></Link>
       </div>
    </div>
  )
}
