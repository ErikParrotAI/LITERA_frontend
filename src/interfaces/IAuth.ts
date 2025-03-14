import { IUser } from './IUser';

export interface ICredentials {
    email: string;
    password: string;
}

export interface IAuthResponse {
    accessToken: string;
    refreshToken?: string;
    user: IUser;
}