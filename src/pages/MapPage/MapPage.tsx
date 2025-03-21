// src/pages/MapPage/MapPage.tsx
import React, { useState, useCallback } from 'react';
import { Spin, message } from 'antd';
import SearchBar from '../../components/SearchBar/SearchBar';
import Map from '../../components/Map/Map';
import InfoPopup from '../../components/InfoPopup/InfoPopup';
import BookListPanel from '../../components/BookListPanel/BookListPanel';
import { useLocations, Feature, LocationQueryParams } from '../../hooks/useLocations';
import styles from './MapPage.module.scss';

const MapPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [hoveredFeature, setHoveredFeature] = useState<Feature | null>(null);
    const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
    const [selectedLocationName, setSelectedLocationName] = useState<string>('');
    const [showBookList, setShowBookList] = useState(false);

    const hidePopupTimeout = React.useRef<NodeJS.Timeout | null>(null);

    // Завантаження локацій із бекенду з параметром пошуку
    const params: LocationQueryParams = { search: searchQuery };
    const { data: geojson, isLoading, isError } = useLocations(params);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const handleMarkerHover = useCallback((feature: Feature, point: { x: number; y: number }) => {
        if (hidePopupTimeout.current) {
            clearTimeout(hidePopupTimeout.current);
            hidePopupTimeout.current = null;
        }
        setHoveredFeature(feature);
        setPopupPosition(point);
    }, []);

    const handleMarkerLeave = useCallback(() => {
        hidePopupTimeout.current = setTimeout(() => {
            setHoveredFeature(null);
            setPopupPosition(null);
        }, 300);
    }, []);

    // Callback для when user hovers over popup itself – скидаємо таймаут
    const handlePopupEnter = useCallback(() => {
        if (hidePopupTimeout.current) {
            clearTimeout(hidePopupTimeout.current);
            hidePopupTimeout.current = null;
        }
    }, []);

    // При відведенні курсора від popup – сховуємо його
    const handlePopupLeave = useCallback(() => {
        setHoveredFeature(null);
        setPopupPosition(null);
    }, []);

    // Коли користувач натискає "Список книг" у popup
    const handleShowBookList = useCallback((locName: string, locId: number) => {
        setSelectedLocationName(locName);
        setSelectedLocationId(locId);
        setShowBookList(true);
    }, []);

    const handleCloseBookList = useCallback(() => {
        setShowBookList(false);
        setSelectedLocationId(null);
        setSelectedLocationName('');
    }, []);

    if (isError) {
        message.error('Не вдалося завантажити локації');
    }

    return (
        <div className={styles.pageContainer}>
            <SearchBar onSearch={handleSearch} />

            <div className={styles.contentContainer}>
                {isLoading ? (
                    <Spin size="large" className={styles.spinner} />
                ) : geojson ? (
                    <Map
                        geojson={geojson}
                        onMarkerHover={handleMarkerHover}
                        onMarkerLeave={handleMarkerLeave}
                    />
                ) : null}

                {showBookList && (
                    <BookListPanel
                        locationId={selectedLocationId}
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