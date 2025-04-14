import React, { useState, useEffect } from 'react';
import { Range } from 'react-range';
import styles from './BooksFilters.module.scss';
import { IBookQueryParams } from '../../hooks/useBooks';

interface IBooksFiltersProps {
    initialParams?: IBookQueryParams;
    onChange: (params: IBookQueryParams) => void;
    onSubmit?: (params: IBookQueryParams) => void;
    showSubmitButton?: boolean;
    globalMinYear?: number;
    globalMaxYear?: number;
    globalMinPages?: number;
    globalMaxPages?: number;
}

const BooksFilters: React.FC<IBooksFiltersProps> = ({
                                                        initialParams,
                                                        onChange,
                                                        onSubmit,
                                                        showSubmitButton = false,
                                                        globalMinYear = 1000,
                                                        globalMaxYear = 2025,
                                                        globalMinPages = 1,
                                                        globalMaxPages = 2000,
                                                    }) => {
    const [search, setSearch] = useState(initialParams?.search || '');
    const [yearRange, setYearRange] = useState<[number, number]>([
        initialParams?.min_year || globalMinYear,
        initialParams?.max_year || globalMaxYear,
    ]);
    const [pagesRange, setPagesRange] = useState<[number, number]>([
        initialParams?.min_pages || globalMinPages,
        initialParams?.max_pages || globalMaxPages,
    ]);
    const [ordering, setOrdering] = useState(initialParams?.ordering || '');
    const [showFilters, setShowFilters] = useState(false);

    const currentParams: IBookQueryParams = {
        search: search || undefined,
        min_year: yearRange[0],
        max_year: yearRange[1],
        min_pages: pagesRange[0],
        max_pages: pagesRange[1],
        ordering: ordering || undefined,
    };

    useEffect(() => {
        if (showSubmitButton) return;
        const timer = setTimeout(() => {
            onChange(currentParams);
        }, 300);
        return () => clearTimeout(timer);
    }, [search, yearRange, pagesRange, ordering, showSubmitButton]);

    return (
        <div className={styles.filtersContainer}>
            <div className={styles.searchAndButton}>
                <div className={styles.searchGroup}>
                    <label>Пошук</label>
                    <div className={styles.searchInputWrapper}>
                        <input
                            type="text"
                            placeholder="Ключове слово..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {showSubmitButton && (
                            <button
                                className={styles.submitBtn}
                                onClick={() => onSubmit?.(currentParams)}
                            >
                                Застосувати
                            </button>
                        )}

                        <div
                            className={styles.filterIconBtn}
                            onClick={() => setShowFilters(!showFilters)}
                            title="Додаткові фільтри"
                        >
                            <i className="fa fa-filter" aria-hidden="true" />
                        </div>

                    </div>
                </div>
            </div>

            <div className={showFilters ? styles.visibleFilters : styles.hiddenFilters}>
                <div className={styles.sortSelectGroup}>
                    <label>Сортування</label>
                    <select
                        value={ordering}
                        onChange={(e) => setOrdering(e.target.value)}
                    >
                        <option value="">Без сортування</option>
                        <option value="name">Назва (А-Я)</option>
                        <option value="-name">Назва (Я-А)</option>
                        <option value="year_of_publication">Рік ↑</option>
                        <option value="-year_of_publication">Рік ↓</option>
                        <option value="number_of_pages">Сторінки ↑</option>
                        <option value="-number_of_pages">Сторінки ↓</option>
                    </select>
                </div>

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
                            values={yearRange}
                            onChange={(vals) => setYearRange([vals[0], vals[1]])}
                            renderTrack={({ props, children }) => (
                                <div {...props} className={styles.track}>{children}</div>
                            )}
                            renderThumb={({ props }) => (
                                <div {...props} className={styles.thumb} />
                            )}
                        />
                    </div>
                </div>

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
                            values={pagesRange}
                            onChange={(vals) => setPagesRange([vals[0], vals[1]])}
                            renderTrack={({ props, children }) => (
                                <div {...props} className={styles.track}>{children}</div>
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
