// src/components/Map/Map.tsx
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { FeatureCollection, Feature } from '../../hooks/useLocations';
import InfoPopup from '../InfoPopup/InfoPopup';
import styles from './Map.module.scss';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFybC1rYXJreCIsImEiOiJjbTM4ajBzMWcwcThxMmxyNjJsem0yend3In0.Y3IxtbjjnT5nSpfgZyR9ZQ';

interface MapProps {
    geojson: FeatureCollection;
    onMarkerHover: (feature: Feature, point: { x: number; y: number }) => void;
    onMarkerLeave: () => void;
    singleBookMode?: boolean;
}

const Map: React.FC<MapProps> = ({
                                     geojson,
                                     onMarkerHover,
                                     onMarkerLeave,
                                     singleBookMode = false,
                                 }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [popupFeature, setPopupFeature] = useState<Feature | null>(null);
    const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center:
                singleBookMode && geojson.features[0]?.geometry?.coordinates
                    ? [
                        geojson.features[0].geometry.coordinates[0],
                        geojson.features[0].geometry.coordinates[1],
                    ]
                    : [24.030, 49.839],
            zoom: singleBookMode ? 14 : 11.9,
        });
        mapRef.current = map;

        map.addControl(new mapboxgl.NavigationControl());
        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: { enableHighAccuracy: true },
                trackUserLocation: true,
            })
        );

        map.on('load', () => {
            map.addSource('locations', {
                type: 'geojson',
                data: geojson,
            });

            // Завантаження іконки маркера з публічної директорії
            map.loadImage('/marker512.png', (error, image) => {
                if (error) throw error;
                if (image && !map.hasImage('location-icon')) {
                    map.addImage('location-icon', image);
                }

                map.addLayer({
                    id: 'locations-layer',
                    type: 'symbol',
                    source: 'locations',
                    layout: {
                        'icon-image': 'location-icon',
                        'icon-size': 0.1,
                        'icon-anchor': 'bottom',
                    },
                });
            });

            // Якщо режим singleBookMode увімкнено, автоматично показуємо InfoPopup для першої локації
            if (singleBookMode && geojson.features.length > 0) {
                const firstFeature = geojson.features[0];
                // Використовуємо map.project для отримання піксельних координат цієї локації
                const point = map.project({
                    lng: firstFeature.geometry.coordinates[0],
                    lat: firstFeature.geometry.coordinates[1],
                });
                setPopupFeature(firstFeature);
                setPopupPosition({ x: point.x + 1000  , y: point.y - 1000 });
            }

            // Події для взаємодії з маркерами (для звичайного режиму)
            map.on('mouseenter', 'locations-layer', (e) => {
                map.getCanvas().style.cursor = 'pointer';
                if (e.features && e.features.length > 0) {
                    const feature = e.features[0] as unknown as Feature;
                    onMarkerHover(feature, { x: e.point.x, y: e.point.y });
                }
            });

            map.on('mouseleave', 'locations-layer', () => {
                map.getCanvas().style.cursor = '';
                onMarkerLeave();
            });

            if (!singleBookMode) {
                // У звичайному режимі (не для книги) можна додатково налаштувати click-обробку тощо
                map.on('click', 'locations-layer', (e) => {
                    map.getCanvas().style.cursor = 'pointer';
                    if (e.features && e.features.length > 0) {
                        const feature = e.features[0] as unknown as Feature;
                        onMarkerHover(feature, { x: e.point.x, y: e.point.y });
                    }
                });
            }
        });

        return () => {
            map.remove();
        };
    }, [geojson, onMarkerHover, onMarkerLeave, singleBookMode]);

    // Оновлення даних у джерелі при зміні geojson
    useEffect(() => {
        if (mapRef.current && mapRef.current.getSource('locations')) {
            const source = mapRef.current.getSource('locations') as mapboxgl.GeoJSONSource;
            source.setData(geojson);
        }
    }, [geojson]);

    return (
        <div ref={mapContainerRef} className={styles.mapContainer}>
            {/* Рендеримо InfoPopup, якщо popupFeature і popupPosition встановлені */}
            {popupFeature && popupPosition && (
                <InfoPopup
                    feature={popupFeature}
                    position={popupPosition}
                    onShowBookList={() => {}}
                    onPopupEnter={() => {}}
                    onPopupLeave={() => {}}
                />
            )}
        </div>
    );
};

export default Map;
