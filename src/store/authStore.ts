import { create } from 'zustand';

interface AuthState {
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem('accessToken'),
    setToken: (token: string | null) => {
        if (token) {
            localStorage.setItem('accessToken', token);
        } else {
            localStorage.removeItem('accessToken');
        }
        set({ token });
    },
    logout: () => {
        localStorage.removeItem('accessToken');
        set({ token: null });
    },
}));