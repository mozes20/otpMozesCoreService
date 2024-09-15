import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from '../entites/UserToken.entity';

import { ErrorData, ResponseDto } from '../dto/response.dto';
import { ErrorCodes } from '../constants/ErrorCodes';
import { Users } from '../entites/Users.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async validateToken(token: string): Promise<ResponseDto<any>> {
    console.log('TokenService.validateToken', token);
    const decodedToken = Buffer.from(token, 'base64').toString('utf8');
    const [email, userId, deviceHash] = decodedToken.split('&');

    try {
      const userToken = await this.userTokenRepository.findOne({
        where: { token },
      });
      if (!userToken) {
        return new ResponseDto(
          false,
          new ErrorData(
            'A felhasználói token nem szerepel',
            'A beérkezett kérésben a felhasználó token nem szerepel',
            ErrorCodes.TOKEN_NOT_FOUND,
          ),
        );
      }

      const user = await this.userRepository.findOne({
        where: { userId: parseInt(userId), email },
      });
      if (!user) {
        return new ResponseDto(
          false,
          new ErrorData(
            'A felhasználói token lejárt vagy nem értelmezhető',
            'A beérkezett kérésben szereplő felhasználó token lejárt vagy nem értelmezhető',
            ErrorCodes.TOKEN_EXPIRED,
          ),
        );
      }

      return new ResponseDto(true, user);
    } catch (e) {
      return new ResponseDto(
        false,
        new ErrorData(
          e.message,
          'Unexpected error occurred',
          ErrorCodes.UNEXPECTED_ERROR,
        ),
      );
    }
  }
}
