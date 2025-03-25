// src/pages/HomePage/HomePage.tsx
import React from 'react';

import HeroBlock from '../../components/HomeEl/HeroBlock/HeroBlock';
import InfoBlock from '../../components/HomeEl/InfoBlock/InfoBlock';

import styles from './HomePage.module.scss';

const HomePage: React.FC = () => {

    return (
        <div className={styles.homeContainer}>
            <HeroBlock />
            <div className={styles.mainContent}>
                <InfoBlock />
            </div>
        </div>
    );
};

export default HomePage;