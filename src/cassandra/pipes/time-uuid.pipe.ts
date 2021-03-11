import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { isUuid, uuid } from '../orm';

export class TimeUuidPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): any {
    if (isUuid(value)) {
      return value;
    }
    if (!(typeof value === 'string')) {
      return value;
    }
    try {
      return uuid(value);
    } catch (error) {
      throw new BadRequestException(`${error.mean}`);
    }
  }
}
