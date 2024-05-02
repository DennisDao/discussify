import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Post from './pages/post/Post.jsx';
import PrivateRoutes from './components/ProtectedRoute/ProtectedRoute.jsx';
import Login from './pages/Login/Login.jsx'
import { AuthWrapper } from './service/authService.jsx';




const App = () => {
  return <>
    <AuthWrapper>
      <Router>
        <Routes>
            <Route element={<PrivateRoutes/>}>
                <Route path='/' element={<Home/>} />
                <Route path="/Post" element={<Post />} />
            </Route>
            <Route path="/Login" element={<Login />} />   
        </Routes>
      </Router>
    </AuthWrapper>
  </>;
};

export default App;
