import { Module } from '@nestjs/common';
import { JwtStrategy } from '../common/service/JwtStrategy';
import { MJwtModule } from '../jwt/jwt.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [MJwtModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
