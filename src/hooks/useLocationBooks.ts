// src/hooks/useLocationBooks.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export interface Author {
    id: number;
    full_name: string;
}

export interface Book {
    id: number;
    name: string;
    authors: Author[];
    year_of_publication: number;
    number_of_pages: number;
}

const fetchLocationBooks = async (locationId: number): Promise<Book[]> => {
    const { data } = await axiosInstance.get<Book[]>('/library/books/', {
        params: { location_id: locationId },
    });
    return data;
};

export function useLocationBooks(locationId: number | null) {
    return useQuery<Book[], Error>({
        queryKey: ['locationBooks', locationId],
        queryFn: () => {
            if (!locationId) return Promise.resolve([]);
            return fetchLocationBooks(locationId);
        },
        enabled: locationId !== null, // Запит робиться тільки якщо локація є
        staleTime: 60 * 1000,
    });
}