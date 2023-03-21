import { Module } from '@nestjs/common';
import { JwtStrategy } from '../common/service/JwtStrategy';
import { MJwtModule } from '../jwt/jwt.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [MJwtModule],
  controllers: [RolesController],
  providers: [RolesService, JwtStrategy],
})
export class RolesModule {}
