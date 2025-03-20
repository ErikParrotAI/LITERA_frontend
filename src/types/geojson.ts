export interface FeatureProperties {
    name: string;
    address: string;
    work_schedule: string;
    instagram_link: string | null;
}

export interface Geometry {
    type: "Point";
    coordinates: [number, number];
}

export interface Feature {
    type: "Feature";
    properties: FeatureProperties;
    geometry: Geometry;
}

export interface FeatureCollection {
    type: "FeatureCollection";
    features: Feature[];
}