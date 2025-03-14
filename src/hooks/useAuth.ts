import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { ICredentials, IAuthResponse } from '../interfaces/IAuth';
import { useAuthStore } from '../store/authStore';

export const useLogin = () => {
    const setToken = useAuthStore((state) => state.setToken);
    const queryClient = useQueryClient();

    return useMutation<IAuthResponse, Error, ICredentials>({
        mutationFn: async (credentials) => {
            const { data } = await axiosInstance.post<IAuthResponse>('/accounts/login/', credentials);
            return data;
        },
        onSuccess: (data) => {
            // Зберігаємо токен
            setToken(data.accessToken);
            // Зберігаємо refreshToken, щоб його можна було використовувати при logout
            localStorage.setItem('refreshToken', <string>data.refreshToken);
            // Можемо оновити кеш користувача, якщо потрібно
            queryClient.setQueryData(['me'], data.user);
        },
    });
};

export const useLogout = () => {
    const logout = useAuthStore((state) => state.logout);
    const queryClient = useQueryClient();

    return useMutation<void, Error, void>({
        mutationFn: async () => {
            const refreshToken = localStorage.getItem('refreshToken');
            await axiosInstance.post('/accounts/logout/', { refresh: refreshToken });
        },
        onSuccess: () => {
            logout();
            // @ts-ignore
            queryClient.removeQueries(['me']);
            localStorage.removeItem('refreshToken');
        },
    });
};