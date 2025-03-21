// src/components/BookListPanel/BookListPanel.tsx
import React from 'react';
import { useLocationBooks } from '../../hooks/useLocationBooks';
import styles from './BookListPanel.module.scss';

interface BookListPanelProps {
    locationId: number | null;
    locationName: string;
    onClose: () => void;
}

const BookListPanel: React.FC<BookListPanelProps> = ({ locationId, locationName, onClose }) => {
    const { data: books, isLoading } = useLocationBooks(locationId);

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h2>Книги – {locationName}</h2>
                <button className={styles.closeButton} onClick={onClose}>
                    Закрити
                </button>
            </div>
            {isLoading ? (
                <p>Завантаження...</p>
            ) : (
                <div className={styles.content}>
                    {books && books.length > 0 ? (
                        books.map((book) => (
                            <div key={book.id} className={styles.bookItem}>
                                <h4>{book.name}</h4>
                                <p>Автор(и): {book.authors.map(a => a.full_name).join(', ')}</p>
                                <p>Рік: {book.year_of_publication}</p>
                                <p>Сторінок: {book.number_of_pages}</p>
                            </div>
                        ))
                    ) : (
                        <p>Немає книг для цієї локації.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookListPanel;