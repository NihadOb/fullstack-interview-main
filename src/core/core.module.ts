import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';
import { GlobalExceptionFilter } from './filters/gloabl-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { JobsModule } from './jobs/jobs.module';

@Global()
@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    JobsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [DatabaseModule, ConfigModule, LoggerModule, JobsModule],
})
export class CoreModule {}
