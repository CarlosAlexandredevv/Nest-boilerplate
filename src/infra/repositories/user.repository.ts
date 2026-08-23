import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import type { CreateUserInput } from '../../models/user';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  create(input: CreateUserInput): Promise<User> {
    return this.users.save(this.users.create(input));
  }

  findByEmail(email: string): Promise<User | null> {
    return this.users.findOne({ where: { email } });
  }

  save(user: User): Promise<User> {
    return this.users.save(user);
  }
}
