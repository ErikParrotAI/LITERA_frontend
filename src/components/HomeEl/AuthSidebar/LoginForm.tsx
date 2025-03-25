import React, { useState, FormEvent } from 'react';
import { useLogin } from '../../../hooks/useAuth.ts';
import styles from './forms.module.scss';

interface LoginFormProps {
    onSuccess: () => void; // Callback to close the sidebar
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const { mutate: login, isPending } = useLogin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setErrorMessage('Будь ласка, заповніть усі поля');
            return;
        }
        login({ email, password }, {
            onError: (error) => {
                setErrorMessage(parseError(error));
            },
            onSuccess: () => {
                onSuccess();
            }
        });
    };

    const parseError = (error: unknown): string => {
        if (typeof error === 'object' && error !== null && 'response' in error) {
            const axiosError = error as { response?: { status: number; statusText: string; } };
            const { status } = axiosError.response || {};
            if (status === 400) {
                return 'Невірний email або пароль.';
            } else if (status === 500) {
                return 'Внутрішня помилка сервера (500).';
            } else {
                return 'Невідома помилка сервера.';
            }
        }
        return 'Помилка з’єднання з сервером.';
    };

    return (
        <form className={styles.authForm} onSubmit={handleSubmit}>
            <h2>Увійти</h2>
            <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                required
            />
            {errorMessage && <div className={styles.error}>{errorMessage}</div>}

            <button type="submit" disabled={isPending}>
                {isPending ? 'Авторизація...' : 'Увійти'}
            </button>
        </form>
    );
};

export default LoginForm;
