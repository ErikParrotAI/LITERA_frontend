// src/components/BooksFilters/BooksFilters.tsx
import React, { useState, useEffect } from 'react';
import styles from './BooksFilters.module.scss';
import { IBookQueryParams } from '../../hooks/useBooks';

interface IBooksFiltersProps {
    initialParams?: IBookQueryParams;
    onChange: (params: IBookQueryParams) => void;
}

const BooksFilters: React.FC<IBooksFiltersProps> = ({ initialParams, onChange }) => {
    const [search, setSearch] = useState(initialParams?.search || '');
    const [minYear, setMinYear] = useState<number | undefined>(initialParams?.min_year);
    const [maxYear, setMaxYear] = useState<number | undefined>(initialParams?.max_year);
    const [minPages, setMinPages] = useState<number | undefined>(initialParams?.min_pages);
    const [maxPages, setMaxPages] = useState<number | undefined>(initialParams?.max_pages);
    const [ordering, setOrdering] = useState<string>(initialParams?.ordering || '');

    useEffect(() => {
        const delay = setTimeout(() => {
            onChange({
                search: search || undefined,
                min_year: minYear,
                max_year: maxYear,
                min_pages: minPages,
                max_pages: maxPages,
                ordering: ordering || undefined,
            });
        }, 300);

        return () => clearTimeout(delay);
    }, [search, minYear, maxYear, minPages, maxPages, ordering, onChange]);

    return (
        <div className={styles.filtersContainer}>
            <div className={styles.filterGroup}>
                <label>Пошук:</label>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Введіть назву/автора/..."
                />
            </div>

            <div className={styles.filterGroup}>
                <label>Рік від:</label>
                <input
                    type="number"
                    value={minYear || ''}
                    onChange={(e) => setMinYear(e.target.value ? Number(e.target.value) : undefined)}
                />

                <label>Рік до:</label>
                <input
                    type="number"
                    value={maxYear || ''}
                    onChange={(e) => setMaxYear(e.target.value ? Number(e.target.value) : undefined)}
                />
            </div>

            <div className={styles.filterGroup}>
                <label>Сторінок від:</label>
                <input
                    type="number"
                    value={minPages || ''}
                    onChange={(e) => setMinPages(e.target.value ? Number(e.target.value) : undefined)}
                />

                <label>Сторінок до:</label>
                <input
                    type="number"
                    value={maxPages || ''}
                    onChange={(e) => setMaxPages(e.target.value ? Number(e.target.value) : undefined)}
                />
            </div>

            <div className={styles.filterGroup}>
                <label>Сортування:</label>
                <select value={ordering} onChange={(e) => setOrdering(e.target.value)}>
                    <option value="">(без сортування)</option>
                    <option value="name">Назва (А-Я)</option>
                    <option value="-name">Назва (Я-А)</option>
                    <option value="year_of_publication">Рік (за зростанням)</option>
                    <option value="-year_of_publication">Рік (за спаданням)</option>
                    <option value="number_of_pages">Сторінок (за зростанням)</option>
                    <option value="-number_of_pages">Сторінок (за спаданням)</option>
                </select>
            </div>
        </div>
    );
};

export default BooksFilters;