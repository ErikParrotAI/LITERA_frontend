// src/components/BookListPanel/BookListPanel.tsx
import React from 'react';
import { Book } from '../../interfaces/IBook';
import styles from './BookListPanel.module.scss';
import { useNavigate } from 'react-router-dom'; // Додано імпорт

interface BookListPanelProps {
    books: Book[];
    locationName: string;
    onClose: () => void;
}

const BookListPanel: React.FC<BookListPanelProps> = ({ books, locationName, onClose }) => {
    const navigate = useNavigate(); // Додано хук

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h2>Книги – {locationName}</h2>
                <button className={styles.closeButton} onClick={onClose}>
                    Закрити
                </button>
            </div>
            <div className={styles.content}>
                {books && books.length > 0 ? (
                    books.map((book) => (
                        <div
                            key={book.id}
                            className={styles.bookItem}
                            onClick={() => navigate(`/books/${book.id}`)} // Додано рядок
                        >
                            <h4>{book.name}</h4>
                            <p>Автор(и): {book.authors.map(a => a.full_name).join(', ')}</p>
                            <p>Рік: {book.year_of_publication}</p>
                            <p>Сторінок: {book.number_of_pages}</p>
                        </div>
                    ))
                ) : (
                    <p>Книжок не знайдено.</p>
                )}
            </div>
        </div>
    );
};

export default BookListPanel;