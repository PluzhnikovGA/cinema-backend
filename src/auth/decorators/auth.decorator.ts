import { applyDecorators, UseGuards } from '@nestjs/common';
import { TAuthRole } from '../auth.interface';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { OnlyAdminGuard } from '../guards/admin.guard';

export const Auth = (role: TAuthRole = 'user') =>
	applyDecorators(
		role === 'admin'
			? UseGuards(JWTAuthGuard, OnlyAdminGuard)
			: UseGuards(JWTAuthGuard)
	);
