import { createContext, useContext, useState } from "react"
import Home from '../pages/Home/Home.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes from '../components/ProtectedRoute/ProtectedRoute.jsx';
import Login from '../pages/Login/Login.jsx'
import Post from '../pages/post/Post.jsx';

const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = () => {

  const [token, setToken] = useState();

  const login = async (username, password) => {

    try {
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
          redirect: "follow"
        };

      var response = await fetch("http://localhost:6819/api/Auth/login", requestOptions)

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();
      const { token } = data;

      // Set token in local storage or cookies
      localStorage.setItem('token', token);

      // Update token state
      setToken(token);

      return token;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const getToken = () => {
    const storedToken = localStorage.getItem('token');
    // Update token state if token is found
    if (storedToken) {
      setToken(storedToken);
      return storedToken;
    }

    return null;
  };

  return  (
    <AuthContext.Provider value={{getToken, login, logout}}>

      <Router>
        <Routes>
            <Route element={<PrivateRoutes/>}>
                <Route path='/' element={<Home/>} />
                <Route path='/Home' element={<Home/>} />
                <Route path="/Post" element={<Post />} />
            </Route>
            <Route path="/Login" element={<Login />} />   
        </Routes>
      </Router>

    </AuthContext.Provider>
  )
};

