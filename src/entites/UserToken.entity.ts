// src/entites/UserToken.entity.ts
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from './Users.entity';

@Entity()
export class UserToken {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  token: string;

  @ManyToOne(() => Users, (user) => user.tokens)
  user: Users;
}
