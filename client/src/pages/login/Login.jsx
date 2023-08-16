import React, { Component, useContext, useRef, useState } from "react";
import "./Login.css";
import { VisibilityOffOutlined, VisibilityOutlined, WhatsApp } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { logInConfig } from "../../apiCalls";
import { Context } from "../../contextAPI/context";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPass,setShowPass]=useState(true)
  const [checkPassFocus,setPassFocus]=useState(false)
  const focushandler=(e)=>{
    setPassFocus(true)
    const passwordWrapper = document.querySelector(".passwordWrapper");
    passwordWrapper.style.outline="4px solid rgb(0, 157, 168)"
  }
  const removeFocus=()=>{
    checkPassFocus&&setPassFocus(false)
    const passwordWrapper = document.querySelector(".passwordWrapper");
   checkPassFocus?passwordWrapper.style.outline="4px solid rgb(0, 157, 168)":passwordWrapper.style.outline="none"
  }
 
  const showPasshandler=(e)=>{
    const passwordInput = document.querySelector("#Password");
    showPass?setShowPass(false):setShowPass(true)
    showPass? passwordInput.setAttribute("type", "text"): passwordInput.setAttribute("type", "password");
    
  }
  const email = useRef();
  const passWord = useRef();
  const { user, isFetching, error, dispatch } = useContext(Context);
  const formHandler = (e) => {
    e.preventDefault();
    logInConfig(
      { email: email.current.value, password: passWord.current.value },
      dispatch
    );
  };

  return (
    <div className="loginContainer">
      <div className="loginWrapper">
        <div className="loginWrapperleft">
          <img src="/assets/chat-random.jpg" className="loginLeftImg" alt="" height="100%" width="100%" />
          <div className="loginWrapperleft leftChildren">
          <h1>WhatsUp</h1>
          <h4>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero, enim
            consequuntur culpa eos assumenda reprehenderit et sint, illum
          </h4>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non autem
            laudantium necessitatibus temporibus dolorum aperiam molestias minus
            impedit quam quidem, magni possimus, similique repudiandae, tempora
            at ea ex fuga eos?
          </p>
          <Link to="/register" className="loginSignUpBtn" style={{textDecoration:"none"}}>Sign Up</Link>
        </div>
        </div>

        <form className="loginWrapperRight" onClick={removeFocus} onSubmit={formHandler}>
          <p>
            <span>
              <WhatsApp />
            </span>
            <span>WhatsUp</span>
          </p>
          <h3>login</h3>
          <div>
            <label htmlFor="username">Username/Email :</label>
            <input type="text" name="userName" id="" required ref={email} />
            <div className="passwordContainer">
              <div className="passwordLables">
              <label htmlFor="password">Password :</label>
              <Link style={{color:"white"}}>Forgot password</Link>
              </div>
              <div className="passwordWrapper">
                <input
                  type="password"
                  name="password"
                  id="Password"
                  required
                  minLength="6"
                  // onClick={focushandler}
                  ref={passWord}
                />
                <button type='button' onClick={showPasshandler} title={showPass?"Show Password":"Hide password"} disabled={isFetching} >
                  {showPass?<VisibilityOutlined/>:<VisibilityOffOutlined/>}
                </button>
                
              </div>
            </div>
          </div>

          <button className="loginBtn" type="submit" disabled={isFetching}>
            {isFetching ? (
              <CircularProgress
                style={{color:"white",  width: "20px", height: "20px" }}
              />
            ) : (
              "log In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
