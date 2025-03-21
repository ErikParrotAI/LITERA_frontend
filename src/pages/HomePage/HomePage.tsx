// src/pages/HomePage/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import QuoteBlock from '../../components/HomeEl/QuoteBlock/QuoteBlock';
import InfoBlock from '../../components/HomeEl/InfoBlock/InfoBlock';
import AuthSidebar from '../../components/HomeEl/AuthSidebar/AuthSidebar';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './HomePage.module.scss';

const HomePage: React.FC = () => {
    const { user } = useUser();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const authMode = searchParams.get('auth'); // очікуємо "login" або "register"
    const [showSidebar, setShowSidebar] = useState<boolean>(false);

    // Відкривати sidebar, якщо є параметр auth
    useEffect(() => {
        if (authMode) {
            setShowSidebar(true);
        } else {
            setShowSidebar(false);
        }
    }, [authMode]);

    // Автоматично закривати sidebar, якщо користувач авторизувався
    useEffect(() => {
        if (user && showSidebar) {
            setShowSidebar(false);
            navigate('/'); // видаляємо параметр auth із URL
        }
    }, [user, showSidebar, navigate]);

    return (
        <div className={styles.homeContainer}>
            <div className={styles.leftContent}>
                <QuoteBlock />
                <InfoBlock />
            </div>
            {showSidebar && (
                <AuthSidebar
                    onClose={() => {
                        setShowSidebar(false);
                        navigate('/'); // видаляємо параметр "auth" із URL
                    }}
                    initialMode={authMode === 'register' ? 'register' : 'login'}
                />
            )}
        </div>
    );
};

export default HomePage;