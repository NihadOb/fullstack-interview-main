import { dataSourceFactory } from './data-source.factory';
import { JsonDataProvider } from './providers/json-data.provider';
import { PostgresDataProvider } from './providers/postgres-data.provider';
import { MemoryDataProvider } from './providers/memory-data.provider';

describe('dataSourceFactory', () => {
  const mockLogger = {
    setContext: jest.fn(),
    log: jest.fn(),
  };

  const makeConfigService = (type: string) => ({
    get: jest.fn((key: string, def: string) =>
      key === 'DATA_SOURCE_TYPE' ? type : def,
    ),
  });

  it('should return JsonDataProvider when type is json', () => {
    const configService = makeConfigService('json');
    const provider = dataSourceFactory.useFactory(configService, mockLogger);
    expect(provider).toBeInstanceOf(JsonDataProvider);
  });

  it('should return PostgresDataProvider when type is postgres', () => {
    const configService = makeConfigService('postgres');
    const provider = dataSourceFactory.useFactory(configService, mockLogger);
    expect(provider).toBeInstanceOf(PostgresDataProvider);
  });

  it('should return MemoryDataProvider when type is memory', () => {
    const configService = makeConfigService('memory');
    const provider = dataSourceFactory.useFactory(configService, mockLogger);
    expect(provider).toBeInstanceOf(MemoryDataProvider);
  });

  it('should throw for unknown type', () => {
    const configService = makeConfigService('unknown');
    expect(() =>
      dataSourceFactory.useFactory(configService, mockLogger),
    ).toThrow('Unknown data source: unknown');
  });

  it('should throw for not implemented types', () => {
    const configService = makeConfigService('mysql');
    expect(() =>
      dataSourceFactory.useFactory(configService, mockLogger),
    ).toThrow('Data source mysql is not implemented');
  });
});
