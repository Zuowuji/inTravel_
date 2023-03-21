import { BadRequestException, Injectable } from '@nestjs/common';
import { TUser } from '@prisma/client';
import { noHandleRoot, rootName } from '../config/app.config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  // todo 获取所有用户简易信息
  userAllInfo() {
    return this.prisma.tUser.findMany({
      select: {
        id: true,
        userName: true,
        nikeName: true,
        avatar: true,
        qq: true,
        wechat: true,
        email: true,
        github: true,
        isDel: true,
      },
    });
  }
  // todo 开启某个账号
  async openUser(id: number) {
    const user = await this.haveUser(id);
    if (!user) {
      throw new BadRequestException('该账号不存在');
    }
    if (user.userName === rootName) {
      throw new BadRequestException(noHandleRoot);
    }
    await this.prisma.tUser.update({
      where: {
        id: id,
      },
      data: {
        isDel: false,
      },
    });
    return '账号已开启';
  }
  // todo 停用某个账号
  async delUser(id: number) {
    const user = await this.haveUser(id);
    if (!user) {
      throw new BadRequestException('该账号不存在');
    }
    if (user.userName === rootName) {
      throw new BadRequestException(noHandleRoot);
    }
    await this.prisma.tUser.update({
      where: {
        id: id,
      },
      data: {
        isDel: true,
      },
    });
    return '停用成功';
  }

  // todo 获取用户信息
  getUserInfo(user: TUser) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, isDel, ...other } = user;
    return other;
  }
  // todo 账号是否存在
  haveUser(id: number) {
    return this.prisma.tUser.findFirst({
      where: {
        id: id,
      },
    });
  }
}
