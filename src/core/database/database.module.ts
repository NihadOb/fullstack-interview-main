import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DATA_PROVIDER_TOKEN } from '../constants/tokens';
import { dataSourceFactory } from './data-source.factory';

@Module({
  imports: [ConfigModule],
  providers: [dataSourceFactory],
  exports: [DATA_PROVIDER_TOKEN],
})
export class DatabaseModule {}
