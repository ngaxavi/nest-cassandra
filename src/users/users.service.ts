import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { types } from 'cassandra-driver';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create(createUserDto);
    console.log(user);

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  findOne(id: any): Promise<User> {
    const uid = types.Uuid.fromString(id);
    return this.usersRepository.findOne(uid);
  }

  async remove(id: string): Promise<void> {
    const uid = types.Uuid.fromString(id);
    await this.usersRepository.delete(uid);
  }
}
