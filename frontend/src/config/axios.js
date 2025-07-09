import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Configure axios defaults globally
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.timeout = 10000; // 10 seconds
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Request interceptor for debugging
axios.interceptors.request.use(
    (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for debugging
axios.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
        return Promise.reject(error);
    }
);

export default axios;