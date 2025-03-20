import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axiosInstance from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { IUser } from '../interfaces/IUser';

type UpdateUserData = Partial<IUser>;
type PasswordResponse = { detail: string };
type PasswordData = { oldPassword: string; newPassword: string };

const fetchUser = async (): Promise<IUser> => {
    const { data } = await axiosInstance.get<IUser>('/accounts/users/me/');
    return data;
};

export const useUser = () => {
    const token = useAuthStore((state) => state.token);
    const queryClient = useQueryClient();

    const userQuery = useQuery<IUser, AxiosError>({
        queryKey: ['me'],
        queryFn: fetchUser,
        enabled: Boolean(token),
        staleTime: 60 * 60 * 1000,
        refetchOnWindowFocus: true,
    });

    const updateUserMutation = useMutation<IUser, AxiosError, UpdateUserData>({
        mutationFn: async (updatedData) => {
            const { data } = await axiosInstance.patch<IUser>('/accounts/users/update_info/', updatedData);
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['me'], data);
            alert('Дані користувача оновлено успішно!');
        },
        onError: (error) => {
            const serverError = error.response?.data as { detail?: string };
            if (serverError?.detail) {
                alert(serverError.detail);
            } else {
                alert('Помилка при оновленні даних'); // or 'Помилка при зміні пароля'
            }
        },
    });

    const changePasswordMutation = useMutation<PasswordResponse, AxiosError, PasswordData>({
        mutationFn: async ({ oldPassword, newPassword }) => {
            const { data } = await axiosInstance.post('/accounts/users/change_password/', {
                old_password: oldPassword,
                new_password: newPassword,
            });
            return data; // data має містити { detail: 'Пароль успішно змінено.' } або подібне
        },
        onSuccess: (data) => {
            alert(data.detail); // 'Пароль успішно змінено.'
        },
        onError: (error) => {
            const serverError = error.response?.data as { detail?: string };
            if (serverError?.detail) {
                alert(serverError.detail);
            } else {
                alert('Помилка при зміні пароля');
            }
        },
    });

    return {
        user: userQuery.data,
        isLoading: userQuery.isLoading,
        isError: userQuery.isError,
        isSuccess: userQuery.isSuccess,
        refetch: userQuery.refetch,
        updateUser: updateUserMutation.mutate,
        updateUserAsync: updateUserMutation.mutateAsync,
        changePassword: changePasswordMutation.mutate,
        changePasswordAsync: changePasswordMutation.mutateAsync,
    };
};