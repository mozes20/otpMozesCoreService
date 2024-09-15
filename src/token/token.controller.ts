import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { TokenService } from './token.service';
import { Inject } from '@nestjs/common';
import { ValidateTokenDto } from '../dto/ValidateToken.dto';

//@Controller('token')
export class TokenController {
  constructor(@Inject() private tokenService: TokenService) {}

  @MessagePattern({ cmd: 'validate-token' })
  async validateToken(
    @Payload() data: ValidateTokenDto,
    @Ctx() context: RmqContext,
  ) {
    console.log(`Data: ${data.token}`);
    try {
      return await this.tokenService.validateToken(data.token);
    } catch (e) {
      return { error: e.message };
    }
  }
}
