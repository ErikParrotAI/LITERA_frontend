import React, { useState, FormEvent } from 'react';
import { useLogin } from '../../../hooks/useAuth.ts';
import styles from './forms.module.scss';

const LoginForm: React.FC = () => {
    // @ts-ignore
    const { mutate: login, isLoading, error } = useLogin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Будь ласка, заповніть усі поля');
            return;
        }
        login({ email, password });
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
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Входження...' : 'Увійти'}
            </button>
            {error && <div className={styles.error}>Помилка: {error.message}</div>}
        </form>
    );
};

export default LoginForm;