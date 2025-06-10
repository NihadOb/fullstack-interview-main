import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { DataProvider } from '../data-provider.interface';
import { CustomLoggerService } from '@app/core/logger/custom-logger.service';

interface JsonDb {
  [entityName: string]: any[];
}

export class JsonDataProvider implements DataProvider, OnModuleInit {
  private dbPath: string;
  private database: JsonDb = {};
  private isInitialized = false;

  constructor(
    private configService: ConfigService,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.log(`JSON Database path configured to: ${this.dbPath}`);
    this.dbPath = path.resolve(
      this.configService.get<string>('JSON_DB_PATH', 'data.json'),
    );
  }
  /**
   * Initializes the JSON data provider by loading the database from the specified file.
   * If the file does not exist, it initializes an empty database and creates the file.
   */
  async onModuleInit() {
    if (this.isInitialized) return;
    this.logger.log('JsonDataProvider initializing...');
    await this.loadDatabase();
    this.isInitialized = true;
    this.logger.log('JsonDataProvider initialized successfully.');
  }

  private async loadDatabase(): Promise<void> {
    try {
      this.logger.log(`Attempting to load database from ${this.dbPath}`);
      const data = await fs.readFile(this.dbPath, 'utf-8');
      this.database = JSON.parse(data);
      this.logger.log(
        `Database loaded successfully from ${this.dbPath}. Entities found: ${Object.keys(this.database).join(', ')}`,
      );
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.logger.warn(
          `Database file not found at ${this.dbPath}. Initializing with an empty database and creating the file.`,
        );
        this.database = {};
        await this.saveDatabase(); // Create the file with an empty object
      } else {
        this.logger.error(
          `Failed to load database from ${this.dbPath}:`,
          error.stack,
        );
        this.database = {}; // Fallback to empty DB
      }
    }
  }

  private async saveDatabase(): Promise<void> {
    try {
      this.logger.log(`Saving database to ${this.dbPath}`);
      const dir = path.dirname(this.dbPath);
      await fs.mkdir(dir, { recursive: true }); // Ensure directory exists
      await fs.writeFile(
        this.dbPath,
        JSON.stringify(this.database, null, 2),
        'utf-8',
      );
      this.logger.log('Database saved successfully.');
    } catch (error) {
      this.logger.error(
        `Failed to save database to ${this.dbPath}:`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Extracts the next available ID for a new item based on existing items in the list.
   * @returns New ID
   */
  private getNextId(entityName: string): number {
    const items = this.database[entityName] || [];
    if (items.length === 0) return 1;
    const maxId = items.reduce(
      (max, item) => (Number(item.id) > max ? Number(item.id) : max),
      0,
    );
    return maxId + 1;
  }

  async findAll<TEntity extends { id?: any }>(
    entityName: string,
  ): Promise<TEntity[]> {
    this.logger.log(`[JSON Adapter] Finding all for entity: ${entityName}`);
    return (this.database[entityName] || []) as TEntity[];
  }

  async findById<TEntity extends { id?: any }>(
    entityName: string,
    id: string | number,
  ): Promise<TEntity | null> {
    this.logger.log(
      `[JSON Adapter] Finding by ID ${id} for entity: ${entityName}`,
    );
    const items = (this.database[entityName] || []) as TEntity[];
    const item = items.find((i) => String(i.id) === String(id));
    return item || null;
  }

  async create<TEntity extends { id?: any }>(
    entityName: string,
    itemData: Omit<TEntity, 'id'>,
  ): Promise<TEntity> {
    this.logger.log(`[JSON Adapter] Creating for entity: ${entityName}`);
    if (!this.database[entityName]) {
      this.database[entityName] = [];
    }
    const newItem = { ...itemData, id: this.getNextId(entityName) } as TEntity;
    this.database[entityName].push(newItem);
    await this.saveDatabase();
    return newItem;
  }

  async update<TEntity extends { id?: any }>(
    entityName: string,
    id: string | number,
    itemUpdate: Partial<Omit<TEntity, 'id'>>,
  ): Promise<TEntity | null> {
    this.logger.log(
      `[JSON Adapter] Updating ID ${id} for entity: ${entityName}`,
    );
    const items = (this.database[entityName] || []) as TEntity[];
    const itemIndex = items.findIndex((i) => String(i.id) === String(id));
    if (itemIndex === -1) return null;
    const updatedItem = { ...items[itemIndex], ...itemUpdate };
    this.database[entityName][itemIndex] = updatedItem;
    await this.saveDatabase();
    return updatedItem;
  }

  async delete(entityName: string, id: string | number): Promise<boolean> {
    this.logger.log(
      `[JSON Adapter] Deleting ID ${id} for entity: ${entityName}`,
    );
    const items = this.database[entityName] || [];
    const itemIndex = items.findIndex((i) => String(i.id) === String(id));
    if (itemIndex === -1) return false;
    this.database[entityName].splice(itemIndex, 1);
    await this.saveDatabase();
    return true;
  }
}
