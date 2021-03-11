import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { Repository, InjectRepository, uuid } from '@lib/cassandra';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    // user.firstName = createUserDto.firstName;
    // user.lastName = createUserDto.lastName;
    console.log(user);

    return this.usersRepository.save(user).toPromise();
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({}).toPromise();
  }

  findOne(id: any): Promise<User> {
    console.log(id);
    const uid = typeof id === 'string' ? uuid(id) : id;
    return this.usersRepository.findOne({ id: uid }).toPromise();
  }

  async remove(id: any): Promise<void> {
    console.log(id);
    const uid = typeof id === 'string' ? uuid(id) : id;
    await this.usersRepository.delete({ id: uid }).toPromise();
  }
}
