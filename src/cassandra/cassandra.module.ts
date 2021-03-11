import {
  CassandraModuleAsyncOptions,
  CassandraModuleOptions,
} from './interfaces';
import { DynamicModule, Module } from '@nestjs/common';
import { createCassandraProviders } from './cassandra.providers';
import { Connection, ConnectionOptions } from './orm';
import { CassandraCoreModule } from './cassandra-core.module';

@Module({})
export class CassandraModule {
  static forRoot(options: CassandraModuleOptions): DynamicModule {
    return {
      module: CassandraModule,
      imports: [CassandraCoreModule.forRoot(options)],
    };
  }

  static forFeature(
    entities: Function[] = [],
    connection: Connection | ConnectionOptions | string = 'default',
  ): DynamicModule {
    const providers = createCassandraProviders(entities, connection);
    return {
      module: CassandraModule,
      providers,
      exports: providers,
    };
  }

  static forRootAsync(options: CassandraModuleAsyncOptions): DynamicModule {
    return {
      module: CassandraModule,
      imports: [CassandraCoreModule.forRootAsync(options)],
    };
  }
}
