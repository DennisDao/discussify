import { useEffect } from "react";
import axios from "axios";
import useAuthService from "../service/authService.jsx";

const useApiService = () => {
  const { refresh } = useAuthService();
  // Set the bearer token in the Authorization header for Axios requests
  const setAuthToken = (token) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const get = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };

  const post = async (url, data) => {
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const postFormData = async (url, formData) => {
    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Configure the request interceptor
    const requestInterceptor = axios.interceptors.request.use((config) => {
      // Retrieve token from local storage or any other storage mechanism
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        //config.headers["Access-Control-Allow-Origin"] = "*";
        //config.headers["Access-Control-Allow-Methods"] =
        //"PUT, GET, POST, DELETE, OPTION";
      }
      return config;
    });

    // Configure response interceptor
    const responseInterceptor = axios.interceptors.response.use(
      function (response) {
        return response;
      },
      async function (error) {
        if (error.response.status === 401) {
          console.log("Unauthorized request");
          await refresh();
          const originalRequest = error.config;
          return axios.request(originalRequest);
        }
        // Return the error
        return Promise.reject(error);
      }
    );

    // Clean up the interceptor on unmount or when token changes
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.request.eject(responseInterceptor);
    };
  }, []);

  return {
    setAuthToken,
    get,
    post,
    postFormData,
  };
};

export default useApiService;
