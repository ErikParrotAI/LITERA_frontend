// src/pages/BooksPage/BooksPage.tsx
import React, { useState, useCallback } from 'react';
import styles from './BooksPage.module.scss';
import { List, Spin, message } from 'antd';
import { Book } from '../../interfaces/IBook';
import BookCard from '../../components/BookCard/BookCard';
import BooksFilters from '../../components/BooksFilters/BooksFilters';
import { IBookQueryParams, useBooks } from '../../hooks/useBooks';
import { useNavigate } from 'react-router-dom';

const BooksPage: React.FC = () => {
    const [queryParams, setQueryParams] = useState<IBookQueryParams>({});
    const navigate = useNavigate();

    const { data: books, isLoading, isError } = useBooks(queryParams);

    // Обробка змін фільтрів
    const handleFiltersChange = useCallback((params: IBookQueryParams) => {
        setQueryParams(params);
    }, []);

    const handleBookClick = (bookId: number) => {
        navigate(`/books/${bookId}`);
    };

    if (isError) {
        message.error('Не вдалося завантажити список книг');
    }

    return (
        <div className={styles.pageContainer}>
            <BooksFilters onChange={handleFiltersChange} />

            {/*<h1 className={styles.header}>Список книг</h1>*/}

            {isLoading ? (
                <Spin size="large" style={{ display: 'block', margin: '2rem auto' }} />
            ) : (
                <List
                    className={styles.listContainer}
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={books || []}
                    renderItem={(book: Book) => (
                        <List.Item className={styles.listItem} key={book.id} onClick={() => handleBookClick(book.id)}>
                            <BookCard book={book} />
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};

export default BooksPage;