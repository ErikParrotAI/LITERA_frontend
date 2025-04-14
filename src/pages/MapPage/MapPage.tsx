import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import BooksFilters from '../../components/BooksFilters/BooksFilters';
import Map from '../../components/Map/Map';
import BookListPanel from '../../components/BookListPanel/BookListPanel';
import InfoPopup from '../../components/InfoPopup/InfoPopup';
import { useBooks, IBookQueryParams } from '../../hooks/useBooks';
import { useLocations, Feature, FeatureCollection } from '../../hooks/useLocations';
import { Book } from '../../interfaces/IBook';
import styles from './MapPage.module.scss';

const MapPage: React.FC = () => {
    // Стан для глобальних фільтрів книг
    const [search, setSearch] = useState<string>('');
    const [ordering, setOrdering] = useState<string>('');
    const [pagesRange, setPagesRange] = useState<[number, number]>([1, 2000]);
    const [yearsRange, setYearsRange] = useState<[number, number]>([1000, 2025]);

    // Додатковий стан для дебаунсу пошуку (для карти)
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 1000); // 1500 мс дебаунс
        return () => clearTimeout(timer);
    }, [search]);

    // Стан для "ховерного" feature (для попапу)
    const [hoveredFeature, setHoveredFeature] = useState<Feature | null>(null);
    const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
    const hidePopupTimeout = useRef<number | null>(null);

    // Стан для вибраної локації
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

    // Параметри фільтра для useBooks
    const bookQueryParams: IBookQueryParams = {
        search: search || undefined,
        ordering: ordering || undefined,
        min_pages: pagesRange[0],
        max_pages: pagesRange[1],
        min_year: yearsRange[0],
        max_year: yearsRange[1],
    };

    // Отримуємо глобально відфільтровані книги
    const {
        data: books = [],
        isLoading: booksLoading,
        isError: booksIsError,
    } = useBooks(bookQueryParams);

    // Завантаження гео-даних локацій з використанням дебаунс-пошуку
    const {
        data: locationsGeoJSON,
        isLoading: locLoading,
        isError: locIsError,
    } = useLocations({ search: debouncedSearch || undefined });

    // Обчислюємо множину унікальних location_id з відфільтрованих книг
    const filteredLocationIds = useMemo(() => {
        const ids = new Set<number>();
        books.forEach((book: Book) => {
            if (book.location?.id) {
                ids.add(book.location.id);
            }
        });
        return ids;
    }, [books]);

    // Фільтруємо geoJSON-дані локацій, залишаючи лише ті, що містять location_id із відфільтрованих книг
    const filteredGeoJSON = useMemo<FeatureCollection | null>(() => {
        if (!locationsGeoJSON) return null;
        const filteredFeatures = locationsGeoJSON.features.filter((feature) =>
            filteredLocationIds.has((feature.properties as unknown as { location_id: number }).location_id)
        );
        return { ...locationsGeoJSON, features: filteredFeatures };
    }, [locationsGeoJSON, filteredLocationIds]);

    // Обчислюємо список книг для вибраної локації
    const booksForSelectedLocation = useMemo(() => {
        if (!selectedLocationId) return [];
        return books.filter((book) => book.location?.id === selectedLocationId);
    }, [books, selectedLocationId]);

    // Назва вибраної локації (для заголовка в BookListPanel)
    const selectedLocationName = useMemo(() => {
        if (!selectedLocationId || !locationsGeoJSON) return '';
        const feature = locationsGeoJSON.features.find(
            (f) => (f.properties as unknown as { location_id: number }).location_id === selectedLocationId
        );
        return feature ? (feature.properties as unknown as { name: string }).name : '';
    }, [selectedLocationId, locationsGeoJSON]);

    // Callback для наведення на маркер
    const handleMarkerHover = useCallback((feature: Feature, point: { x: number; y: number }) => {
        if (hidePopupTimeout.current) {
            clearTimeout(hidePopupTimeout.current);
            hidePopupTimeout.current = null;
        }
        setHoveredFeature(feature);
        setPopupPosition(point);
    }, []);

    // Callback для відведення курсора від маркера
    const handleMarkerLeave = useCallback(() => {
        hidePopupTimeout.current = setTimeout(() => {
            setHoveredFeature(null);
            setPopupPosition(null);
        }, 300);
    }, []);

    const handlePopupEnter = useCallback(() => {
        if (hidePopupTimeout.current) {
            clearTimeout(hidePopupTimeout.current);
            hidePopupTimeout.current = null;
        }
    }, []);

    const handlePopupLeave = useCallback(() => {
        setHoveredFeature(null);
        setPopupPosition(null);
    }, []);

    // Callback для відкриття списку книг (при натисканні в попапі)
    const handleShowBookList = useCallback((_locationName: string, locationId: number) => {
        setSelectedLocationId(locationId);
    }, []);

    // Callback для закриття панелі книг
    const handleCloseBookList = useCallback(() => {
        setSelectedLocationId(null);
    }, []);

    const [pendingParams, setPendingParams] = useState<IBookQueryParams>(bookQueryParams);

    return (
        <div className={styles.pageContainer}>
            {/* Фільтри книг */}
            <BooksFilters
                initialParams={bookQueryParams}
                showSubmitButton={true}
                onChange={(newParams) => setPendingParams(newParams)}
                onSubmit={(params) => {
                    setSearch(params.search || '');
                    setOrdering(params.ordering || '');
                    setPagesRange([params.min_pages ?? 1, params.max_pages ?? 2000]);
                    setYearsRange([params.min_year ?? 1000, params.max_year ?? 2025]);
                }}
            />

            {(booksLoading || locLoading) && <p>Завантаження...</p>}
            {(booksIsError || locIsError) && <p>Помилка при завантаженні даних.</p>}
            {/*<div className={styles.contentContainer2}>*/}
            {/*    <h2>Loading</h2>*/}
            {/*</div>*/}
            <div className={styles.contentContainer}>
                {/* Карта з відфільтрованими локаціями */}
                {filteredGeoJSON && (
                    <Map
                        geojson={filteredGeoJSON}
                        onMarkerHover={handleMarkerHover}
                        onMarkerLeave={handleMarkerLeave}
                    />
                )}

                {/* Панель зі списком книг для вибраної локації */}
                {selectedLocationId && (
                    <BookListPanel
                        books={booksForSelectedLocation}
                        locationName={selectedLocationName}
                        onClose={handleCloseBookList}
                    />
                )}
            </div>

            <InfoPopup
                feature={hoveredFeature}
                position={popupPosition}
                onShowBookList={handleShowBookList}
                onPopupEnter={handlePopupEnter}
                onPopupLeave={handlePopupLeave}
            />
        </div>
    );
};

export default MapPage;