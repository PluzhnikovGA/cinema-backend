import { IsArray, IsMongoId } from 'class-validator';

export class GenreIdsDto {
	@IsArray()
	@IsMongoId({ each: true })
	genresIds: string[];
}
