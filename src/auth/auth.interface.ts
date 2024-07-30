import { Types } from 'mongoose';

export interface IUserFields {
	_id: Types.ObjectId;
	email: string;
	isAdmin: boolean;
}

export interface ITokenPair {
	accessToken: string;
	refreshToken: string;
}

export interface AuthResponse extends ITokenPair {
	user: IUserFields;
}

export type TAuthRole = 'admin' | 'user' | undefined;
