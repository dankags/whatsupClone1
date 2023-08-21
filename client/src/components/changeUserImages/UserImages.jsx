import { useContext, useEffect, useRef } from "react"
import"./UserImages.css"

import React, { useState } from 'react'
import { Close } from "@mui/icons-material"
// import { formStatecontext } from "../../pages/register/Register"
import { Context } from "../../contextAPI/context"
import axios from "axios"

export const UserImages = ({changeSettings}) => {
    // const {display,setDisplay}=useContext(formStatecontext)
    const [files,setFiles]=useState(null)
    const [fileName,setFileName]=useState(null)
    const [formDisplay,setFormDisplay]=useState(true);
    const [imgSrc,setImgSrc]=useState(null)
    const {user,dispatch,socket}=useContext(Context)
    
    console.log(socket)
    //handle upload image
    const handleSubmit=async(e)=>{
        e.preventDefault();
        const img={
            imgName:null
        }
        if (files) {
            const data=new FormData()
            const fName=Date.now()+fileName;
            img.imgName=fName
            console.log(img.imgName);
            // files.name=fName;
            data.append("file",files)
            data.append("name",fName)
            console.log(data);
            try {
             await axios.post(`/api/upload?name=${fName}`,data) 
            } catch (error) {
                console.log(error);
            }
        }
        
        
            if(changeSettings){
                try {
                    const res=await axios.put(`/api/chat/updateBackground/${user._id}`,{filename:img.imgName})
                    console.log(res.data);  
                    if(res.status===200){
                        dispatch({type:"UPDATE_BACKGROUNDIMG",payload:img.imgName})
                        const formPage=document.querySelector(".formHolder")
                        formPage.style.display="none"
                    } 
                } catch (error) {
                    console.log(error)
                }
            
            }else{
                try{
                    const res= await axios.put(`/api/chat/updateProfile/${user._id}`,{filename:img.imgName})
                    console.log(res.data);
                    if(res.status===200){
                        dispatch({type:"UPDATE_PROFILE",payload:img.imgName})
                        socket?.current.emit("changedProfile",{userChangerId:user._id,userImage:img.imgName})
                        const formPage=document.querySelector(".formHolder")
                        formPage.style.display="none"
                    } 
                }catch(error){
                  console.log(error)
                }}
       
    }

    useEffect(()=>{
        setFormDisplay(true)
    },[formDisplay])
    const fileHandler=async(e)=>{
        let file=e.target.files[0]
        if (file) {
            setFileName(file.name) 
            setFiles(file)
            console.log(file);
        }

        const url=URL.createObjectURL(file)
        setImgSrc(`${url}`)
    //   setFileName(file.files[0].name)
    }
    const closeForm=()=>{
        const formPage=document.querySelector(".formHolder")
        formPage.style.display="none"
    //    formDisplay=false;
    }
  return (
    
 <div class="formHolder"  >
   <main class="mainPageForm">
     <button class="closeForm" onClick={closeForm}><Close style={{color:"grey"}}/></button>
     <form class="imageForm" onSubmit={handleSubmit}>
        <div class="upperFormPart">
            {changeSettings?
            <>
            <img src={changeSettings&&imgSrc?imgSrc:`${process.env.REACT_APP_PUBLIC_FOLDER}${user.backImg}`} alt="" class="backImg"/>
            <div class="profileWrapper">
                <img src="/assets/noAvatar2.webp" alt="" class="profileImg"/>
            </div>
            </>
            :
            <div class="profileWrapper img">
            <img src={!changeSettings&&imgSrc?imgSrc:`${process.env.REACT_APP_PUBLIC_FOLDER}${user.profilePic}`} alt="" class="profileImg"/>
            </div>
            }
        </div>
        <div class="loweFormPart">
            <span class="lowerPartLabel">Choose profile image file : </span>
            <div class="chooseFileWrapper">
            <span class="choosenFileHolder">{files?fileName:"Choosen file..."}</span>
            <label for="file" class="fileLable">
                <span>Choose image</span>
                <input type="file" name=""  onChange={fileHandler} accept="image/*" id="file" style={{display:"none"}} />
            </label>
        </div>
        <div class="submitBtnWrapper">
            <button type="submit" class="submitBtn">Upload</button>
        </div>    
        </div>
     </form>
   </main>
</div>
    
  )
}
