import React, { useEffect, useState } from 'react';
import styles from './BookDetail.module.scss';
import { useParams } from 'react-router-dom';
import { useBooks } from '../../hooks/useBooks';
import { Book } from '../../interfaces/IBook';
import Map from '../../components/Map/Map'; // Import the Map component
import { FeatureCollection } from '../../hooks/useLocations'; // Import FeatureCollection type

interface BookDetailProps {
    bookId?: number;
}

const BookDetail: React.FC<BookDetailProps> = () => {
    const { id } = useParams<{ id: string }>();
    const { data: books, isLoading, error } = useBooks({ search: id });
    const [geojson, setGeojson] = useState<FeatureCollection | null>(null);

    useEffect(() => {
        if (books && id) {
            const book = books.find(b => b.id === parseInt(id ?? '0'));
            if (book) {
                // Example: Fetch or define geojson data related to the book
                const fetchedGeojson: FeatureCollection = {
                    type: 'FeatureCollection',
                    feautres: book.location || [], // Replace with actual location data
                };
                setGeojson(fetchedGeojson);
            }
        }
    }, [books, id]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading book details</div>;

    const book: Book | undefined = books?.find(b => b.id === parseInt(id ?? '0'));
    if (!book) {
        return <div>Book not found</div>;
    }

    return (
        <div className={styles.bookDetailContainer}>
            <div className={styles.bookInfo}>
                <h1 className={styles.title}>{book.name}</h1>
                <h2 className={styles.author}>By {book.authors.map(author => author.full_name).join(', ')}</h2>
                <p className={styles.details}>Published in {book.year_of_publication}, Language: {book.language},
                    Pages: {book.number_of_pages}</p>
                <p className={styles.categories}>Categories: {book.categories.map(category => category.name).join(', ')}</p>
            </div>

            {/* Add the Map component on the right side */}
            {geojson && (
                <div className={styles.mapContainer}>
                    <Map
                        geojson={geojson}
                        onMarkerHover={() => {}}
                        onMarkerLeave={() => {}}
                    />
                </div>
            )}
        </div>
    );
};

export default BookDetail;