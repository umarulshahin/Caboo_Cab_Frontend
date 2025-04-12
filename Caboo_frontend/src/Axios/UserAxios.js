
import axios from 'axios';
import Cookies from 'js-cookie';
import { backendUrl } from '../Utils/Constanse';

const UserAxios = axios.create({
        baseURL: backendUrl, // Replace with your actual base URL
        timeout: 10000, // Optional: set a timeout for requests
    });
    
    // Step 2: Function to refresh the access token
    const refreshToken = async (role) => {
        console.log(role)
        try {
        // Get the refresh token from cookies 
        let rawToken=null
        if(role==='driver'){
            rawToken = Cookies.get('DriverTokens');
        }else{
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
            if(role==='driver'){
                Cookies.set('DriverTokens', JSON.stringify(newToken), { expires: 7 });

            }else{

                Cookies.set('userTokens', JSON.stringify(newToken), { expires: 7 });

            }
    
        return newToken.access; // Return the new access token
        } catch (error) {
        console.error('Failed to refresh token', error);
        throw error;
        }
    };
    
    // Step 3: Axios request interceptor
    UserAxios.interceptors.request.use(
        (config) => {
        const role = config.meta ? config.meta.role : null;
        let rawToken=null
        if(role==='driver'){
            rawToken = Cookies.get('DriverTokens');
        }else{
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
    UserAxios.interceptors.response.use(
        (response) => response,
        
        async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {

            const role = originalRequest.meta ? originalRequest.meta.role : null;
            const newAccessToken = await refreshToken(role);
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return UserAxios(originalRequest);
            } catch (err) {
            return Promise.reject(err);
            }
        }
        return Promise.reject(error);
        }
    );

export default UserAxios;