// src/pages/AuthSidebar/RegisterForm.tsx
import React, { useState } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import styles from './forms.module.scss';
import { message } from 'antd';

interface RegisterValues {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface RegisterFormProps {
    switchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ switchToLogin }) => {
    const [values, setValues] = useState<RegisterValues>({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (
            !values.username.trim() ||
            !values.firstName.trim() ||
            !values.lastName.trim() ||
            !values.email.trim() ||
            !values.password.trim() ||
            !values.confirmPassword.trim()
        ) {
            setErrorMessage('Будь ласка, заповніть усі поля');
            return;
        }
        if (values.password !== values.confirmPassword) {
            setErrorMessage('Паролі не співпадають');
            return;
        }
        if (values.password.length < 8) {
            setErrorMessage('Мінімальна довжина пароля – 8 символів');
            return;
        }

        setLoading(true);

        try {
            // Виклик API для реєстрації (POST /api/users/)
            await axiosInstance.post('/accounts/users/', {
                username: values.username,
                first_name: values.firstName,
                last_name: values.lastName,
                email: values.email,
                password: values.password,
            });
            message.success('Реєстрація успішна! Тепер увійдіть.');
            // Після успішної реєстрації перемикаємо вкладку на "login"
            switchToLogin();
        } catch (error: unknown) {
            setErrorMessage(parseError(error));
        } finally {
            setLoading(false);
        }
    };

    const parseError = (error: unknown): string => {
        if (typeof error === 'object' && error !== null && 'response' in error) {
            const axiosError = error as { response?: { status: number; statusText: string; }; };
            const { status } = axiosError.response || {};
            if (status === 404) {
                return 'Маршрут /users/ не знайдено (404).';
            } else if (status === 400) {
                return 'Некоректні дані. Можливо, користувач з таким email вже існує.';
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
            <h2>Зареєструватися</h2>

            <input
                name="username"
                type="text"
                placeholder="Нікнейм"
                value={values.username}
                onChange={handleChange}
            />

            <div className={styles.flexRow}>
                <div>
                    <input style={{width: '100%'}}
                        name="firstName"
                        type="text"
                        placeholder="Ім'я"
                        value={values.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input style={{width: '100%'}}
                        name="lastName"
                        type="text"
                        placeholder="Прізвище"
                        value={values.lastName}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <input
                name="email"
                type="email"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
            />

            <input
                name="password"
                type="password"
                placeholder="Пароль (мін. 8 символів)"
                value={values.password}
                onChange={handleChange}
            />

            <input
                name="confirmPassword"
                type="password"
                placeholder="Повторіть пароль"
                value={values.confirmPassword}
                onChange={handleChange}
            />
            {errorMessage && <div className={styles.error}>{errorMessage}</div>}

            <button type="submit" disabled={loading}>
                {loading ? 'Завантаження...' : 'Зареєструватися'}
            </button>
        </form>
    );
};

export default RegisterForm;