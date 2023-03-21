import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { TokenType } from '../config/type.config';
import { JwtService } from '@nestjs/jwt';
import { noAuthText } from '../config/app.config';

interface FindRoleFnType {
  (token: string): Promise<boolean>;
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly prisma: PrismaService, private readonly jwt: JwtService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('role', context.getHandler());
    if (roles) {
      const request = context.switchToHttp().getRequest<Request>();
      const token = request.headers['authorization'].split(' ')[1];
      if (token) {
        const findRole: FindRoleFnType = async (tokenStr: string) => {
          let tokenData: TokenType;
          try {
            tokenData = await this.jwt.verifyAsync(tokenStr);
          } catch (error) {
            throw new BadRequestException(noAuthText);
          }
          // 查该用户分配好的所有角色
          const user = await this.prisma.tUser.findFirst({
            include: {
              roleList: {
                select: {
                  roleId: true,
                },
              },
            },
            where: {
              id: tokenData.userId,
            },
          });
          // 根据分配的id查找对应的角色名称
          const roleList = await this.prisma.tRole.findMany({
            select: {
              roleName: true,
            },
            where: {
              OR: user.roleList.map((e) => ({ id: e.roleId })),
            },
          });
          console.log(roleList);
          // 遍历这些名称,看是否有具有该权限的角色
          let check = false;
          for (let k = 0, len = roleList.length; k < len; k++) {
            const item = roleList[k];
            if (roles.includes(item.roleName)) {
              check = true;
              break;
            }
          }
          return check;
        };
        return findRole(token);
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}
