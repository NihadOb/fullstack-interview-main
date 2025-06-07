import { FactoryProvider } from '@nestjs/common';
import { DataProvider } from './data-provider.interface';
import { DATA_PROVIDER_TOKEN } from '../constants/tokens';
import { ConfigService } from '@nestjs/config';
import { PostgresDataProvider } from './providers/postgres-data.provider';
import { JsonDataProvider } from './providers/json-data.provider';
import { CustomLoggerService } from '../logger/custom-logger.service';

export const dataSourceFactory: FactoryProvider<DataProvider> = {
  provide: DATA_PROVIDER_TOKEN,
  useFactory: (configService: ConfigService, logger: CustomLoggerService) => {
    logger.setContext('DataSourceFactory');
    const dataSourceType = configService
      .get<string>('DATA_SOURCE_TYPE', 'json')
      .toLowerCase();
    logger.log(`Selected data source type from ENV: ${dataSourceType}`);

    switch (dataSourceType) {
      case 'json': {
        logger.log('Initializing JSON Data Provider...');
        return new JsonDataProvider(configService, logger);
        break;
      }

      case 'postgres': {
        logger.log('Initializing PostgreSQL Data Provider...');
        return new PostgresDataProvider(logger /* , typeOrmDataSource */);
      }
      case 'mysql':
      case 'sqlite': {
        throw new Error(`Data source ${dataSourceType} is not implemented`);
      }
      default:
        throw new Error(`Unknown data source: ${dataSourceType}`);
    }
  },
  inject: [ConfigService, CustomLoggerService],
};
