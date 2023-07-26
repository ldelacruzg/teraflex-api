import { Module } from '@nestjs/common';
import { FormatDateService } from './services/format-date.service';
import { DateFormatInterceptor } from './interceptors/date-format.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EncryptService } from '@shared/services/encrypt.service';

@Module({
  exports: [FormatDateService, EncryptService],
  providers: [
    FormatDateService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DateFormatInterceptor,
    },
    EncryptService,
  ],
})
export class SharedModule {}
