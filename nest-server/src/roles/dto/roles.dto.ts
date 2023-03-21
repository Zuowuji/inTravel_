import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class AddRoleDto {
  @ArrayNotEmpty({ message: 'roles不能为空' })
  @ArrayMinSize(1, { message: 'roles最小长度为1' })
  @ArrayMaxSize(6, { message: 'roles长度不能超过6' })
  @ApiProperty({ description: '需要添加的角色', type: [String], isArray: true })
  @Type(() => String)
  roles: string[];
}

export class AddMenuDto {
  @ArrayNotEmpty({ message: 'menus不能为空' })
  @ArrayMinSize(1, { message: 'menus最小长度为1' })
  @ArrayMaxSize(6, { message: 'menus长度不能超过6' })
  @ApiProperty({ description: '需要添加的菜单', type: [String], isArray: true })
  @Type(() => String)
  menus: string[];
}

export class userAddRoleDto {
  @IsNotEmpty()
  userId: number;
  @ArrayNotEmpty({ message: 'roles不能为空' })
  @ArrayMinSize(1, { message: 'roles最小长度为1' })
  @ArrayMaxSize(6, { message: 'roles长度不能超过6' })
  @ApiProperty({ description: '需要添加的角色', type: [Number], isArray: true })
  @Type(() => Number)
  roles: number[];
}

export class addRoleToMenuDto {
  @IsNotEmpty()
  roleId: number;
  @ArrayNotEmpty({ message: 'menus不能为空' })
  @ArrayMinSize(1, { message: 'menus最小长度为1' })
  @ArrayMaxSize(6, { message: 'menus长度不能超过6' })
  @ApiProperty({ description: '需要添加的角色', type: [Number], isArray: true })
  @Type(() => Number)
  menus: number[];
}

export class delRoleToMenuDto {
  @IsNotEmpty()
  roleId: number;
  @IsNotEmpty()
  menuId: number;
}

export class delUserRoleDto {
  @IsNotEmpty()
  userId: number;
  @IsNotEmpty()
  roleId: number;
}
