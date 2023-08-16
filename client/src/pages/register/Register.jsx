import React ,{Component, useRef,useState}from 'react';
import './Register.css'
import { WhatsApp,VisibilityOffOutlined,VisibilityOutlined } from '@mui/icons-material';
import axios, { Axios } from "axios"
import { ToastContainer, toast } from 'react-toastify';
import { Navigate, redirect } from 'react-router';

const Register = () => {
    const showPassword=()=>{
        const passwordInput=document.querySelector("#Password");
        passwordInput.getAttribute("type")==="password"?  passwordInput.setAttribute('type','text'):  passwordInput.setAttribute('type','password');
    }
   const userName=useRef();
   const email=useRef();
   const pass=useRef()
   const phoneNumber=useRef()
   const confirmPass=useRef();
   const [showPass,setShowPass]=useState(true)

   const showPasshandler=(e)=>{
    const passwordInput = document.querySelector("#Password");
    showPass?setShowPass(false):setShowPass(true)
    showPass? passwordInput.setAttribute("type", "text"): passwordInput.setAttribute("type", "password");
    
  }

  const formhandler=async(e)=>{
    e.preventDefault();
    try {
      console.log(pass.current.value);
      console.log(confirmPass.current.value);
      if (confirmPass.current.value===pass.current.value) {
        const registerUser={
          username:userName.current.value,
          email:email.current.value,
          password:confirmPass.current.value,
          phonenumber:phoneNumber.current.value
        };
        const res=await axios.post("/api/auth/register",registerUser);
        if(res.status===200){
          console.log(res.data);
          toast.success("Registration Successfully", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            })
        }
        console.log(res);
      }else{
        console.log("password do not match");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='registerContainer'>
      <div className='toastWrapper'>
      <ToastContainer position="top-center"
             autoClose={5000}
             hideProgressBar={false}
             newestOnTop={false}
             closeOnClick
             rtl={false}
             pauseOnFocusLoss
             draggable
             pauseOnHover
             theme="Dark"
             style={{width:"20px",height:"20px"}}
             />
             </div>
      <div className="registerWrapper">
        <div className="registerWrapperleft">
          <img className='registerLeftWrapperImg' src="/assets/chat-random.jpg" alt="" />
          <div className='registerWrapperleft children'>
            <h1>WhatsUp</h1>
            <h4> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero, enim consequuntur culpa eos assumenda reprehenderit et sint, illum, rem dolores </h4>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non autem laudantium necessitatibus temporibus dolorum aperiam molestias minus impedit quam quidem, magni possimus, similique repudiandae, tempora at ea ex fuga eos?</p>
          </div>
        </div>
        <form className="registerWrapperRight" onSubmit={formhandler}>
            <p>
            <span><WhatsApp/></span>
            <span>WhatsUp</span>
            </p>
            <h3>Register</h3>
            <label htmlFor="username">username :</label>
            <input type="text" name="userName" id="" required ref={userName} />

            <label htmlFor="email">email :</label>
            <input type="email" name="userName" id="" required ref={email} />

            <label htmlFor="number">number :</label>
            <input type="number" name="number" id="" maxLength="10" required ref={phoneNumber}/>

            <label htmlFor="password">password :</label>
            <div className="passwordWrapper">
            <input type="password" name="password" id="Password" minLength="8" ref={pass}/>
            <button type='button' onClick={showPasshandler} title={showPass?"Show Password":"Hide password"}  >
                  {showPass?<VisibilityOutlined/>:<VisibilityOffOutlined/>}
            </button>
            
            </div>

            <label htmlFor="password">confirm password :</label>
            <input type="password" name="password" id="confirm" required minLength="8" ref={confirmPass} />
            <button className='registerBtn' type='submit'>Sign Up</button>
            
        </form>
      </div>
    </div>
  )
}

export default Register