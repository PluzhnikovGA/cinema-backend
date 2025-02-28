import {
	ArgumentMetadata,
	BadRequestException,
	PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';

export class IdValidationPipe implements PipeTransform {
	transform(value: string) {
		if (!Types.ObjectId.isValid(value))
			throw new BadRequestException('Invalid format id');

		return new Types.ObjectId(value);
	}
}
