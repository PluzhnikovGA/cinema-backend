import { IsMongoId, IsNumber, Max, Min } from 'class-validator';

export class SetRatingDto {
	@IsMongoId()
	movieId: string;

	@IsNumber()
	@Min(0)
	@Max(5)
	value: number;
}
