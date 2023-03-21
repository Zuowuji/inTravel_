import { Body, Controller, Param, ParseIntPipe, Request, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../auth/auth.guard';
import { GGet, GPost } from '../common/decrator/http.decrator';
import { rootName } from '../config/app.config';
import {
  AddMenuDto,
  AddRoleDto,
  addRoleToMenuDto,
  delRoleToMenuDto,
  delUserRoleDto,
  userAddRoleDto,
} from './dto/roles.dto';
import { RolesService } from './roles.service';

@Controller('roles')
@ApiTags('角色模块')
@UseGuards(RoleGuard)
@UseGuards(AuthGuard('jwt'))
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @GGet({ url: 'currentRoles', summary: '获取当前用户的角色' })
  getCurrentRolels(@Request() req) {
    return this.roleService.getCurrentUserRole(req.user.id);
  }

  @GGet({ url: 'currentMenu', summary: '获取当前用户的菜单' })
  getCurrentMenus(@Request() req) {
    return this.roleService.getCurrentMenu(req.user.id);
  }

  @SetMetadata('role', [rootName])
  @GGet({ url: 'allRole', summary: '获取所有角色' })
  getAllRole() {
    return this.roleService.getAllRole();
  }

  @SetMetadata('role', [rootName])
  @GGet({ url: 'allMenu', summary: '获取所有菜单' })
  getAllMenu() {
    return this.roleService.getAllMenu();
  }

  @SetMetadata('role', [rootName])
  @GGet({ url: 'userRole/:id', summary: '获取某用户的角色' })
  userRoleList(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.userRoleList(id);
  }

  @SetMetadata('role', [rootName])
  @GPost({ url: 'addRole', summary: '添加角色' })
  addRole(@Body() body: AddRoleDto) {
    return this.roleService.addRole(body);
  }

  @SetMetadata('role', [rootName])
  @GPost({ url: 'addMenu', summary: '添加菜单' })
  addMenu(@Body() body: AddMenuDto) {
    return this.roleService.addMenus(body);
  }

  @SetMetadata('role', [rootName])
  @GPost({ url: 'delRole/:id', summary: '删除角色' })
  delRole(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.delRole(id);
  }

  @SetMetadata('role', [rootName])
  @GPost({ url: 'delMenu/:id', summary: '删除菜单' })
  delMenu(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.delMenu(id);
  }

  @SetMetadata('role', [rootName])
  @GPost({ url: 'userAddRole', summary: '为某用户添加角色' })
  userAddRole(@Body() body: userAddRoleDto) {
    return this.roleService.userAddRole(body);
  }

  @SetMetadata('role', [rootName])
  @GPost({ url: 'addRoleToMenu', summary: '为某角色添加菜单' })
  addRoleToMenu(@Body() body: addRoleToMenuDto) {
    return this.roleService.addRoleToMenu(body);
  }

  @SetMetadata('role', [rootName])
  @GPost({ url: 'delRoleToMenu', summary: '为某角色删除菜单' })
  delRoleToMenu(@Body() body: delRoleToMenuDto) {
    return this.roleService.delRoleToMenu(body);
  }

  @SetMetadata('role', [rootName])
  @GPost({ url: 'delUserRole', summary: '为某用户删除角色' })
  delUserRole(@Body() body: delUserRoleDto) {
    return this.roleService.delUserRole(body);
  }
}
