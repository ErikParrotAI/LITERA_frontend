import React from 'react';
import styles from './QuoteBlock.module.scss';

const QuoteBlock: React.FC = () => {
    return (
        <div className={styles.quoteContainer}>
            <h2>Твій путівник у світ книг та знань.</h2>
            <blockquote>
                Кімната без книг — все одно, що людина без душі.
            </blockquote>
            <div className={styles.author}>(с) О.Довженко</div>
        </div>
    );
};

export default QuoteBlock;