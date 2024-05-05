import { createContext, useContext, useState } from "react"
import Home from '../pages/Home/Home.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes from '../components/ProtectedRoute/ProtectedRoute.jsx';
import Login from '../pages/Login/Login.jsx'
import Post from '../pages/post/Post.jsx';

//const AuthContext = createContext();
//export const AuthData = () => useContext(AuthContext);

const useAuthService = () => {

  const [token, setToken] = useState();
  const [expiration, setExpiration] = useState();
  const [refreshToken, setRefreshToken] = useState();

  const login = async (username, password) => {

    try 
    {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "email": username,
        "password": password
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

    var response = await fetch("http://localhost:6819/api/Auth/login", requestOptions)

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();
      const { token, expiration, refreshToken } = data;

      localStorage.setItem('token', token);
      localStorage.setItem('expiration', expiration);
      localStorage.setItem('refreshToken', refreshToken);

      // Update token state
      setToken(token);
      setExpiration(expiration);
      setRefreshToken(refreshToken);
    } 
    catch (error) 
    {
      console.error('Login error:', error);
      throw error;
    }
  };

  const refresh = async () => {

    try 
    {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "token": localStorage.getItem('token'),
        "refreshToken": localStorage.getItem('refreshToken')
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

    var response = await fetch("http://localhost:6819/api/Auth/Refresh", requestOptions)

      if (!response.ok) {
        throw new Error('Failed to refresh');
      }

      console.log("Token refreshed!");

      const data = await response.json();
      const { token, expiration, refreshToken } = data;

      localStorage.setItem('token', token);
      localStorage.setItem('expiration', expiration);
      localStorage.setItem('refreshToken', refreshToken);

      // Update token state
      setToken(token);
      setExpiration(expiration);
      setRefreshToken(refreshToken);
    } 
    catch (error) 
    {
      console.error('refresh error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setExpiration(null);
    setRefreshToken(null);
  };

  const getToken = () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      return storedToken;
    }

    return null;
  };

  return {getToken, login, logout, refresh}
};

export default useAuthService;
