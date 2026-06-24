import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { emitSessionExpired } from "./authEvents";

const API_URL = (Constants.expoConfig?.extra?.apiUrl as string)
  ?? "http://localhost:3333/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
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

  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      await AsyncStorage.multiRemove(["@proestoque:token", "@proestoque:user"]);
      emitSessionExpired();
    }

    const mensagem =
      error.response?.data?.erro ??
      (error.code === "ECONNABORTED" ? "Tempo de conexão esgotado" : "Erro de conexão");

    return Promise.reject(new Error(mensagem));
  }
);