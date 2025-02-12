import React from 'react'
import {
    BrowserRouter, Routes, Route
} from 'react-router-dom'
import Homepage from './page/Homepage';
import Register from './page/Register';
import Login from './page/Login';

function Routerpage() {
    return (
      <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
          <Routes>
              <Route path='/homepage' element={<Homepage />}/>  
              <Route path='/register' element={<Register />}/>
              <Route path='/login' element={<Login />}/>      
          </Routes>
      </BrowserRouter>
    )
  }
  
  export default Routerpage;