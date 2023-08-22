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



export const ThemeContext = React.createContext({
  theme: null,
  chatBackImg:null,
  setTheme:()=>{},
})

//sets the user socket id
export const ThemeProvider = (props) => {

  const setTheme = (theme,chatBackImg) => {
    setState({...state, theme: theme,chatBackImg:chatBackImg})
  }
  const initState = {
    theme: null,
  chatBackImg:null,
  setTheme:setTheme,
  } 

  const [state, setState] = useState(initState)

  return (
    <ThemeContext.Provider value={state}>
      {props.children}
    </ThemeContext.Provider>
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