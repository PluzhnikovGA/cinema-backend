import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { CreateGenreDto } from './dto/createGenre.dto';

@Controller('genre')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Get('by-slug/:slug')
	@HttpCode(200)
	async bySlug(@Param('slug') slug: string) {
		return this.genreService.bySlug(slug);
	}

	@Get()
	@HttpCode(200)
	async getAll(@Query('searchTerm') searchTerm: string) {
		return this.genreService.getAll(searchTerm);
	}

	@Get('collections')
	@HttpCode(200)
	async getCollections() {
		return this.genreService.getCollections();
	}

	@Get(':id')
	@HttpCode(200)
	@Auth('admin')
	async getById(@Param('id') id: string) {
		return this.genreService.byId(id);
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.genreService.create();
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateGenreDto
	) {
		return this.genreService.update(id, dto);
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id', IdValidationPipe) id: string) {
		return this.genreService.delete(id);
	}
}
