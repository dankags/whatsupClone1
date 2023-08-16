import './Person.css'
import React ,{Component}from 'react';

export default function Person({viewed}) {
  return (
     <li className='container'>
      <div className="statusImg">
        <div className="imagecontainer" style={viewed ? {borderColor:'grey'} : {borderColor:'var(--noOfMessages)'}}>
           <img src="/images/playing2.jpg" alt="" className="statusContentImg" />
        </div>
      </div>     
      <div className="statusInfo">
        <span className="personName">John Doe</span>
        <span className="timeUpdated">12 minutes ago</span>
      </div>
     </li>
  )
}
