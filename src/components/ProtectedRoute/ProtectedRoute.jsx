import React, { useState,useEffect,useMemo } from 'react';
import  useAuthService  from '../../service/authService.jsx';
import { Navigate, Outlet } from 'react-router-dom'


const PrivateRoutes = () => {

  const { getToken } = useAuthService();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useMemo(() => {
    setIsAuthenticated(getToken() != null)
}, [isAuthenticated]);

  return (
      isAuthenticated ?  <Outlet/> : <Navigate to='/login'/> 
    )
}

export default PrivateRoutes



