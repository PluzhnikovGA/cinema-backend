import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from '../user.model';

type TUserData = keyof UserModel;

export const User = createParamDecorator(
	(data: TUserData, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();
		const user = request.user;

		return data ? user[data] : user;
	}
);
