// src/layouts/MainLayout/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './MainLayout.module.scss';

const MainLayout: React.FC = () => {
    return (
        <div className={styles.layoutContainer}>
            <Header />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;