import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../api/axiosInstance';
import { IUser } from '../interfaces/IUser';

const fetchUser = async (): Promise<IUser> => {
    const { data } = await axiosInstance.get<IUser>('/accounts/users/me/');
    return data;
};

export const useUser = () => {
    const token = useAuthStore((state) => state.token);
    return useQuery<IUser, Error>({
        queryKey: ['me'],
        queryFn: fetchUser,
        staleTime: 5 * 60 * 1000, // 5 хвилин
        refetchOnWindowFocus: true,
        enabled: !!token,
    });
};