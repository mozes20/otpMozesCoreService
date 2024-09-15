// src/entites/UserDevice.entity.ts
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from './Users.entity';

@Entity()
export class UserDevice {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  deviceHash: string;

  @ManyToOne(() => Users, (user) => user.devices)
  user: Users;
}
