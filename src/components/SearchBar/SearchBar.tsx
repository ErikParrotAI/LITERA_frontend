// src/components/SearchBar/SearchBar.tsx
import React, { useState, useEffect } from 'react';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(inputValue);
        }, 300);

        return () => clearTimeout(handler);
    }, [inputValue, onSearch]);

    return (
        <div className={styles.searchContainer}>
            <input
                type="text"
                placeholder="Введіть назву локації або книги..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={styles.searchInput}
                autoComplete="off"
            />
            <button type="button" className={styles.searchButton} onClick={() => onSearch(inputValue)}>
                Пошук
            </button>
        </div>
    );
};

export default SearchBar;