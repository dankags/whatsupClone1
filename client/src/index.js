import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ContextProvider, ThemeProvider } from './contextAPI/context';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
    <ContextProvider>
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
    <App />
    </ContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);


