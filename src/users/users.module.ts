import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { CassandraService } from '@lib/cassandra';

@Module({
  imports: [],
  providers: [UsersService, UserRepository, CassandraService],
  controllers: [UsersController],
})
export class UsersModule {}
