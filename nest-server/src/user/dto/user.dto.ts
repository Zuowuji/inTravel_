import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegistDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '用户名' })
  username: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '密码' })
  password: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '用户名' })
  username: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '密码' })
  password: string;
}
