import {
	Controller,
	HttpCode,
	Post,
	Query,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	@UseInterceptors(FilesInterceptor('files'))
	async uploadFiles(
		@UploadedFiles() files: Express.Multer.File[],
		@Query('folder') folder?: string
	) {
		return this.fileService.saveFiles(files, folder);
	}
}
