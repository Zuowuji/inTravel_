import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtEnvKey } from '../config/app.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get(jwtEnvKey),
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),
  ],
  exports: [JwtModule],
})
export class MJwtModule {}
