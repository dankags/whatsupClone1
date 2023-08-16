import { CallOutlined, CallReceived } from '@mui/icons-material'
import './Calls.css'
import React ,{Component}from 'react';

export default function Calls() {
  return (
<li className='callsContainer'>
    <div className="imagContainer">
        <img src="/assets/car2.jpg" alt="" className="callsProfileImg" />
    </div>
    <div className="callsDesc">
        <span className="callsName">David Kings</span>
        <p className="callsInfoContainer">
            <CallReceived className='callinfoIcon' style={{color:"#04fc4e"}}/>
         <span className="callsInfo">January 10, 10:40 PM</span>
        </p>
    </div>
    <div className="Callbutton">
        <button className='call' type="submit"><CallOutlined/></button>
    </div>
    </li>
  )
}
