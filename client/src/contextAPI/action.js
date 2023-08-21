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

export const initializeSocket=(socket)=>({
    type:"INITIALIZE_SOCKET",
    payload:socket
})

export const updateFriends=(FriendsId)=>({
    type:"UPDATE_FRIENDS",
    payload:FriendsId
})

export const updateUserName=(name)=>({
    type:"UPDATE_USERNAME",
    payload:name
})

export const updateDescription=(desc)=>({
    type:"UPDATE_DESCRIPTION",
    payload:desc
})

export const updateProfile=(profile)=>({
    type:"UPDATE_PROFILE",
    payload:profile
})

export const updateBackIMG=(background)=>({
    type:"UPDATE_BACKGROUNDIMG",
    payload:background
})