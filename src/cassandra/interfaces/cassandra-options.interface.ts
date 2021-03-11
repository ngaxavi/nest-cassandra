import { ModuleMetadata, Type } from '@nestjs/common';
import { ConnectionOptions } from '../orm';

export type CassandraModuleOptions = {
  /**
   * Number of times to retry connecting
   * Default: 10
   */
  retryAttempts?: number;

  /**
   * Delay between connection retry attempts (ms)
   * Default: 3000
   */
  retryDelay?: number;

  /**
   * Function that determines whether the module should
   * attempt to connect upon failure.
   *
   * @param err error that was thrown
   * @returns whether to retry connection or not
   */
  toRetry?: (err: any) => boolean;
  /**
   * If `true`, entities will be loaded automatically.
   */
  autoLoadEntities?: boolean;
  /**
   * If `true`, connection will not be closed on application shutdown.
   */
  keepConnectionAlive?: boolean;
  /**
   * If `true`, will show verbose error messages on each connection retry.
   */
  verboseRetryLog?: boolean;
} & Partial<ConnectionOptions>;

export interface CassandraOptionsFactory {
  createExpressCassandraOptions():
    | Promise<CassandraModuleOptions>
    | CassandraModuleOptions;
}

export interface CassandraModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;

  useExisting?: Type<CassandraOptionsFactory>;

  useClass?: Type<CassandraOptionsFactory>;

  useFactory?: (
    ...args: any[]
  ) => Promise<CassandraModuleOptions> | CassandraModuleOptions;

  inject?: any[];
}
