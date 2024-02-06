import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';

@Injectable()
export class FormatDateService {
  public formatDate(date: Date): string {
    return moment(date)
      .locale('es')
      .tz('America/Guayaquil')
      .format('dddd, MMMM D YYYY, h:mm a');
  }

  public formatDates(data: any): any {
    const formattedData = { ...data };

    if (formattedData.createdAt) {
      formattedData.createdAt = this.formatDate(formattedData.createdAt);
    }
    if (formattedData.updatedAt) {
      formattedData.updatedAt = this.formatDate(formattedData.updatedAt);
    }
    // if (formattedData.dueDate)
    //   formattedData.dueDate = this.formatDate(formattedData.dueDate);

    return formattedData as { createdAt: string; updatedAt: string };
  }

  public static getLastMonday() {
    const today = moment().locale('es').tz('America/Guayaquil');
    const day = today.day();
    const diff = today.date() - day + (day === 0 ? -6 : 1);
    return moment(today).date(diff).toDate();
  }

  public static getNextSunday() {
    const today = moment().locale('es').tz('America/Guayaquil');
    const day = today.day();
    const diff = today.date() - day + (day === 0 ? 0 : 7);
    return moment(today).date(diff).toDate();
  }

  public static getCurrentDateRange() {
    const today = moment().locale('es').tz('America/Guayaquil');
    const day = today.day();
    const diff = today.date() - day + (day === 0 ? -6 : 1);
    const start = moment(today).date(diff).format('YYYY-MM-DD');
    const end = moment(today)
      .date(diff + 6)
      .format('YYYY-MM-DD');
    return { start, end };
  }

  public static getDateRange(date: Date) {
    const today = moment(date).locale('es').tz('America/Guayaquil');
    const day = today.day();
    const diff = today.date() - day + (day === 0 ? -6 : 1);
    const start = moment(today).date(diff).format('YYYY-MM-DD');
    const end = moment(today)
      .date(diff + 6)
      .format('YYYY-MM-DD');
    return { start, end };
  }
}
