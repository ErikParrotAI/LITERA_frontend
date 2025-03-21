// src/hooks/useLocations.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

/**
 * Типи для GeoJSON
 */
export interface FeatureProperties {
    name: string;
    address: string;
    work_schedule: string;
    instagram_link: string | null;
}

export interface Geometry {
    type: 'Point';
    coordinates: [number, number];
}

export interface Feature {
    type: 'Feature';
    properties: FeatureProperties;
    geometry: Geometry;
}

export interface FeatureCollection {
    type: 'FeatureCollection';
    features: Feature[];
}

/**
 * Параметри пошуку / фільтра для локацій
 */
export interface LocationQueryParams {
    search?: string;
}

const fetchLocations = async (params: LocationQueryParams): Promise<FeatureCollection> => {
    // Припускаємо, що на бекенді обробляється параметр ?search=...
    const { data } = await axiosInstance.get<FeatureCollection>('/library/locations/', { params });
    return data;
};

export function useLocations(params: LocationQueryParams) {
    return useQuery<FeatureCollection, Error>({
        queryKey: ['locations', params],
        queryFn: () => fetchLocations(params),
        staleTime: 60 * 1000,
    });
}