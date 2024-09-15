// src/entites/User.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserDevice } from './UserDevice.entity';
import { UserToken } from './UserToken.entity';
import { UserBankCard } from './UserBankCard.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @OneToMany(() => UserDevice, (userDevice) => userDevice.user)
  devices: UserDevice[];

  @OneToMany(() => UserToken, (userToken) => userToken.user)
  tokens: UserToken[];

  @OneToMany(() => UserBankCard, (userBankCard) => userBankCard.user)
  bankCards: UserBankCard[];
}
