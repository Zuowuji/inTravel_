import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GPost } from '../common/decrator/http.decrator';
import { LoginDto, RegistDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('用户模块')
export class UserController {
  constructor(private readonly userServer: UserService) {}

  @GPost({ url: 'regist', summary: '注册账号' })
  regist(@Body() body: RegistDto) {
    return this.userServer.regist(body);
  }

  @GPost({ url: 'login', summary: '登录账号' })
  login(@Body() body: LoginDto) {
    return this.userServer.login(body);
  }
}
