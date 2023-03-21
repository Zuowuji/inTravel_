import { Module } from '@nestjs/common';
import { MJwtModule } from '../jwt/jwt.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [MJwtModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
