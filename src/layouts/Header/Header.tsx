import React from 'react';
import { useUser } from '../../hooks/useUser';
import { useLogout } from '../../hooks/useAuth';
import { Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styles from './Header.module.scss';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const { data: user, isLoading } = useUser();
    const navigate = useNavigate();
    const { mutate: logout } = useLogout();

    const userMenuItems = [
        { key: 'profile', label: 'Профіль' },
        { key: 'settings', label: 'Налаштування' },
        { key: 'logout', label: 'Вийти' },
    ];

    const handleMenuClick = (info: { key: string }) => {
        if (info.key === 'logout') {
            logout();
        } else if (info.key === 'profile') {
            navigate('/profile');
        } else if (info.key === 'settings') {
            navigate('/settings');
        }
    };

    return (
        <div className={styles.headerContainer}>
            <div className={styles.logo}>LITERA</div>
            <div className={styles.nav}>
                <Link to="/">Головна</Link>
                <Link to="/locations">Локації</Link>
                <Link to="/books">Книги</Link>
            </div>
            <div className={styles.userSection}>
                {isLoading ? (
                    <span>Завантаження...</span>
                ) : user ? (
                    <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} trigger={['hover']}>
                        <Button type="text" style={{ color: '#fff' }}>
                            {user?.username ?? 'Ваш акаунт'} <DownOutlined />
                        </Button>
                    </Dropdown>
                ) : (
                    <>
                        <Button
                            type="primary"
                            onClick={() => navigate('/')}
                            style={{ marginRight: 8 }}
                        >
                            Увійти
                        </Button>
                        <Button onClick={() => navigate('/')}>
                            Зареєструватися
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;