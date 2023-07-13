import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';

@Injectable()
export class FormatDateService {
  private formatDate(date: Date): string {
    return moment(date, 'UTC')
      .locale('es')
      .tz('America/Guayaquil', false)
      .format('dddd, MMMM D YYYY, h:mm:ss a');
  }

  public formatDates(data: any): any {
    const formattedData = { ...data };

    if (formattedData.createdAt) {
      formattedData.createdAt = this.formatDate(formattedData.createdAt);
    }
    if (formattedData.updatedAt) {
      formattedData.updatedAt = this.formatDate(formattedData.updatedAt);
    }
    if (formattedData.dueDate)
      formattedData.dueDate = this.formatDate(formattedData.dueDate);

    return formattedData as { createdAt: string; updatedAt: string };
  }
}
