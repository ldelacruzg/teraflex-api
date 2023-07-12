import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormatDateService } from '../services/format-date.service';

@Injectable()
export class DateFormatInterceptor implements NestInterceptor {
  constructor(private formatDateService: FormatDateService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((element) => {
        if (!element) return;

        if (Array.isArray(element.data)) {
          element.data = element.data.map((item) =>
            this.formatDateService.formatDates(item),
          );
        } else if (Array.isArray(element)) {
          element = element.map((item) =>
            this.formatDateService.formatDates(item),
          );
        } else if (element.data) {
          element.data = this.formatDateService.formatDates(element.data);
        } else {
          element = this.formatDateService.formatDates(element);
        }

        return element;
      }),
    );
  }
}
