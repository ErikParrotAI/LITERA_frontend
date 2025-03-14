declare module '*.scss' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.css' {
    const classes: Record<string, string>;
    export default classes;
}

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    // Додайте інші змінні оточення за потреби
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
