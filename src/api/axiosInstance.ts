import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

// Додаємо токен до заголовків
axiosInstance.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Обробка помилок (наприклад, 401)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Наприклад, можна викликати метод виходу з системи
            useAuthStore.getState().logout();
            // Перенаправлення на сторінку входу або показ повідомлення
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;