import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/user.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { SetRatingDto } from './dto/setRating.dto';

@Controller('rating')
export class RatingController {
	constructor(private readonly ratingService: RatingService) {}

	@Get(':movieId')
	@Auth()
	async getMovieValueByUser(
		@Param('movieId', IdValidationPipe) movieId: string,
		@User('_id') _id: string
	) {
		return this.ratingService.getMovieValueByUser(movieId, _id);
	}

	@UsePipes(new ValidationPipe())
	@Post('set-rating')
	@HttpCode(200)
	@Auth()
	async setRating(@User('_id') _id: string, @Body() dto: SetRatingDto) {
		return this.ratingService.setRating(_id, dto);
	}
}
