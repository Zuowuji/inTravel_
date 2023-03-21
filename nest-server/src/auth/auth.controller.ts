import { Controller, UseGuards, Request, Param, ParseIntPipe, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GGet } from '../common/decrator/http.decrator';
import { rootName } from '../config/app.config';
import { RoleGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('权限模块')
@ApiBearerAuth()
@UseGuards(RoleGuard)
@UseGuards(AuthGuard('jwt'))
export class AuthController {
  constructor(private readonly authServer: AuthService) {}

  @GGet({ url: 'userinfo', summary: '获取用户信息' })
  getUserInfo(@Request() req) {
    return this.authServer.getUserInfo(req.user);
  }

  @SetMetadata('role', [rootName])
  @GGet({ url: 'userAllInfo', summary: '获取所有用户简易信息' })
  getUserAllInfo() {
    return this.authServer.userAllInfo();
  }

  @SetMetadata('role', [rootName])
  @GGet({ url: 'open/:id', summary: '开启某账号' })
  openuser(@Param('id', ParseIntPipe) id: number) {
    return this.authServer.openUser(id);
  }

  @SetMetadata('role', [rootName])
  @GGet({ url: 'stop/:id', summary: '停用该账号' })
  delUser(@Param('id', ParseIntPipe) id: number) {
    return this.authServer.delUser(id);
  }
}
