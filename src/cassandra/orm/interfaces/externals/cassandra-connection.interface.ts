import { ConnectionOptions } from './cassandra-client-options.interface';
import { types } from 'cassandra-driver';
import { BaseModel } from './cassandra.interface';
import * as Cassandra from 'express-cassandra';

export interface Connection extends FunctionConstructor {
  uuid(): types.Uuid;
  uuidFromString(str: string): types.Uuid;
  uuidFromBuffer(buffer: Buffer): types.Uuid;

  timeUuid(): types.TimeUuid;
  timeUuidFromDate(date: Date): types.TimeUuid;
  timeUuidFromString(str: string): types.TimeUuid;
  timeUuidFromBuffer(buffer: Buffer): types.TimeUuid;
  maxTimeUuid(date: Date): types.TimeUuid;
  minTimeUuid(date: Date): types.TimeUuid;

  doBatchAsync(queries: string[]): Promise<any>;

  loadSchema<T = any>(schema: any, name?: string): BaseModel<T>;

  instance: { [index: string]: BaseModel<any> };

  orm: any;

  closeAsync(): Promise<any>;

  initAsync(): Promise<any>;

  [index: string]: any;
}

export interface CassandraStatic extends Object {
  new (options: Partial<ConnectionOptions>): Connection;

  createClient(options: ConnectionOptions): Connection;

  [index: string]: any;
}

export const Connection: CassandraStatic = Cassandra;
