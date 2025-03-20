// src/hooks/useBooks.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { Book } from '../interfaces/IBook';

/**
 * Параметри для фільтрації/пошуку/сортування
 * (мають відповідати тим, що обробляються на бекенді).
 */
export interface IBookQueryParams {
    search?: string;         // пошук за всіма полями (OR)
    min_year?: number;       // рік від
    max_year?: number;       // рік до
    min_pages?: number;      // сторінок від
    max_pages?: number;      // сторінок до
    ordering?: string;       // поле сортування (наприклад: 'name', '-year_of_publication', ...)
}

/**
 * GET-запит на /library/books/ із передачею query-параметрів
 */
const fetchBooks = async (params: IBookQueryParams): Promise<Book[]> => {
    const { data } = await axiosInstance.get<Book[]>('/library/books/', {
        params,
    });
    return data;
};

/**
 * Кастомний хук для отримання списку книжок з урахуванням фільтрів і сортування
 */
export function useBooks(params: IBookQueryParams) {
    return useQuery<Book[], Error>({
        queryKey: ['books', params],
        queryFn: () => fetchBooks(params),
        keepPreviousData: true, // зберігати попередні дані під час нових запитів
    });
}