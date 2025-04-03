import React from 'react';
import styles from './BookCard.module.scss';

/** Локальні типи (без глобального інтерфейсу) */
interface Author {
    full_name: string;
}

interface Book {
    id: number;
    name: string;
    authors: Author[];
    year_of_publication: number;
    number_of_pages: number;
}

interface BookCardProps {
    book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
    const authorsList = book.authors.map(a => a.full_name).join(', ');

    // Можливі фон-зображення
    const backgroundImages = [
        '/bg_image3.jpg',
    ];
    // Випадково вибираємо одне з них
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const randomBg = backgroundImages[randomIndex];

    return (
        <div
            className={styles.card}
            /* Інлайн-стиль: підставляємо випадковий фон */
            style={{ backgroundImage: `url(${randomBg})` }}
        >
            <div className={styles.glassPanel}>
                <div className={styles.bookTitle}>{book.name}</div>
                <div className={styles.author}>{authorsList}</div>
                <div className={styles.bottomInfo}>
                    <div className={styles.year}>Рік: {book.year_of_publication}</div>
                    <div className={styles.pages}>Сторінок: {book.number_of_pages}</div>
                </div>
            </div>
        </div>
    );
};

export default BookCard;