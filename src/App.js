import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  Navigation from './components/NavBar/Navbar.jsx'
import Home from './pages/Home/Home.jsx';
import Post from './pages/post/Post.jsx';


const App = () => {

  return <>
    <Navigation></Navigation>

    <Router>
      <Routes>
          <Route path="" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Post" element={<Post />} />
      </Routes>
    </Router>
    
  </>;
};

export default App;
