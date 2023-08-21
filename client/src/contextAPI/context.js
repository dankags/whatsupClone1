import React, {createContext, useReducer}from"react"
import {AuthReducer} from "./reducer";
import { useState,useContext,useMultipleContexts } from "react";
    
//creates theinitial state fetching
const INITIAL_STATE={
    user:null,
    socket:null,
    isFetching:false,
    error:false
};



export const LanguageContext = React.createContext({
  language: null,
  socket:null,
  setSocket:()=>{},
  setLanguage: () => {}
})




// export const  useMultipleContexts=(children)=>{
//   const contextOne = useContext(LanguageContext);
//   const contextTwo = useContext(CommingMessage);
  


  
// }


//sets the user socket id
export const ConversationContextProvider = (props) => {

  const setLanguage = (language) => {
    setState({...state, language: language})
  }
  const setSocket=(socket)=>{
    setState({...state,socket:socket})
  }
  const initState = {
    language: null,
    socket:null,
    setSocket:setSocket,
    setLanguage: setLanguage
  } 

  const [state, setState] = useState(initState)

  return (
    <LanguageContext.Provider value={state}>
      {props.children}
    </LanguageContext.Provider>
  )
}


const formStatecontext=createContext({
  display:null,
  setDisplay:()=>{}
})

const FormStateProvider=({children})=>{
  const setDisplay=(displayState) => {
    setFormState({...formState, display:displayState})
  }
  const initState={
    display:null,
    setDisplay:setDisplay
  }

  const [formState, setFormState] = useState(initState)
  return(
   <formStatecontext.Provider value={formState}>
    {children}
   </formStatecontext.Provider>

  )
}


// creates a main context which stores user data
export const Context=createContext(INITIAL_STATE);


export const ContextProvider=({children})=>{

    const [state,dispatch]=useReducer(AuthReducer,INITIAL_STATE);
    return(
        
       <Context.Provider value={{
       user:state.user,
       socket:state.socket,
       isFetching:state.isFetching,
       error:state.error,
       dispatch
       }}>
        {/* the valus will be used by th childrens only*/}
        {children}
       </Context.Provider>
    );
};