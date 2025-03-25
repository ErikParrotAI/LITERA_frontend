// src/components/HomeEl/HeroBlock/HeroBlock.tsx
import React from 'react';
import styles from './HeroBlock.module.scss';

const HeroBlock: React.FC = () => {
    return (
        <section className={styles.heroSection}>
            <div className={styles.overlay}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Ласкаво просимо до LITERA!</h1>
                    <p className={styles.heroSubtitle}>
                        Зануртеся у світ книжок, де кожна сторінка – нова історія, а кожна історія – нове відкриття.
                    </p>
                    <blockquote className={styles.quote}>
                        «Читання – це вікно у невичерпний світ ідей.»
                    </blockquote>
                    <div className={styles.quoteAuthor}>(с) О.Довженко</div>
                </div>
            </div>
        </section>
    );
};

export default HeroBlock;