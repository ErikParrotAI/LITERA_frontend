import React, { useEffect, useState } from 'react';
import styles from './BookDetail.module.scss';
import { useParams } from 'react-router-dom';
import Map from '../../components/Map/Map';
import { FeatureCollection, Feature } from '../../hooks/useLocations';
import { useBook } from '../../hooks/useBook';

// Додаємо location_id до FeatureProperties (якщо ще не додано)
declare module '../../hooks/useLocations' {
    interface FeatureProperties {
        location_id: number;
    }
}

const BookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const bookId = parseInt(id || '0');
    const { data: book, isLoading, error } = useBook(bookId);
    const [geojson, setGeojson] = useState<FeatureCollection | null>(null);

    useEffect(() => {
        if (book?.location) {
            const feature: Feature = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [book.location.longitude, book.location.latitude]
                },
                properties: {
                    name: book.location.name,
                    address: '', // Обов'язкові поля з FeatureProperties
                    work_schedule: '',
                    instagram_link: null,
                    location_id: book.location.id // Тепер дозволено
                }
            };

            const fetchedGeojson: FeatureCollection = {
                type: 'FeatureCollection',
                features: [feature]
            };
            setGeojson(fetchedGeojson);
        }
    }, [book]);


    if (isLoading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error loading book details</div>;
    if (!book) return <div className={styles.error}>Book not found</div>;

    return (
        <div className={styles.bookDetailContainer}>
            <div className={styles.bookInfo}>
                <h1 className={styles.title}>{book.name}</h1>
                <h2 className={styles.author}>
                    By {book.authors.map(author => author.full_name).join(', ')}
                </h2>
                <p className={styles.details}>
                    Published in {book.year_of_publication},
                    Language: {book.language},
                    Pages: {book.number_of_pages}
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
                        onMarkerHover={() => {}}
                        onMarkerLeave={() => {}}
                        singleBookMode={true}
                    />
                </div>
            )}
        </div>
    );
};

export default BookDetail;