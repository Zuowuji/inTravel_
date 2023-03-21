import { BadRequestException, Injectable } from '@nestjs/common';
import { keepNumberArray, resultMany } from '../common/implement/implement';
import { noHandleRoot, rootName } from '../config/app.config';
import { PrismaService } from '../prisma/prisma.service';
import {
  AddMenuDto,
  AddRoleDto,
  addRoleToMenuDto,
  delRoleToMenuDto,
  delUserRoleDto,
  userAddRoleDto,
} from './dto/roles.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  // todo 删除菜单
  async delMenu(id: number) {
    const menu = await this.prisma.tMenu.findFirst({
      where: { id },
    });
    if (!menu) {
      throw new BadRequestException('该菜单不存在');
    }
    const result = await this.prisma.tMenu.delete({ where: { id } });
    return `${result.menuName}-菜单删除成功`;
  }

  // todo 删除角色
  async delRole(id: number) {
    const role = await this.prisma.tRole.findFirst({
      where: {
        id,
      },
    });
    if (!role) {
      throw new BadRequestException('该角色不存在');
    } else if (role.roleName == rootName) {
      throw new BadRequestException(noHandleRoot);
    }
    const result = await this.prisma.tRole.delete({ where: { id } });
    return `${result.roleName}-角色删除成功`;
  }

  // todo 为某角色删除菜单
  async delRoleToMenu(body: delRoleToMenuDto) {
    const role = await this.prisma.tRole.findFirst({
      where: {
        id: body.roleId,
      },
    });
    if (!role) {
      throw new BadRequestException('该角色不存在');
    }
    const result = await this.prisma.tMenuChild.deleteMany({
      where: {
        roleId: body.roleId,
        menuId: body.menuId,
      },
    });
    if (result.count <= 0) {
      throw new BadRequestException('没有找到当条记录!');
    }
    return {
      message: '删除成功',
      count: result.count,
    };
  }

  // todo 为某角色添加菜单
  async addRoleToMenu(body: addRoleToMenuDto) {
    // 角色是否存在
    const role = await this.prisma.tRole.findFirst({
      where: {
        id: body.roleId,
      },
    });
    if (!role) {
      throw new BadRequestException('该角色不存在');
    }
    // 防止数组中有字符类型
    const menuList = keepNumberArray(body.menus);
    // 筛选出有效的菜单id
    const menus = await this.prisma.tMenu.findMany({
      where: {
        OR: menuList.map((e) => ({ id: e })),
      },
    });
    const result = await this.prisma.tMenuChild.createMany({
      data: menus.map((e) => ({ roleId: body.roleId, menuId: e.id })),
      skipDuplicates: true,
    });

    console.log(menus);
    return resultMany({
      success: result.count,
      error: body.menus.length - result.count,
      name: '菜单',
    });
  }

  // todo 添加菜单
  async addMenus(body: AddMenuDto) {
    const result = await this.prisma.tMenu.createMany({
      data: body.menus.map((e) => ({ menuName: e })),
      skipDuplicates: true,
    });

    return resultMany({
      error: body.menus.length - result.count,
      success: result.count,
      name: '菜单',
    });
  }

  // todo 获取所有菜单
  getAllMenu() {
    return this.prisma.tMenu.findMany({});
  }

  // todo 获取当前用户的菜单
  async getCurrentMenu(id: number) {
    const roleList = await this.prisma.tRoleChild.findMany({
      where: { userId: id },
    });
    const menuList = await this.prisma.tMenuChild.findMany({
      where: {
        OR: roleList.map((e) => ({ roleId: e.roleId })),
      },
    });
    const menuNameList = await this.prisma.tMenu.findMany({ where: { OR: menuList.map((e) => ({ id: e.menuId })) } });
    return menuNameList;
  }

  // todo 获取当前用户的角色
  async getCurrentUserRole(id: number) {
    const roleList = await this.prisma.tRoleChild.findMany({
      where: { userId: id },
    });
    const roleNameList = await this.prisma.tRole.findMany({
      where: {
        OR: roleList.map((e) => ({ id: e.roleId })),
      },
    });
    return roleNameList;
  }
  // todo 获取某用户的角色
  async userRoleList(id: number) {
    const user = await this.prisma.isUserHave({ id: id });
    if (!user) {
      throw new BadRequestException('该用户不存在');
    }
    const roleList = await this.prisma.tRoleChild.findMany({
      where: {
        userId: user.id,
      },
    });
    const roleNameList = await this.prisma.tRole.findMany({
      where: {
        OR: roleList.map((e) => ({ id: e.roleId })),
      },
    });
    return roleNameList;
  }
  // todo 为某用户删除角色
  async delUserRole(body: delUserRoleDto) {
    // 验证用户是否存在
    const result = await this.prisma.isUserHave({ id: body.userId });
    if (!result) {
      throw new BadRequestException('该用户不存在');
    }
    // 如果是对admin账户删除admin角色那么不允许操作
    if (result.userName === rootName) {
      const role = await this.prisma.tRole.findUnique({
        where: {
          id: body.roleId,
        },
      });
      if (role.roleName === rootName) {
        throw new BadRequestException(noHandleRoot);
      }
    }
    // 其它情况均可删除
    const delResult = await this.prisma.tRoleChild.deleteMany({
      where: {
        userId: body.userId,
        roleId: body.roleId,
      },
    });
    const roleinfo = await this.prisma.tRole.findUnique({
      where: {
        id: body.roleId,
      },
    });
    let text = '';
    let success = 0;
    if (delResult.count) {
      if (roleinfo) {
        text = `已删除${result.userName}用户的-[${roleinfo.roleName}]-角色`;
        success++;
      } else {
        text = `角色ID${body.roleId}是无效的,已清除存在的记录`;
        success++;
      }
    } else {
      text = `该用户未拥有此角色`;
    }

    return {
      message: text,
      success,
      error: 1 - success,
    };
  }
  // todo 为某用户添加角色
  async userAddRole(body: userAddRoleDto) {
    // 验证用户是否存在
    const result = await this.prisma.isUserHave({ id: body.userId });
    if (!result) {
      throw new BadRequestException('该用户不存在');
    }
    // 去掉非number类型的数值
    const roles = keepNumberArray(body.roles);

    // 筛选有效的权限id
    const roleList = await this.prisma.tRole.findMany({
      where: {
        OR: roles.map((e) => ({ id: e })),
      },
    });

    const roleChild = await this.prisma.tRoleChild.createMany({
      data: roleList.map((e) => ({ userId: body.userId, roleId: e.id })),
      skipDuplicates: true,
    });
    return resultMany({
      error: body.roles.length - roleChild.count,
      success: roleChild.count,
      name: '角色',
    });
  }
  // todo 添加角色
  async addRole(body: AddRoleDto) {
    const result = await this.prisma.tRole.createMany({
      data: body.roles.map((e) => ({ roleName: e })),
      skipDuplicates: true,
    });
    return resultMany({
      error: body.roles.length - result.count,
      success: result.count,
      name: '角色',
    });
  }
  // todo 获取所有角色
  getAllRole() {
    return this.prisma.tRole.findMany({});
  }
}
