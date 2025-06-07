import { ClassConstructor, plainToInstance } from 'class-transformer';

/**
 * Convert a single “plain” object (e.g. your entity/interface) to a DTO class instance.
 */
export function toDto<T, V>(cls: ClassConstructor<V>, entity: T): V {
  return plainToInstance(cls, entity, {
    excludeExtraneousValues: true,
  });
}

/**
 * Convert an array of “plain” objects to an array of DTO class instances.
 */
export function toDtos<T, V>(cls: ClassConstructor<V>, entities: T[]): V[] {
  if (!Array.isArray(entities)) {
    throw new Error('Expected an array of entities');
  }

  if (entities.length === 0) {
    return [];
  }

  return plainToInstance(cls, entities, {
    excludeExtraneousValues: true,
  });
}
