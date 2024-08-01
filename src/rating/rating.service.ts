import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { RatingModel } from './rating.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { MovieService } from 'src/movie/movie.service';
import { SetRatingDto } from './dto/setRating.dto';
import { Types } from 'mongoose';

@Injectable()
export class RatingService {
	constructor(
		@InjectModel(RatingModel)
		private readonly RatingModel: ModelType<RatingModel>,
		private readonly movieService: MovieService
	) {}

	async getMovieValueByUser(movieId: string, userId: string) {
		return this.RatingModel.findOne({ movieId, userId })
			.select('value')
			.exec()
			.then((data) => (data ? data.value : 0));
	}

	async averageRatingByMovie(movieId: string) {
		const ratingsMovie: RatingModel[] = await this.RatingModel.aggregate()
			.match({
				movieId: new Types.ObjectId(movieId),
			})
			.exec();

		return (
			ratingsMovie.reduce((acc, item) => acc + item.value, 0) /
			ratingsMovie.length
		);
	}

	async setRating(userId: string, dto: SetRatingDto) {
		const { movieId, value } = dto;

		const newRating = await this.RatingModel.findOneAndUpdate(
			{ movieId, userId },
			{
				movieId,
				userId,
				value,
			},
			{
				new: true,
				upsert: true,
				setDefaultsOnInsert: true,
			}
		).exec();

		const averageRating = await this.averageRatingByMovie(movieId);

		const res = await this.movieService.updateRating(movieId, averageRating);

		return newRating;
	}
}
