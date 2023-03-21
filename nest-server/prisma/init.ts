// todo 初始化文件: npx prisma migrate dev (会跟随 npx prisma db seed)

import { PrismaClient } from '@prisma/client';

async function initRun() {
  const prisma = new PrismaClient();
  const rootUser = await prisma.tUser.create({
    data: {
      password: '$2a$10$n5gUy8AdVjOIj0NsidbT3eVvndHyT8v6ELsEiU3tAG6KfcdOmNvsO',
      userName: 'admin',
      nikeName: '超管',
      email: '2282249330@qq.com',
      github: 'https://github.com/noviceusr',
      qq: '2282249330',
      isDel: false,
      wechat: '728639925',
    },
  });
  const rootRole = await prisma.tRole.create({
    data: {
      roleName: 'admin',
    },
  });
  const ruselt = await prisma.tRoleChild.create({
    data: {
      userId: rootUser.id,
      roleId: rootRole.id,
    },
  });
  console.log(ruselt);
}

initRun();
