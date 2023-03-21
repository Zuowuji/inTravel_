import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { accountStopText } from '../config/app.config';

interface UserParamType {
  id?: number;
  userName?: string;
}

@Injectable()
export class PrismaService extends PrismaClient {
  // todo 验证用户是否存在
  async isUserHave(options: UserParamType) {
    const where: UserParamType = {};

    if (options.id) {
      where.id = options.id;
    } else if (options.userName) {
      where.userName = options.userName;
    }
    const result = await this.tUser.findFirst({
      where,
    });
    if (!result) {
      throw new BadRequestException('该用户不存在');
    }
    if (result.isDel) {
      throw new BadRequestException(accountStopText);
    }
    return result;
  }
}
