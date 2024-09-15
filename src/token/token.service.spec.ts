import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserToken } from '../entites/UserToken.entity';
import { Users } from '../entites/Users.entity';
import { Repository } from 'typeorm';
import { ErrorData, ResponseDto } from '../dto/response.dto';
import { ErrorCodes } from '../constants/ErrorCodes';

describe('TokenService', () => {
  let service: TokenService;
  let userTokenRepository: Repository<UserToken>;
  let userRepository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: getRepositoryToken(UserToken),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    userTokenRepository = module.get<Repository<UserToken>>(
      getRepositoryToken(UserToken),
    );
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return success true for valid token', async () => {
    const token = 'validToken';
    const decodedToken = 'email@example.com&1&deviceHash';
    const userToken = new UserToken();
    const user = new Users();

    jest.spyOn(Buffer, 'from').mockReturnValueOnce(Buffer.from(decodedToken));
    jest.spyOn(userTokenRepository, 'findOne').mockResolvedValueOnce(userToken);
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);

    const result = await service.validateToken(token);
    expect(result).toEqual(new ResponseDto(true, user));
  });

  it('should return error for token not found', async () => {
    const token = 'invalidToken';
    const decodedToken = 'email@example.com&1&deviceHash';

    jest.spyOn(Buffer, 'from').mockReturnValueOnce(Buffer.from(decodedToken));
    jest.spyOn(userTokenRepository, 'findOne').mockResolvedValueOnce(null);

    const result = await service.validateToken(token);
    expect(result).toEqual(
      new ResponseDto(
        false,
        new ErrorData(
          'A felhasználói token nem szerepel',
          'A beérkezett kérésben a felhasználó token nem szerepel',
          ErrorCodes.TOKEN_NOT_FOUND,
        ),
      ),
    );
  });

  it('should return error for expired or invalid token', async () => {
    const token = 'expiredToken';
    const decodedToken = 'email@example.com&1&deviceHash';
    const userToken = new UserToken();

    jest.spyOn(Buffer, 'from').mockReturnValueOnce(Buffer.from(decodedToken));
    jest.spyOn(userTokenRepository, 'findOne').mockResolvedValueOnce(userToken);
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

    const result = await service.validateToken(token);
    expect(result).toEqual(
      new ResponseDto(
        false,
        new ErrorData(
          'A felhasználói token lejárt vagy nem értelmezhető',
          'A beérkezett kérésben szereplő felhasználó token lejárt vagy nem értelmezhető',
          ErrorCodes.TOKEN_EXPIRED,
        ),
      ),
    );
  });

  it('should return error for unexpected error', async () => {
    const token = 'errorToken';
    const decodedToken = 'email@example.com&1&deviceHash';

    jest.spyOn(Buffer, 'from').mockReturnValueOnce(Buffer.from(decodedToken));
    jest
      .spyOn(userTokenRepository, 'findOne')
      .mockRejectedValueOnce(new Error('Unexpected error'));

    const result = await service.validateToken(token);
    expect(result).toEqual(
      new ResponseDto(
        false,
        new ErrorData(
          'Unexpected error',
          'Unexpected error occurred',
          ErrorCodes.UNEXPECTED_ERROR,
        ),
      ),
    );
  });
});
