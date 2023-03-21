import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TokenType } from '../../config/type.config';
import { accountStopText, jwtEnvKey, noAuthText } from '../../config/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(jwtEnvKey),
    });
  }

  async validate(tokenData: TokenType) {
    const user = await this.prisma.tUser.findUnique({
      where: { id: tokenData.userId },
    });
    if (!user) {
      // 有token并且通过了密钥验证,但实际没有该账号(以前的token,账号删除后会出现的情况)
      throw new BadRequestException(noAuthText);
    } else if (user.isDel) {
      throw new BadRequestException(accountStopText);
    }
    return user;
  }
}
