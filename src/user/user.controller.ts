import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@HttpCode(200)
	@Auth()
	async getProfile(@User('_id') _id: string) {
		return this.userService.byId(_id);
	}

	@Get('count')
	@HttpCode(200)
	@Auth('admin')
	async getCountUsers() {
		return this.userService.getCountUsers();
	}

	@Get()
	@HttpCode(200)
	@Auth('admin')
	async getAllUsers(@Query('searchTerm') searchTerm?: string) {
		return this.userService.getAllUsers(searchTerm);
	}

	@Get(':id')
	@HttpCode(200)
	@Auth('admin')
	async getUser(@Param('id', IdValidationPipe) id: string) {
		return this.userService.byId(id);
	}

	@UsePipes(new ValidationPipe())
	@Put('profile')
	@HttpCode(200)
	@Auth()
	async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
		return this.userService.updateProfile(_id, dto);
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async updateUser(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfile(id, dto);
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async deleteUser(@Param('id', IdValidationPipe) id: string) {
		return this.userService.deleteUser(id);
	}
}
