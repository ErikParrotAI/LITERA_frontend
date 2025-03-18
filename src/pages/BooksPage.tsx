// src/pages/BooksPage.tsx
import React, { useEffect } from 'react';
import { List, Spin, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import BookCard, { Book } from '../components/BookCard.tsx';

const fetchBooks = async (): Promise<Book[]> => {
    const { data } = await axiosInstance.get('/library/books/');
    return data;
};

const BooksPage: React.FC = () => {
    const { data: books, isLoading, isError } = useQuery<Book[]>({
        queryKey: ['books'],
        queryFn: fetchBooks,
    });

    // Використовуємо useEffect, щоб показати повідомлення про помилку лише один раз, коли isError стає true
    useEffect(() => {
        if (isError) {
            message.error('Не вдалося завантажити список книг');
        }
    }, [isError]);

    if (isLoading) {
        return (
            <Spin size="large" style={{ display: 'block', margin: '2rem auto' }} />
        );
    }

    if (isError || !books) {
        return null;
    }

    return (
        <div style={{padding: '1rem 2rem'}}>
            <h1 style={{ color: '#fff' }}>Список книг</h1>
            <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={books}
                renderItem={(book) => (
                    <List.Item key={book.id}>
                        <BookCard book={book} />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default BooksPage;