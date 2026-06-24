import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = __DEV__
  ? "http://192.168.100.68:3333/api"
  : "https://sua-api-em-producao.com/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@proestoque:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Tratamento de sessão expirada será implementado na próxima aula
    }
    return Promise.reject(error);
  }
);