import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntAllowsUndefinedPipe implements PipeTransform {
  transform(value: string): number | undefined {
    if (!value) return undefined;

    const parsedValue = parseInt(value, 10);

    if (Number.isNaN(parsedValue)) {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    }

    return parsedValue;
  }
}
