import { BadRequestException, Injectable } from '@nestjs/common';
import { TUser } from '@prisma/client';
import { delFile } from '../common/implement/implement';
import { File, rootName } from '../config/app.config';
import { PrismaService } from '../prisma/prisma.service';

interface FileListFindWhereType {
  id?: number;
  userId?: number;
}

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) {}
  // todo 删除某个文件
  async delfile(fileId: number, user: TUser) {
    const where: FileListFindWhereType = {
      id: fileId,
    };
    if (user.userName != rootName) {
      where.userId = user.id;
    }
    const file = await this.prisma.tFileList.findFirst({
      where,
    });

    if (!file) {
      throw new BadRequestException('文件不存在/无权操作');
    }

    // 开始删除
    try {
      await delFile({ filename: file.filename, type: file.type });

      await this.prisma.tFileList.delete({ where: { id: file.id } });

      return '删除成功';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // todo 查看所有的文件列表
  getAllFileList() {
    return this.prisma.tFileList.findMany();
  }

  // todo 查某用户的文件列表
  async getUserToFileList(userId: number) {
    const user = await this.prisma.isUserHave({ id: userId });
    if (!user) {
      throw new BadRequestException('该用户不存在');
    }
    const filelist = await this.prisma.tFileList.findMany({
      where: {
        userId: userId,
      },
    });
    return filelist;
  }

  // todo 获取单个文件的信息
  getFileItemInfo(userId: number, fileId: number, filename: string, type: string) {
    return this.prisma.tFileList.findFirst({
      where: {
        userId,
        id: fileId,
        filename,
        type,
      },
    });
  }

  // todo 上传excel
  async upExcel(file_: Express.Multer.File, userId: number) {
    const param = {
      size: file_.size + '',
      type: File.excelFileFormDataId,
      path: File.excelAccessProffix + '/' + file_.filename,
      name: file_.originalname,
      userId: userId,
      filename: file_.filename,
    };
    const result = await this.prisma.tFileList.createMany({
      data: param,
      skipDuplicates: true,
    });
    if (result.count <= 0) {
      throw new BadRequestException('该文件已经存在');
    }
    return param;
  }

  // todo 上传图片
  async upImage(file_: Express.Multer.File, userId: number) {
    const param = {
      size: file_.size + '',
      type: File.imageFileFormDataId,
      path: File.imageAccessProffix + '/' + file_.filename,
      name: file_.originalname,
      userId: userId,
      filename: file_.filename,
    };
    const result = await this.prisma.tFileList.createMany({
      data: param,
      skipDuplicates: true,
    });
    if (result.count <= 0) {
      throw new BadRequestException('该文件已经存在');
    }
    return param;
  }

  // todo 上传头像
  async upAvatar(file_: Express.Multer.File, userId: number) {
    const param = {
      size: file_.size + '',
      type: File.avatarFileFormDataId,
      path: File.avatarAccessProffix + '/' + file_.filename,
      name: file_.originalname,
      userId: userId,
      filename: file_.filename,
    };
    const result = await this.prisma.tFileList.createMany({
      data: param,
      skipDuplicates: true,
    });
    if (result.count <= 0) {
      throw new BadRequestException('该文件已经存在');
    }
    return param;
  }
}
