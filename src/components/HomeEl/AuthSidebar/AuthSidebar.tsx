// src/pages/AuthSidebar/AuthSidebar.tsx
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { CloseOutlined } from '@ant-design/icons';
import styles from './AuthSidebar.module.scss';

type AuthMode = 'login' | 'register';

interface AuthSidebarProps {
    onClose: () => void;
    initialMode?: AuthMode;
}

const AuthSidebar: React.FC<AuthSidebarProps> = ({ onClose, initialMode = 'login' }) => {
    const [authMode, setAuthMode] = useState<AuthMode>(initialMode);

    const switchToLogin = () => setAuthMode('login');

    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.header}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabButton} ${authMode === 'login' ? styles.activeTab : ''}`}
                        onClick={() => setAuthMode('login')}
                    >
                        Авторизація
                    </button>
                    <button
                        className={`${styles.tabButton} ${authMode === 'register' ? styles.activeTab : ''}`}
                        onClick={() => setAuthMode('register')}
                    >
                        Реєстрація
                    </button>
                </div>
                <button className={styles.closeButton} onClick={onClose}>
                    <CloseOutlined />
                </button>
            </div>
            <div className={styles.content}>
                {authMode === 'login' ? (
                    <LoginForm />
                ) : (
                    <RegisterForm switchToLogin={switchToLogin} />
                )}
            </div>
        </div>
    );
};

export default AuthSidebar;