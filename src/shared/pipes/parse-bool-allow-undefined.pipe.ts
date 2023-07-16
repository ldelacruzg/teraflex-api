import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseBoolAllowUndefinedPipe implements PipeTransform {
  transform(value: string): boolean | undefined {
    if (!value) {
      return undefined;
    } else if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    } else {
      throw new BadRequestException(
        'Validation failed (boolean string is expected)',
      );
    }
  }
}
