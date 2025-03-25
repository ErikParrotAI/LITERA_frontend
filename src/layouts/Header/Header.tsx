import React, { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { useLogout } from '../../hooks/useAuth';
import { Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthSidebar from '../../components/HomeEl/AuthSidebar/AuthSidebar';
import styles from './Header.module.scss';

const Header: React.FC = () => {
    const { user, isLoading } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const { mutate: logout } = useLogout();

    const userMenuItems = [
        { key: 'profile', label: 'Профіль' },
        { key: 'settings', label: 'Налаштування' },
        { key: 'logout', label: 'Вийти' },
    ];

    const handleMenuClick = (info: { key: string }) => {
        switch (info.key) {
            case 'logout':
                logout();
                break;
            case 'profile':
                navigate('/profile');
                break;
            case 'settings':
                navigate('/settings');
                break;
            default:
                break;
        }
    };

    const [showSidebar, setShowSidebar] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

    const handleSidebarToggle = (authType: 'login' | 'register') => {
        setAuthMode(authType);
        setShowSidebar(!showSidebar);
    };

    return (
        <header className={styles.headerContainer}>
            <div className={styles.logo}>LITERA</div>
            <nav className={styles.navLinks}>
                <Link to="/" className={location.pathname === '/' ? styles.activeLink : ''}>Головна</Link>
                <Link to="/locations" className={location.pathname === '/locations' ? styles.activeLink : ''}>Локації</Link>
                <Link to="/books" className={location.pathname === '/books' ? styles.activeLink : ''}>Книги</Link>
            </nav>
            <div className={styles.authControls}>
                {isLoading ? (
                    <span className={styles.loadingText}>Завантаження...</span>
                ) : user ? (
                    <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} trigger={['hover']}>
                        <Button type="text" className={styles.dropdownBtn}>
                            {user.username ?? 'Ваш акаунт'} <DownOutlined />
                        </Button>
                    </Dropdown>
                ) : (
                    <>
                        <Button onClick={() => handleSidebarToggle('login')} className={styles.authButton}>
                            Увійти
                        </Button>
                        <Button onClick={() => handleSidebarToggle('register')} className={styles.authButtonOutline}>
                            Зареєструватися
                        </Button>
                    </>
                )}
            </div>
            {showSidebar && (
                <AuthSidebar
                    onClose={() => setShowSidebar(false)}
                    initialMode={authMode}
                />
            )}
        </header>
    );
};

export default Header;
