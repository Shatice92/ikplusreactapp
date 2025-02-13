import React from 'react'
import {
    BrowserRouter, Routes, Route
} from 'react-router-dom'
import Homepage from './page/Homepage';
import Register from './page/Register';
import Login from './page/Login';
import ForgotPassword from './page/ForgotPassword';


function Routerpage() {
    return (
      <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
          <Routes>
              <Route path='/' element={<Homepage />}/>  
              <Route path='/register' element={<Register />}/>
              <Route path='/login' element={<Login />}/>  
              <Route path='/resetpassword' element={<ForgotPassword />}/>  
          </Routes>
      </BrowserRouter>
    )
  }
  
  export default Routerpage;