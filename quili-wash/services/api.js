import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// IMPORTANTE: Si vas a probar en un celular físico, cambia localhost por la IP de tu PC
const API_URL = 'https://quili-wash-app-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
