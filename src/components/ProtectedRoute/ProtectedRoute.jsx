import React, { useState,useEffect } from 'react';
import { AuthData } from '../../service/authService.jsx';
import { Navigate, Outlet } from 'react-router-dom'


const PrivateRoutes = () => {

const { getToken } = AuthData();

console.log('Protected Route --> Getting token...');
let isAuthenticated = getToken() != null;

return (
    isAuthenticated ? <Outlet/> : <Navigate to='/login'/>
  )
}

export default PrivateRoutes



