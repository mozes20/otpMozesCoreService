import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entites/Users.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserBankCard } from '../entites/UserBankCard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserBankCard, Users]),
    ClientsModule.register([
      {
        name: 'TOKEN_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'core_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [CardService],
  controllers: [CardController],
})
export class CardModule {}
