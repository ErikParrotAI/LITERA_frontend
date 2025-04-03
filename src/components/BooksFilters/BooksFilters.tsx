import React, { useState, useEffect } from 'react';
import { Range } from 'react-range';
import styles from './BooksFilters.module.scss';
import { IBookQueryParams } from '../../hooks/useBooks';

interface IBooksFiltersProps {
    initialParams?: IBookQueryParams;
    onChange: (params: IBookQueryParams) => void;
    globalMinYear?: number;
    globalMaxYear?: number;
    globalMinPages?: number;
    globalMaxPages?: number;
}

const BooksFilters: React.FC<IBooksFiltersProps> = ({
                                                        initialParams,
                                                        onChange,
                                                        globalMinYear = 1000,
                                                        globalMaxYear = 2025,
                                                        globalMinPages = 1,
                                                        globalMaxPages = 2000,
                                                    }) => {
    // Пошук
    const [search, setSearch] = useState(initialParams?.search || '');

    // Рік [від, до]
    const [yearRange, setYearRange] = useState<[number, number]>([
        initialParams?.min_year || globalMinYear,
        initialParams?.max_year || globalMaxYear,
    ]);

    // Сторінок [від, до]
    const [pagesRange, setPagesRange] = useState<[number, number]>([
        initialParams?.min_pages || globalMinPages,
        initialParams?.max_pages || globalMaxPages,
    ]);

    // Сортування (select)
    const [ordering, setOrdering] = useState(initialParams?.ordering || '');
    const sortingOptions = [
        { label: 'Без сортування', value: '' },
        { label: 'Назва (А-Я)', value: 'name' },
        { label: 'Назва (Я-А)', value: '-name' },
        { label: 'Рік ↑', value: 'year_of_publication' },
        { label: 'Рік ↓', value: '-year_of_publication' },
        { label: 'Сторінки ↑', value: 'number_of_pages' },
        { label: 'Сторінки ↓', value: '-number_of_pages' },
    ];

    // Прапорець, чи показувати інші фільтри
    const [showFilters, setShowFilters] = useState(false);

    // Дебаунс виклику onChange
    useEffect(() => {
        const timer = setTimeout(() => {
            onChange({
                search: search || undefined,
                min_year: yearRange[0],
                max_year: yearRange[1],
                min_pages: pagesRange[0],
                max_pages: pagesRange[1],
                ordering: ordering || undefined,
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [search, yearRange, pagesRange, ordering, onChange]);

    return (
        <div className={styles.filtersContainer}>

            {/** Поле пошуку */}
            <div className={styles.searchGroup}>
                <label>Пошук</label>
                <input
                    type="text"
                    placeholder="Ключове слово..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/** Іконка-фільтр (замість кнопки) */}
            <div
                className={styles.filterIconBtn}
                onClick={() => setShowFilters(!showFilters)}
            >
                {/* Використовуємо іконку Font Awesome fa-filter як приклад */}
                <i className="fa fa-filter" aria-hidden="true" />
            </div>

            {/** Решта фільтрів */}
            <div className={showFilters ? styles.visibleFilters : styles.hiddenFilters}>

                {/** Сортування */}
                <div className={styles.sortSelectGroup}>
                    <label>Сортування</label>
                    <select
                        value={ordering}
                        onChange={(e) => setOrdering(e.target.value)}
                    >
                        {sortingOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/** Роки */}
                <div className={styles.filterGroup}>
                    <label>Роки</label>
                    <div className="inputsAndSlider">
                        <input
                            type="number"
                            value={yearRange[0]}
                            onChange={(e) =>
                                setYearRange([Number(e.target.value), yearRange[1]])
                            }
                        />
                        <input
                            type="number"
                            value={yearRange[1]}
                            onChange={(e) =>
                                setYearRange([yearRange[0], Number(e.target.value)])
                            }
                        />
                        <Range
                            step={1}
                            min={globalMinYear}
                            max={globalMaxYear}
                            values={[yearRange[0], yearRange[1]]}
                            onChange={(vals) => setYearRange([vals[0], vals[1]])}
                            renderTrack={({ props, children }) => (
                                <div {...props} className={styles.track}>
                                    {children}
                                </div>
                            )}
                            renderThumb={({ props }) => (
                                <div {...props} className={styles.thumb} />
                            )}
                        />
                    </div>
                </div>

                {/** Сторінки */}
                <div className={styles.filterGroup}>
                    <label>Сторінки</label>
                    <div className="inputsAndSlider">
                        <input
                            type="number"
                            value={pagesRange[0]}
                            onChange={(e) =>
                                setPagesRange([Number(e.target.value), pagesRange[1]])
                            }
                        />
                        <input
                            type="number"
                            value={pagesRange[1]}
                            onChange={(e) =>
                                setPagesRange([pagesRange[0], Number(e.target.value)])
                            }
                        />
                        <Range
                            step={1}
                            min={globalMinPages}
                            max={globalMaxPages}
                            values={[pagesRange[0], pagesRange[1]]}
                            onChange={(vals) => setPagesRange([vals[0], vals[1]])}
                            renderTrack={({ props, children }) => (
                                <div {...props} className={styles.track}>
                                    {children}
                                </div>
                            )}
                            renderThumb={({ props }) => (
                                <div {...props} className={styles.thumb} />
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BooksFilters;