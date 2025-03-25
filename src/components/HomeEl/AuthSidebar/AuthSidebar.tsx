import React, { useState, useEffect, useRef } from 'react';
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
    const sidebarRef = useRef<HTMLDivElement | null>(null); // Ref to the sidebar container

    // Close sidebar when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const switchToLogin = () => setAuthMode('login');
    const switchToRegister = () => setAuthMode('register');

    return (
        <div className={styles.sidebarContainer} ref={sidebarRef}>
            <div className={styles.header}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabButton} ${authMode === 'login' ? styles.activeTab : ''}`}
                        onClick={switchToLogin}
                    >
                        Авторизація
                    </button>
                    <button
                        className={`${styles.tabButton} ${authMode === 'register' ? styles.activeTab : ''}`}
                        onClick={switchToRegister}
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
                    <LoginForm onSuccess={onClose} />
                ) : (
                    <RegisterForm switchToLogin={switchToLogin} onSuccess={switchToLogin} />
                )}
            </div>
        </div>
    );
};

export default AuthSidebar;
