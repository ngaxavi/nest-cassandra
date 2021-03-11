import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CassandraModuleOptions } from './cassandra/interfaces';
import { auth } from 'cassandra-driver';
import { CassandraModule } from './cassandra/cassandra.module';
import { UsersModule } from './users';

const cassandraOptions: CassandraModuleOptions = {
  clientOptions: {
    keyspace: 'test',
    contactPoints: ['localhost'],
    protocolOptions: {
      port: 9042,
    },
    queryOptions: {
      consistency: 1,
    },
    authProvider: new auth.PlainTextAuthProvider('test', 'test'),
  },
  ormOptions: {
    createKeyspace: true,
    defaultReplicationStrategy: {
      class: 'NetworkTopologyStrategy',
    },
    migration: 'alter',
  },
};

@Module({
  imports: [CassandraModule.forRoot(cassandraOptions), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
