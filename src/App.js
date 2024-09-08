import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Post from "./pages/post/Post.jsx";
import QuickSearch from "./pages/QuickSearch/QuickSearch.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import PrivateRoutes from "./components/ProtectedRoute/ProtectedRoute.jsx";
import Author from "./pages/Author/Author.jsx";
import AuthorTest from "./pages/Author/AuthorTest.jsx";
import Profile from "./pages/Profile/Profile.jsx";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/author" element={<Author />} />
            <Route path="/authorTest" element={<AuthorTest />} />
            <Route path="/quicksearch" element={<QuickSearch />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
