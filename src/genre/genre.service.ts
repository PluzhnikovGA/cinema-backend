import { Injectable, NotFoundException } from '@nestjs/common';
import { GenreModel } from './genre.model';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateGenreDto } from './dto/createGenre.dto';

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>
	) {}

	async bySlug(slug: string) {
		const genre = await this.GenreModel.findOne({ slug });

		if (!genre) throw new NotFoundException('Genre not found');

		return genre;
	}

	async getAll(searchTerm?: string) {
		let options = {};

		if (searchTerm)
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i'),
					},
					{
						slug: new RegExp(searchTerm, 'i'),
					},
					{
						description: new RegExp(searchTerm, 'i'),
					},
				],
			};

		return this.GenreModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.exec();
	}

	/* Admin place */

	async byId(_id: string) {
		const genre = await this.GenreModel.findById(_id);

		if (!genre) throw new NotFoundException('Genre not found');

		return genre;
	}

	async create() {
		const defaultValue: CreateGenreDto = {
			name: '',
			slug: '',
			description: '',
			icon: '',
		};

		const genre = await this.GenreModel.create(defaultValue);

		return genre._id;
	}

	async update(_id: string, dto: CreateGenreDto) {
		const updateGenre = this.GenreModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec();

		if (!updateGenre) throw new NotFoundException('Genre not found');

		return updateGenre;
	}

	async delete(_id: string) {
		const deleteGenre = this.GenreModel.findByIdAndDelete(_id).exec();

		if (!deleteGenre) throw new NotFoundException('Genre not found');

		return deleteGenre;
	}
}
