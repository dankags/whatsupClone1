export const LoginStart=(user)=>({
    type:"LOGIN_START",
})

export const LoginSuccess=(user)=>({
    type:"LOGIN_SUCCESS",
    payload:user
})

export const LoginFailure=(error)=>({
    type:"LOGIN_FAILURE",
    payload:error
})

export const updateFriends=(FriendsId)=>({
    type:"UPDATE_FRIENDS",
    payload:FriendsId
})