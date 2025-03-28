// src/interfaces/IBook.ts

export interface Country {
    id: number;
    name: string;
}

export interface Location {
    id: number;
    name: string;
    address: string;
    work_schedule: string;
}

export interface Author {
    id: number;
    full_name: string;
    date_of_birth: string;  // або Date, якщо конвертуєте
    country: Country | null;
}

export interface Publishing {
    id: number;
    name: string;
    country: Country | null;
}

export interface Category {
    id: number;
    name: string;
}

export interface Book {
    id: number;
    name: string;
    location: Location | null;
    authors: Author[];
    publishing: Publishing | null;
    year_of_publication: number;
    language: string;
    number_of_pages: number;
    categories: Category[];
    // cover?: string; // якщо потрібно
}