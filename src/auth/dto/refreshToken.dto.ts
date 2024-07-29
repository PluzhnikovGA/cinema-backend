import { IsString } from 'class-validator';

export class RefreshTokenDto {
	@IsString({
		message: "You didn't pass refresh token or it's not a string!",
	})
	refreshToken: string;
}
