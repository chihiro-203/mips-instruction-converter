import axios from 'axios';

// Create an Axios instance with your base URL and any default settings
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  // baseURL: 'https://143l4x27-8000.asse.devtunnels.ms/', // Change to server link to public
  headers: {
    'Content-Type': 'application/json', 
  },
  timeout: 10000, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle response errors
    return Promise.reject(error);
  }
);

export default axiosInstance;