import axios from "axios";

export const logInConfig=async(userCredential,dispatch)=>{
    dispatch({type:"LOGIN_START"});
    try{
        const res=await axios.post("/api/auth/login",userCredential);
        
        dispatch({type:"LOGIN_SUCCESS",payload:res.data});
    }catch(error){
      dispatch({type:"LOGIN_FAILURE",payload:error})  
    }
}
export const conversationConfig=async(userCredential,dispatch)=>{
  dispatch({type:"CONVERSATION_START"});
  try{
      // const res=await axios.post("/api/auth/login",userCredential);

      dispatch({type:"CONVERSATION_SUCCESS",payload:userCredential});
  }catch(error){
    dispatch({type:"CONVERSATION_FAILURE",payload:error})  
  }
}  