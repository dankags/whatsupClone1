export const AuthReducer=(state,action)=>{
  switch (action.type) {
    case "LOGIN_START":
        return{ 
           user:null,
           isFetching:true,
           error:false
        };
    case "LOGIN_SUCCESS":
        return{ 
            user:action.payload,
            socket:null,
            isFetching:false,
            error:false
        };
    case "LOGIN_FAILURE":
        return{ 
            user:null,
            isFetching:false,
            error:action.payload
        };
        
    case "INITIALIZE_SOCKET":
        return{ 
            ...state,
            socket:action.payload
            };
    case "UPDATE_USERNAME":
        return{ 
            ...state,
            user:{
             ...state.user,
             username:action.payload,   
            }
            };
    case "UPDATE_DESCRIPTION":
        return{ 
            ...state,
            user:{
             ...state.user,
             userdesc:action.payload,   
            }
            }; 
    case "UPDATE_PROFILE":
        return{ 
            ...state,
            user:{
             ...state.user,
             profilePic:action.payload,   
            }
            };       
    case "UPDATE_BACKGROUNDIMG":
        return{ 
            ...state,
            user:{
             ...state.user,
             backImg:action.payload,   
            }
            };                   
    default:
        return state;
  }
}

