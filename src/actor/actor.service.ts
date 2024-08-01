import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ActorModel } from './actor.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { ActorDto } from './dto/actor.dto';

@Injectable()
export class ActorService {
	constructor(
		@InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>
	) {}

	async bySlug(slug: string) {
		const actor = await this.ActorModel.findOne({ slug }).exec();

		if (!actor) throw new NotFoundException('Actor not found');

		return actor;
	}

	async getAll(searchTerm?: string) {
		let options = {};

		if (searchTerm)
			options = {
				$or: [
					{ name: new RegExp(searchTerm, 'i') },
					{ slug: new RegExp(searchTerm, 'i') },
				],
			};

		return this.ActorModel.aggregate()
			.match(options)
			.lookup({
				from: 'Movie',
				localField: '_id',
				foreignField: 'actors',
				as: 'movies',
			})
			.addFields({ countMovies: { $size: '$movies' } })
			.project({ updateAt: 0, __v: 0, movies: 0 })
			.sort({ createdAt: 'asc' })
			.exec();
	}

	async byId(_id: string) {
		const actor = await this.ActorModel.findById(_id).exec();

		if (!actor) throw new NotFoundException('Actor not found');

		return actor;
	}

	async create() {
		const defaultValue: ActorDto = {
			name: '',
			slug: '',
			photo: '',
		};

		const actor = await this.ActorModel.create(defaultValue);

		return actor._id;
	}

	async update(_id: string, dto: ActorDto) {
		const updateActor = await this.ActorModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec();

		if (!updateActor) throw new NotFoundException('Actor not found');

		return updateActor;
	}

	async delete(_id: string) {
		const deleteActor = await this.ActorModel.findByIdAndDelete(_id).exec();

		if (!deleteActor) throw new NotFoundException('Actor not found');

		return deleteActor;
	}
}
