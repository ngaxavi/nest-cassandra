import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CassandraModule } from '@lib/cassandra';

@Module({
  imports: [CassandraModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
