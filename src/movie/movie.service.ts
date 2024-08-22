import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { MovieModel } from './movie.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UpdateMovieDto } from './dto/updateMovie.dto';
import { Types } from 'mongoose';

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>
	) {}

	async bySlug(slug: string) {
		const movie = await this.MovieModel.findOne({ slug })
			.populate('actors genres')
			.exec();

		if (!movie) throw new NotFoundException('Movie not found');

		return movie;
	}

	async byActor(actorId: string) {
		const movies = await this.MovieModel.find({ actors: actorId }).exec();

		if (!movies) throw new NotFoundException('Movies not found');

		return movies;
	}

	async byGenres(genreIds: string[] | Types.ObjectId[]) {
		const movies = await this.MovieModel.find({
			genres: { $in: genreIds },
		}).exec();

		if (!movies) throw new NotFoundException('Movies not found');

		return movies;
	}

	async updateCountOpened(slug: string) {
		const updateCountOpened = await this.MovieModel.findOneAndUpdate(
			{ slug },
			{ $inc: { countOpened: 1 } },
			{ new: true }
		).exec();

		if (!updateCountOpened) throw new NotFoundException('Movie not found');

		return updateCountOpened;
	}

	async getAll(searchTerm: string) {
		let options = {};

		if (searchTerm)
			options = {
				$or: [{ title: new RegExp(searchTerm, 'i') }],
			};

		return await this.MovieModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.populate('actors genres')
			.exec();
	}

	async getMostPopular() {
		return await this.MovieModel.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: 'desc' })
			.populate('genres')
			.exec();
	}

	async updateRating(id: string, newRating: number) {
		return this.MovieModel.findByIdAndUpdate(
			id,
			{
				rating: newRating,
			},
			{ new: true }
		).exec();
	}

	/* Admin */
	async byId(_id: string) {
		const movie = await this.MovieModel.findById(_id);

		if (!movie) throw new NotFoundException('Movie not found');

		return movie;
	}

	async create() {
		const defaultValue: UpdateMovieDto = {
			poster: '',
			bigPoster: '',
			title: '',
			slug: '',
			videoUrl: '',
			genres: [],
			actors: [],
		};

		const movie = await this.MovieModel.create(defaultValue);
		return movie._id;
	}

	async updateMovie(_id: string, dto: UpdateMovieDto) {
		const updateMovie = await this.MovieModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec();

		if (!updateMovie) throw new NotFoundException('Movie not found');

		return updateMovie;
	}

	async delete(_id: string) {
		const deleteMovie = await this.MovieModel.findByIdAndDelete(_id).exec();

		if (!deleteMovie) throw new NotFoundException('Movie not found');

		return deleteMovie;
	}
}
