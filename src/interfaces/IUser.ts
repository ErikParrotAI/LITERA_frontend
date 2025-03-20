export interface IUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;

    phone_number?: string;

    x_link?: URL | null;
    instagram_link?: URL | null;
    telegram_link?: URL | null;
    facebook_link?: URL | null;

    avatar_url?: string;
}