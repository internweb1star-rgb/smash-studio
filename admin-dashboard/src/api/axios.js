import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor to handle 401s (Token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We let the App's ProtectedRoute handle redirection to avoid infinite loops
    return Promise.reject(error);
  }
);

export default api;
