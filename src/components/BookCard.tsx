// src/components/BookCard.tsx
import React from 'react';
import { Card } from 'antd';

export interface Author {
    full_name: string;
}

export interface Book {
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
    return (
        <Card title={book.name}>
            <p>
                <strong>Автор(и): </strong>
                {book.authors.map((author) => author.full_name).join(', ')}
            </p>
            <p>
                <strong>Рік видання: </strong>
                {book.year_of_publication}
            </p>
            <p>
                <strong>Сторінок: </strong>
                {book.number_of_pages}
            </p>
        </Card>
    );
};

export default BookCard;