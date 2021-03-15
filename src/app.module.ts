import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users';

// const cassandraOptions: CassandraModuleOptions = {
//   clientOptions: {
//     keyspace: 'test',
//     contactPoints: ['localhost'],
//     protocolOptions: {
//       port: 9042,
//     },
//     queryOptions: {
//       consistency: 1,
//     },
//     authProvider: new auth.PlainTextAuthProvider('test', 'test'),
//   },
//   ormOptions: {
//     createKeyspace: true,
//     defaultReplicationStrategy: {
//       class: 'NetworkTopologyStrategy',
//     },
//     migration: 'alter',
//   },
// };

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
