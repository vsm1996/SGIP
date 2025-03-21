import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
  params: {
    key: process.env.NEXT_API_KEY
  }
});

// Add response interceptor to handle canceled requests silently
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (axios.isCancel(error)) {
      // Return a rejected promise with no error message for canceled requests
      return Promise.reject();
    }
    return Promise.reject(error);
  }
);

export default apiClient;