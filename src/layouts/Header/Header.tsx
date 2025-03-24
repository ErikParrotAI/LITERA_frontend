import React from 'react';
import { useUser } from '../../hooks/useUser';
import { useLogout } from '../../hooks/useAuth';
import { Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styles from './Header.module.scss';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
    activeTab?: string;
    // Можливо, ви будете передавати "activeTab" з MainLayout чи деінде
}

const Header: React.FC<HeaderProps> = () => {
    const { user, isLoading } = useUser();
    const navigate = useNavigate();
    const location = useLocation(); // Можна визначати активну вкладку за поточним шляхом
    const { mutate: logout } = useLogout();

    const userMenuItems = [
        { key: 'profile', label: 'Профіль' },
        { key: 'settings', label: 'Налаштування' },
        { key: 'logout', label: 'Вийти' },
    ];

    const handleMenuClick = (info: { key: string }) => {
        if (info.key === 'logout') logout();
        else if (info.key === 'profile') navigate('/profile');
        else if (info.key === 'settings') navigate('/settings');
    };

    const handleAuthClick = (authType: 'login' | 'register') => {
        navigate(`/?auth=${authType}`);
    };

    // Можна визначити активну вкладку за location.pathname (як альтернатива – через activeTab)
    const isActive = (path: string) => {
        return location.pathname === path ? styles.activeLink : '';
    };

    return (
        <header className={styles.headerContainer}>
            <div className={styles.logo}>LITERA</div>
            <nav className={styles.navLinks}>
                <Link to="/" className={isActive('/')}>Головна</Link>
                <Link to="/locations" className={isActive('/locations')}>Локації</Link>
                <Link to="/books" className={isActive('/books')}>Книги</Link>
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
                        <Button onClick={() => handleAuthClick('login')} className={styles.authButton}>
                            Увійти
                        </Button>
                        <Button onClick={() => handleAuthClick('register')} className={styles.authButtonOutline}>
                            Зареєструватися
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;