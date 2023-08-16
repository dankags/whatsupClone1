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
    case "UPDATE_FRIENDS":
        return{ 
            user: state.friends.push(action.payload),
            isFetching:false,
            error:false
            };
  
    default:
        return state;
  }
}

