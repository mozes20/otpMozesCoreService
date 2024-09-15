import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CardService } from './card.service';

@Controller('card')
export class CardController {
  constructor(@Inject() private cardService: CardService) {}

  @MessagePattern({ cmd: 'validate-card' })
  async validateCard(
    @Payload() data: { userId: number; amount: number },
    @Ctx() context: RmqContext,
  ) {
    try {
      return await this.cardService.validateCard(data.userId, data.amount);
    } catch (e) {
      return { error: e.message };
    }
  }

  @MessagePattern({ cmd: 'process-payment' })
  async processPayment(
    @Payload() data: { userId: number; amount: number },
    @Ctx() context: RmqContext,
  ) {
    try {
      return await this.cardService.processPayment(data.userId, data.amount);
    } catch (e) {
      return { error: e.message };
    }
  }
}
