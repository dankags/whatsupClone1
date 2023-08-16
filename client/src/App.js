// import Call from './pages/calls/Call';
import Chat from './pages/chat/Chat';
// import Status from './pages/status/status';
import { BrowserRouter, Routes,Route, Navigate } from 'react-router-dom';
import React ,{Component, useContext}from 'react';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import { Context, ConversationContextProvider } from './contextAPI/context';
import { dummyUser } from './dummyData';
import { Layout } from './components/layout/Layout';
import Profile from './pages/profile/Profile';

function App() {
  const {user}=useContext(Context);
  // const User=dummyUser;
  return ( 
     <BrowserRouter>
      <Routes>
       <Route exact path='/' element={user?
       <ConversationContextProvider>
       <Chat user={user}/>
       </ConversationContextProvider>
       :<Navigate to="/login" replace/>}/>
       <Route path='/login' element={user?<Navigate to="/" replace/>:<Login/>}/>
       <Route path='/register' element={user? <Navigate to="/login" replace/>:<Register/>} />
       <Route path="/profile/:id" element={user&&
       <ConversationContextProvider>
         <Profile/>
       </ConversationContextProvider>
       }/>
      </Routes>
     </BrowserRouter>
  );
}

export default App;
