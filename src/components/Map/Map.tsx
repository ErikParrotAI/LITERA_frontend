// src/components/Map/Map.tsx
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { FeatureCollection, Feature } from '../../hooks/useLocations';
import styles from './Map.module.scss';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFybC1rYXJreCIsImEiOiJjbTM4ajBzMWcwcThxMmxyNjJsem0yend3In0.Y3IxtbjjnT5nSpfgZyR9ZQ';

interface MapProps {
    geojson: FeatureCollection;
    onMarkerHover: (feature: Feature, point: { x: number; y: number }) => void;
    onMarkerLeave: () => void;
}

const Map: React.FC<MapProps> = ({ geojson, onMarkerHover, onMarkerLeave }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [24.030, 49.839],
            zoom: 11.9,
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

            // Завантажуємо іконку з публічної директорії (public/icon.jpg)
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
        });

        return () => {
            map.remove();
        };
    }, [geojson, onMarkerHover, onMarkerLeave]);

    // Оновлення даних у джерелі при зміні geojson
    useEffect(() => {
        if (mapRef.current && mapRef.current.getSource('locations')) {
            const source = mapRef.current.getSource('locations') as mapboxgl.GeoJSONSource;
            source.setData(geojson);
        }
    }, [geojson]);

    return <div ref={mapContainerRef} className={styles.mapContainer} />;
};

export default Map;