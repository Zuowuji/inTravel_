import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword, createHashPassword } from '../common/bcryptjs/bcryptjs';
import { isLetterAndNumber } from '../common/implement/implement';
import { TokenType } from '../config/type.config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegistDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  // todo 登录
  async login(body: LoginDto) {
    if (!isLetterAndNumber(body.username) || !isLetterAndNumber(body.password)) {
      throw new BadRequestException('用户名或者密码只能有字母跟数字');
    }
    const user = await this.prisma.isUserHave({ userName: body.username });
    if (!user || !comparePassword(body.password, user.password)) {
      throw new BadRequestException('用户名/密码错误!');
    }

    const tokenData: TokenType = {
      userId: user.id,
      username: user.userName,
    };

    const token = await this.jwt.signAsync(tokenData);

    return {
      token: token,
    };
  }

  // todo 注册
  async regist(body: RegistDto) {
    if (!isLetterAndNumber(body.username) || !isLetterAndNumber(body.password)) {
      throw new BadRequestException('用户名或者密码只能有字母跟数字');
    }

    const user = await this.prisma.tUser.findUnique({
      where: {
        userName: body.username,
      },
    });
    if (user) {
      throw new BadRequestException('该用户已经存在');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, isDel, ...other } = await this.prisma.tUser.create({
      data: {
        userName: body.username,
        password: createHashPassword(body.password),
        nikeName: '新用户',
        isDel: false,
      },
    });
    return other;
  }
}
