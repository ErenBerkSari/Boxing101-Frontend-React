import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    const response = await axiosInstance.post("/auth/refresh");
    return response.data; // Yeni access token'ı içeren response dönecek
  } catch (error) {
    console.error("Token yenileme başarısız:", error);
    throw error;
  }
};

// Axios interceptor (Yanıt hata aldığında access token'ı yenile)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshAccessToken();
        return axiosInstance(originalRequest); // Yeni token ile isteği tekrar dene
      } catch (refreshError) {
        console.error("Yenileme hatası:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
