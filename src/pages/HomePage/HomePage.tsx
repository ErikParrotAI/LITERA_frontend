import React from 'react';
import { useUser } from '../../hooks/useUser';
import AuthSidebar from '../../components/HomeEl/AuthSidebar/AuthSidebar';
import QuoteBlock from '../../components/HomeEl/QuoteBlock/QuoteBlock';
import InfoBlock from '../../components/HomeEl/InfoBlock/InfoBlock';
import styles from './HomePage.module.scss';

const HomePage: React.FC = () => {
    const { data: user, isLoading } = useUser();

    return (
        <div className={styles.homeContainer}>
            <div className={styles.leftContent}>
                <QuoteBlock />
                <InfoBlock />
            </div>
            {(!user && !isLoading) && (
                <div className={styles.rightSidebar}>
                    <AuthSidebar />
                </div>
            )}
        </div>
    );
};

export default HomePage;
