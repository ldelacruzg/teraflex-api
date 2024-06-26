import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormatDateService } from '../services/format-date.service';
import { ResponseDataInterface } from '../interfaces/response-data.interface';

@Injectable()
export class DateFormatInterceptor implements NestInterceptor {
  constructor(private formatDateService: FormatDateService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((element: ResponseDataInterface) => {
        if (element.formatDate === false) {
          delete element.formatDate;
          return element;
        }
        
        return this.formatDates(element);
      }),
    );
  }

  private formatDates(obj: any): any {
    for (const key in obj) {
      if (obj[key] instanceof Date) {
        obj[key] = this.formatDateService.formatDate(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        obj[key] = this.formatDates(obj[key]);
      }
    }

    return obj;
  }
}
