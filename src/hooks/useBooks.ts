import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { Book } from '../interfaces/IBook';

export interface IBookQueryParams {
    search?: string;         // пошук за всіма полями (OR)
    min_year?: number;       // рік від
    max_year?: number;       // рік до
    min_pages?: number;      // сторінок від
    max_pages?: number;      // сторінок до
    ordering?: string;       // поле сортування (наприклад: 'name', '-year_of_publication', ...)
    location_id?: number;
}

const fetchBooks = async (params: IBookQueryParams): Promise<Book[]> => {
    const { data } = await axiosInstance.get<Book[]>('/library/books/', { params });
    return data;
};

export function useBooks(params: IBookQueryParams) {
    const options: UseQueryOptions<Book[], Error, Book[], [string, IBookQueryParams]> = {
        queryKey: ['books', params],
        queryFn: () => fetchBooks(params),
        // @ts-expect-error idk
        keepPreviousData: true, // ця властивість має бути доступною
    };
    return useQuery(options);
}