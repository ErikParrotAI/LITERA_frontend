// src/hooks/useBook.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { Book } from '../interfaces/IBook';

const fetchBook = async (id: number): Promise<Book> => {
    const { data } = await axiosInstance.get<Book>(`/library/books/${id}/`);
    return data;
};

export function useBook(id: number) {
    return useQuery<Book, Error>({
        queryKey: ['book', id],
        queryFn: () => fetchBook(id),
    });
}