import { Module } from '@nestjs/common';
import { FormatDateService } from './services/format-date.service';
import { DateFormatInterceptor } from './interceptors/date-format.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  exports: [],
  providers: [
    FormatDateService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DateFormatInterceptor,
    },
  ],
})
export class SharedModule {}
