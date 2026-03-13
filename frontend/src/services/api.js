import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Añadir token a los headers si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (usuario, contraseña) => apiClient.post('/auth/login', { usuario, contraseña }),
  verifyDNI: (dni) => apiClient.post('/auth/verify-dni', { dni }),
  completeData: (data) => apiClient.post('/auth/complete-data', data),
  googleOAuth: (data) => apiClient.post('/oauth/google', data),
  verifyGoogleToken: (token) => apiClient.post('/oauth/google/verify', { token }),
  verifyAppleToken: (token) => apiClient.post('/oauth/apple/verify', { token }),
  verifyFacebookToken: (token, userID) => apiClient.post('/oauth/facebook/verify', { token, userID })
};

export const userService = {
  getUser: (id) => apiClient.get(`/users/${id}`),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data)
};

export default apiClient;
