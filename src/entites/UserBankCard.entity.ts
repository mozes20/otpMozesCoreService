import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users.entity';

@Entity('user_bank_card')
export class UserBankCard {
  @PrimaryGeneratedColumn()
  cardId: number;

  @Column()
  cardnumber: string;

  @Column()
  cvc: string;

  @Column()
  name: string;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @ManyToOne(() => Users, (user) => user.bankCards)
  @JoinColumn({ name: 'userId' })
  user: Users;
}
