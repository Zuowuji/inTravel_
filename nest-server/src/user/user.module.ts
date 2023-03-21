import { Module } from '@nestjs/common';
import { MJwtModule } from '../jwt/jwt.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MJwtModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
