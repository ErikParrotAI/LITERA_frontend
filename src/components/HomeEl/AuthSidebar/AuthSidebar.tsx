// src/pages/AuthSidebar/AuthSidebar.tsx
import React, { useState } from 'react';
import LoginForm from './LoginForm.tsx';
import RegisterForm from './RegisterForm.tsx';
import styles from './AuthSidebar.module.scss';

type AuthMode = 'login' | 'register';

const AuthSidebar: React.FC = () => {
    const [authMode, setAuthMode] = useState<AuthMode>('login');

    const switchToLogin = () => {
        setAuthMode('login');
    };

    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.tabs}>
                <button
                    className={authMode === 'login' ? styles.activeTab : ''}
                    onClick={() => setAuthMode('login')}
                >
                    Авторизація
                </button>
                <button
                    className={authMode === 'register' ? styles.activeTab : ''}
                    onClick={() => setAuthMode('register')}
                >
                    Реєстрація
                </button>
            </div>

            {authMode === 'login' ? (
                <LoginForm />
            ) : (
                <RegisterForm switchToLogin={switchToLogin} />
            )}
        </div>
    );
};

export default AuthSidebar;