import axios from 'axios';
import Cookies from 'js-cookie';
import { backendUrl } from '../Utils/Constanse';

// Step 1: Create an Axios instance with a base URL
const apiClient = axios.create({
  baseURL: backendUrl, // Replace with your actual base URL
  timeout: 10000, // Optional: set a timeout for requests
});

// Step 2: Function to refresh the access token
const refreshToken = async (role) => {
  console.log(role,"working")
  try {
    // Get the refresh token from cookies based on role
    let rawToken = null;
    if (role === 'admin') {
      rawToken = Cookies.get('adminTokens');
    } else if (role === 'driver') {
      rawToken = Cookies.get('DriverTokens');
    } else {
      rawToken = Cookies.get('userTokens');
    }
    
    if (!rawToken) {
      throw new Error('No token available');
    }

    const token = JSON.parse(rawToken);
    if (!token.refresh) {
      throw new Error('No refresh token available');
    }

    // Request a new access token using the refresh token
    const response = await axios.post(`${backendUrl}/Api/token/refresh/`, {
      refresh: token.refresh
    });

    const newToken = response.data;

    // Store the new tokens in cookies
    if (role === 'admin') {
      Cookies.set('adminTokens', JSON.stringify(newToken), { expires: 7 });
    } else if (role === 'driver') {

      Cookies.set('DriverTokens', JSON.stringify(newToken), { expires: 7 });
    } else {
      console.log(newToken,'token')
      Cookies.set('userTokens', JSON.stringify(newToken), { expires: 7 });
    }

    return newToken.access; // Return the new access token
  } catch (error) {
    console.error('Failed to refresh token', error);
    throw error;
  }
};

// Step 3: Axios request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const role = config.meta ? config.meta.role : null;
    let rawToken = null;
    console.log(role)
    if (role === 'admin') {
      rawToken = Cookies.get('adminTokens');
    } else if (role === 'driver') {
      rawToken = Cookies.get('DriverTokens');
    } else {
      rawToken = Cookies.get('userTokens');
    }

    if (rawToken) {
      const token = JSON.parse(rawToken);
      config.headers['Authorization'] = `Bearer ${token.access}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Step 3: Axios response interceptor for handling token refresh
apiClient.interceptors.response.use(
  (response) => response,
  
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const role = originalRequest.meta ? originalRequest.meta.role : null;
        if (!role) {
          throw new Error('Role is not defined');
        }
        const newAccessToken = await refreshToken(role);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
