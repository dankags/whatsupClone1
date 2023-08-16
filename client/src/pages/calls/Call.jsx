import Main from '../../components/mainplace/Main'
import Side from '../../components/sideplace/Side'
import './Call.css'
import React ,{Component}from 'react';

export default function Call() {
  return (
    <div className='callcontainer'>
        <Side calls="true"/>
        <Main calls="true"/>
    </div>
  )
}
