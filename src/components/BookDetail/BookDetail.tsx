import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Map from '../../components/Map/Map';
import InfoPopup from '../../components/InfoPopup/InfoPopup';
import styles from './BookDetail.module.scss';
import { useBook, } from '../../hooks/useBook';
import { useBooks } from '../../hooks/useBooks';
import { Feature, FeatureCollection } from '../../hooks/useLocations';

const BookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const bookId = parseInt(id || '0');
    const { data: book, isLoading, error } = useBook(bookId);

    // Стан для інформаційного попапу при onHover
    const [hoveredFeature, setHoveredFeature] = useState<Feature | null>(null);
    const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
    const hidePopupTimeout = useRef<number | null>(null);

    // Завантаження "супутніх" книг за назвою (book.name)
    const { data: relatedBooks = [] } = useBooks(
        { search: book?.name || '' },
        { enabled: !!book }
    );

    // Формування GeoJSON з отриманих книг (тільки з локацією)
    const geojson = useMemo<FeatureCollection | null>(() => {
        if (!relatedBooks || relatedBooks.length === 0) return null;
        const features = relatedBooks
            .filter(b => b.location)
            .map(b => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [b.location.longitude, b.location.latitude]
                },
                properties: {
                    name: b.location.name,
                    address: b.location.address, // Якщо потрібно, можна заповнити
                    work_schedule: b.location.work_schedule,
                    instagram_link: b.location.instagram_link,
                    location_id: b.location.id,
                    bookId: b.id, // для додаткової інформації, якщо потрібно
                }
            }));
        return { type: 'FeatureCollection', features };
    }, [relatedBooks]);

    // Callback для наведення на маркер
    const handleMarkerHover = useCallback((feature: Feature, point: { x: number; y: number }) => {
        if (hidePopupTimeout.current) {
            clearTimeout(hidePopupTimeout.current);
            hidePopupTimeout.current = null;
        }
        setHoveredFeature(feature);
        setPopupPosition({ x: point.x + 610  , y: point.y - 80 });
    }, []);

    // Callback для відведення курсора від маркера з невеликим затриманням
    const handleMarkerLeave = useCallback(() => {
        hidePopupTimeout.current = window.setTimeout(() => {
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

    if (isLoading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error loading book details.</div>;
    if (!book) return <div className={styles.error}>Book not found.</div>;

    return (
        <div className={styles.bookDetailContainer}>
            <div className={styles.bookInfo}>
                <h1 className={styles.title}>{book.name}</h1>
                <h2 className={styles.author}>
                    By {book.authors.map(author => author.full_name).join(', ')}
                </h2>
                <p className={styles.details}>
                    Published in {book.year_of_publication}, Language: {book.language}, Pages: {book.number_of_pages}
                </p>
                {book.categories?.length > 0 && (
                    <p className={styles.categories}>
                        Categories: {book.categories.map(category => category.name).join(', ')}
                    </p>
                )}
            </div>

            {geojson && (
                <div className={styles.mapContainer}>
                    <Map
                        geojson={geojson}
                        onMarkerHover={handleMarkerHover}
                        onMarkerLeave={handleMarkerLeave}
                        singleBookMode={false}
                    />
                </div>
            )}

            {/* Відображення інфопопапу при наведенні */}
            {hoveredFeature && popupPosition && (
                <InfoPopup
                    feature={hoveredFeature}
                    position={popupPosition}
                    onPopupEnter={handlePopupEnter}
                    onPopupLeave={handlePopupLeave}
                />
            )}
        </div>
    );
};

export default BookDetail;