import { Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entites/Users.entity';
import { ErrorData, ResponseDto } from '../dto/response.dto';
import { ErrorCodes } from '../constants/ErrorCodes';
import { UserBankCard } from '../entites/UserBankCard.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(UserBankCard)
    private readonly userBankCardRepository: Repository<UserBankCard>,
  ) {}

  async validateCard(
    userId: number,
    amount: number,
  ): Promise<ResponseDto<any>> {
    try {
      const user = await this.userRepository.findOne({ where: { userId } });
      if (!user) {
        return new ResponseDto(
          false,
          new ErrorData(
            'User not found',
            'The user associated with the provided userId does not exist',
            ErrorCodes.USER_NOT_FOUND,
          ),
        );
      }

      const cardOptions: FindOneOptions<UserBankCard> = {
        where: { user: { userId: user.userId } },
        relations: ['user'],
      };
      const card = await this.userBankCardRepository.findOne(cardOptions);
      if (!card) {
        return new ResponseDto(
          false,
          new ErrorData(
            'Card not found',
            'The card does not belong to the user',
            ErrorCodes.CARD_NOT_FOUND,
          ),
        );
      }

      if (card.amount < amount) {
        return new ResponseDto(
          false,
          new ErrorData(
            'Insufficient funds',
            'The card does not have sufficient funds',
            ErrorCodes.INSUFFICIENT_FUNDS,
          ),
        );
      }

      return new ResponseDto(true, {
        message: 'Card is valid and has sufficient funds',
      });
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

  async processPayment(
    userId: number,
    amount: number,
  ): Promise<ResponseDto<any>> {
    const validationResponse = await this.validateCard(userId, amount);
    if (!validationResponse.success) {
      return validationResponse;
    }

    const card = validationResponse.data;
    card.amount -= amount;

    try {
      await this.userBankCardRepository.save(card);
      return new ResponseDto(true, {
        message: 'Payment processed successfully',
      });
    } catch (e) {
      return new ResponseDto(
        false,
        new ErrorData(
          e.message,
          'Unexpected error occurred during payment processing',
          ErrorCodes.UNEXPECTED_ERROR,
        ),
      );
    }
  }
}
