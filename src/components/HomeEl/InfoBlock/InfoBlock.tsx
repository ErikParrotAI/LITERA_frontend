// src/components/HomeEl/InfoBlock/InfoBlock.tsx
import React from 'react';
import styles from './InfoBlock.module.scss';

const InfoBlock: React.FC = () => {
    return (
        <div className={styles.infoBlock}>
            <p>Орендуйте книжки за допомогою веб-сайту або у закладі Львова.</p>
            <p>Отримайте доступ до широкого асортименту літератури, доступної для оренди як в Інтернеті, так і в наших фізичних локаціях.</p>
            <p>Легкий та зручний спосіб знайти улюблену книгу.</p>
            <p>Поверніть книгу в зручний для вас час – онлайн або в офлайн-пункті видачі.</p>
            <p>Без клопотів та зайвих витрат.</p>
        </div>
    );
};

export default InfoBlock;