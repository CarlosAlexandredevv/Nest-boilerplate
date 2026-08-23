import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import type { CreateUserInput } from '../../models/user';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private repo(em?: EntityManager): Repository<User> {
    return em?.getRepository(User) ?? this.userRepository;
  }

  create(createUserInput: CreateUserInput, em?: EntityManager): Promise<User> {
    const repo = this.repo(em);
    return repo.save(repo.create(createUserInput));
  }

  findByEmail(email: string, em?: EntityManager): Promise<User | null> {
    return this.repo(em).findOne({ where: { email } });
  }

  save(user: User, em?: EntityManager): Promise<User> {
    return this.repo(em).save(user);
  }
}
