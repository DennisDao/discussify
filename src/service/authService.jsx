import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useAuthService = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState();
  const [expiration, setExpiration] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [userId, setUserId] = useState();
  const [avatar, setAvatar] = useState();

  const login = async (username, password) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        email: username,
        password: password,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

      debugger;

      var response = await fetch(
        "http://localhost:6819/api/Auth/login",
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const data = await response.json();
      setUserInfo(data);

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (email, firstname, lastname, password) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      debugger;
      const raw = JSON.stringify({
        email: email,
        firstName: firstname,
        lastName: lastname,
        password: password,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

      var response = await fetch(
        "http://localhost:6819/api/Accounts/Register",
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const refresh = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        token: localStorage.getItem("token"),
        refreshToken: localStorage.getItem("refreshToken"),
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

      var response = await fetch(
        "http://localhost:6819/api/Auth/Refresh",
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to refresh");
      }

      console.log("Token refreshed!");

      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      console.error("refresh error:", error);
      throw error;
    }
  };

  const setUserInfo = (data) => {
    debugger;
    localStorage.setItem("token", data?.token);
    localStorage.setItem("expiration", data?.expiration);
    localStorage.setItem("refreshToken", data?.refreshToken);
    localStorage.setItem("firstName", data?.firstName);
    localStorage.setItem("lastName", data?.lastName);
    localStorage.setItem("userId", data?.userId);
    localStorage.setItem("avatar", data?.avatar);

    setToken(data?.token);
    setExpiration(data?.expiration);
    setRefreshToken(data?.refreshToken);
    setFirstName(data?.firstName);
    setLastName(data?.lastName);
    setUserId(data?.userId);
    setAvatar(data?.avatar);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setExpiration(null);
    setRefreshToken(null);
    setFirstName(null);
    setLastName(null);
    setUserId(null);
    setAvatar(null);

    navigate("/Login");
  };

  const getToken = () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      return storedToken;
    }

    return null;
  };

  const getUserName = () => {
    let firstName = localStorage.getItem("firstName");
    let lastName = localStorage.getItem("lastName");
    return `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName
      .charAt(0)
      .toUpperCase()}`;
  };

  const getAvatar = () => {
    let avatar = localStorage.getItem("avatar");
    return avatar;
  };

  const getUserId = () => {
    let userId = localStorage.getItem("userId");
    return userId;
  };

  return {
    getToken,
    login,
    register,
    logout,
    refresh,
    getUserName,
    getAvatar,
    getUserId,
  };
};

export default useAuthService;
