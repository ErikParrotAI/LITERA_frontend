export interface IUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;

    phone_number?: string;

    x_link?: URL;
    instagram_link?: URL;
    telegram_link?: URL;
    facebook_link?: URL;

    avatar_url?: string;
}