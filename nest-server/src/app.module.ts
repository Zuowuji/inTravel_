import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MJwtModule } from './jwt/jwt.module';
import { RolesModule } from './roles/roles.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MJwtModule,
    AuthModule,
    UserModule,
    PrismaModule,
    RolesModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
