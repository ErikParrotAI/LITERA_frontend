import React from 'react';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footerContainer}>
            <div className={styles.socialLinks}>
                <a href="https://x.com" target="_blank" rel="noreferrer">X</a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                <a href="https://telegram.org" target="_blank" rel="noreferrer">Telegram</a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            </div>
            <p className={styles.copyright}>
                © 2025 LITERA. Всі права захищено.
            </p>
        </footer>
    );
};

export default Footer;