import { Injectable, OnModuleInit } from '@nestjs/common';
import { mapping, types } from 'cassandra-driver';
import { CassandraService } from '@lib/cassandra';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import Uuid = types.Uuid;

@Injectable()
export class UserRepository implements OnModuleInit {
  constructor(private cassandraService: CassandraService) {}

  employeeMapper: mapping.ModelMapper<User>;

  async onModuleInit() {
    const mappingOptions: mapping.MappingOptions = {
      models: {
        User: {
          tables: ['user'],
          mappings: new mapping.UnderscoreCqlToCamelCaseMappings(),
          keyspace: 'test',
        },
      },
    };

    this.employeeMapper = (
      await this.cassandraService.createMapper(mappingOptions)
    ).forModel('User');
  }

  async findAll() {
    return (await this.employeeMapper.findAll()).toArray();
  }

  async findOne(id: types.Uuid) {
    return (await this.employeeMapper.find({ id })).first();
  }

  async create(user: CreateUserDto) {
    const id = Uuid.random();
    return (
      await this.employeeMapper.insert({ id, isActive: true, ...user })
    ).first();
  }

  async delete(id: types.Uuid) {
    return (await this.employeeMapper.remove({ id })).first();
  }
}
