# Run

```shell
1.

拉取源码
git clone git@gitee.com:case-base/in-travel_nestjs.git

```

```shell
2.

准备数据库,创建以下两个数据库,可以使用下面提供的sql语句命令行创建

in_travel
in_travel_bak


mysql语句:
	创建in_travel:
		CREATE DATABASE in_travel DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
	创建in_travel_bak:
		CREATE DATABASE in_travel_bak DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

```shell
3.

配置 .env 文件,修改下面两个属性,将括号内的替换掉就行,包括括号本身也是

DATABASE_URL="mysql://(数据库账号):(数据库密码)@(IP地址):(端口)/in_travel"

DATABASE_BAK_URL="mysql://(数据库账号):(数据库密码)@(IP地址):(端口)/in_travel_bak"

例如:
	DATABASE_URL="mysql://inTravel:123456@localhost:3306/in_travel"
```

```shell
4.

安装依赖

pnpm i
```

```shell
5.

数据库迁移
!!: prisma目录下如果有migrations目录,需要先将migrations目录删除,这是一个记录版本的,暂时不需要,数据库有数据时迁移留着会报错~
删除后运行命令:

npx prisma migrate dev
```

```
6.

启动服务

pnpm run start:dev
```

# Introduction

## 权限功能

```
        1. 登录
            1.1 注册: 目的就是录入一个自己的账号(默认已录入admin账户,并分配了一个admin超管的角色)
            1.2 登录: 目的就是登录自己的账号,后会响应一个token,90%的接口是都需要token验证的
```

## 用户功能(非 admin 角色):

```
        1. 表格模块:
            1.1 普通渲染: 根据给出的员工信息将其渲染成表格
            1.2 表格导入: 根据下载的excel模板,在模板填入相关信息,然后将表格导入,读取到页面当中并将数据提交到服务
            1.3 表格导出: 将现有的表格数据导出成excel表,表中需要对工资5k以上或者职位为管理员的进行标注(设置一个背景色)
            1.4 员工增删改: 对员工表的增删改查
        2. 文件模块:
            2.1 文件列表: 列出当前用户的文件信息
            2.2 增删: 对图片/excel表进行删除或者上传或者下载(响应的是arraybuffer流)
            2.3 更新头像: 头像是单独的目录进行管理
```

`!! 如果不在项目中写分权限的页面(比如分配权限,创建角色,账号管理,菜单管理),下面这些功能可不看,使用上面的功能即可`

## 超管功能(admin 角色持有):

```
        '删除/停用 对admin账户admin角色操作无效,会被拒绝,因为这是超管账号'
        1. 权限模块:
           1.1 查看所有用户的账号信息
           1.2 停用/开启 某个账户,停用账户后,所有的接口不能调用,包括登录,直接响应"禁止访问"
        2. 角色模块
            2.1 角色管理: 创建多个角色,每个角色会拥有不同的接口访问权和拥有的菜单列表,然后可以将角色分配给某个账号,使这个账号拥有这些权限,当删除某个账号的某个角色时,同理,它将失去这些权限
            2.2 菜单管理: 创建多个菜单,主要用来管理前端的页面,每个菜单对应这一个页面的id或者唯一键,这些菜单将会被分配到不同的角色上去,不同角色拥有一些不同的菜单!
        3. 文件模块
            3.1 跟其它账号不同,admin账号/角色拥有所有文件的查看/删除权
```
