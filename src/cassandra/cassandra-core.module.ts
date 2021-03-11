import {
  CASSANDRA_MODULE_ID,
  CASSANDRA_MODULE_OPTIONS,
} from './cassandra.constants';
import {
  CassandraModuleAsyncOptions,
  CassandraModuleOptions,
  CassandraOptionsFactory,
} from './interfaces';
import { Connection, ConnectionOptions } from './orm';
import { defer } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DynamicModule,
  Global,
  Inject,
  Logger,
  Module,
  OnModuleDestroy,
  Provider,
} from '@nestjs/common';
import {
  generateString,
  getConnectionToken,
  handleRetry,
} from './helpers/cassandra-orm.utils';
import { ModuleRef } from '@nestjs/core';

@Global()
@Module({})
export class CassandraCoreModule implements OnModuleDestroy {
  constructor(
    @Inject(CASSANDRA_MODULE_OPTIONS)
    private readonly options: CassandraModuleOptions,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(options: CassandraModuleOptions = {}): DynamicModule {
    const expressModuleOptions = {
      provide: CASSANDRA_MODULE_OPTIONS,
      useValue: options,
    };
    const connectionProvider = {
      provide: getConnectionToken(options as ConnectionOptions),
      useFactory: async () => await this.createConnectionFactory(options),
    };
    return {
      module: CassandraCoreModule,
      providers: [expressModuleOptions, connectionProvider],
      exports: [connectionProvider],
    };
  }

  static forRootAsync(options: CassandraModuleAsyncOptions): DynamicModule {
    const connectionProvider = {
      provide: getConnectionToken(options as ConnectionOptions),
      useFactory: async (typeormOptions: CassandraModuleOptions) => {
        if (options.name) {
          return await this.createConnectionFactory({
            ...typeormOptions,
            name: options.name,
          });
        }
        return await this.createConnectionFactory(typeormOptions);
      },
      inject: [CASSANDRA_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: CassandraCoreModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        connectionProvider,
        {
          provide: CASSANDRA_MODULE_ID,
          useValue: generateString(),
        },
      ],
      exports: [connectionProvider],
    };
  }

  async onModuleDestroy() {
    if (this.options.keepConnectionAlive) {
      return;
    }
    Logger.log('Closing connection', 'ExpressCassandraModule');
    const connection = this.moduleRef.get<Connection>(
      getConnectionToken(this.options as ConnectionOptions) as any,
    );
    // tslint:disable-next-line:no-unused-expression
    connection && (await connection.closeAsync());
  }

  private static createAsyncProviders(
    options: CassandraModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: CassandraModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: CASSANDRA_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: CASSANDRA_MODULE_OPTIONS,
      useFactory: async (optionsFactory: CassandraOptionsFactory) =>
        await optionsFactory.createExpressCassandraOptions(),
      inject: [options.useClass || options.useExisting],
    };
  }

  private static async createConnectionFactory(
    options: CassandraModuleOptions,
  ): Promise<Connection> {
    const { retryAttempts, retryDelay, ...cassandraOptions } = options;
    const connection = new Connection(cassandraOptions);

    return await defer(() => connection.initAsync())
      .pipe(
        handleRetry(retryAttempts, retryDelay),
        map(() => connection),
      )
      .toPromise();
  }
}
