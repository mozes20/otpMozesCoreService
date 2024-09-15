import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { UserToken } from '../entites/UserToken.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entites/Users.entity';
import { TokenController } from './token.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserToken, Users]),
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
  providers: [TokenService],
  controllers: [TokenController],
})
export class TokenModule {}
