import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Request,
  Res,
  SetMetadata,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GGet, GPost } from '../common/decrator/http.decrator';
import { Upload } from '../common/decrator/upload.decrator';
import { File, rootName } from '../config/app.config';
import { DownExcelDto, DownImageDto } from './dto/upload.dto';
import { UploadService } from './upload.service';
import { zip } from 'compressing';
import { Response } from 'express';
import { RoleGuard } from '../auth/auth.guard';

@Controller('upload')
@ApiTags('文件模块')
@UseGuards(RoleGuard)
@UseGuards(AuthGuard('jwt'))
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @SetMetadata('role', [rootName])
  @GGet({ url: 'filelist/:userId', summary: '查某用户的文件列表' })
  getUserToFileList(@Param('userId', ParseIntPipe) userId) {
    return this.uploadService.getUserToFileList(userId);
  }

  @GGet({ url: 'currentfilelist', summary: '查当前用户的文件列表' })
  getCurrentUserToFileList(@Request() req) {
    return this.uploadService.getUserToFileList(req.user.id);
  }

  @SetMetadata('role', [rootName])
  @GGet({ url: 'allfilelist', summary: '查看所有文件信息' })
  getAllfilelist() {
    return this.uploadService.getAllFileList();
  }

  @GGet({ url: 'delfile/:fileid', summary: '删除某个文件' })
  getDelfile(@Param('fileid', ParseIntPipe) fileid: number, @Request() req) {
    return this.uploadService.delfile(fileid, req.user);
  }

  @GPost({ url: 'downImage', summary: '下载图片' })
  async downImage(@Body() body: DownImageDto, @Request() req, @Res() res: Response) {
    const fileInfo = await this.uploadService.getFileItemInfo(
      req.user.id,
      body.imageId,
      body.imageFileName,
      File.imageFileFormDataId,
    );
    if (!fileInfo) {
      throw new BadRequestException('该用户不存在该文件');
    }
    const url = File.imageFilePath + '/' + fileInfo.filename;
    const tarStream = new zip.Stream();
    await tarStream.addEntry(url);

    res.setHeader('Content-Type', 'application/octet-stream');

    res.setHeader('Content-Disposition', `attachment; filename=intravel_image`);
    tarStream.pipe(res);
  }

  @GPost({ url: 'downExcel', summary: '下载excel' })
  async downExcel(@Body() body: DownExcelDto, @Request() req, @Res() res: Response) {
    const fileInfo = await this.uploadService.getFileItemInfo(
      req.user.id,
      body.excelId,
      body.excelFileName,
      File.excelFileFormDataId,
    );
    if (!fileInfo) {
      throw new BadRequestException('该用户不存在该文件');
    }
    const url = File.excelFilePath + '/' + fileInfo.filename;
    const tarStream = new zip.Stream();
    await tarStream.addEntry(url);

    res.setHeader('Content-Type', 'application/octet-stream');

    res.setHeader('Content-Disposition', `attachment; filename=intravel_excel`);
    tarStream.pipe(res);
  }

  @Upload({
    filePath: File.avatarFilePath,
    formdataId: File.avatarFileFormDataId,
    maxSize: File.avatarMaxSizeLimit,
    mimeType: File.avatarFileMimeType,
  })
  @GPost({ url: 'upAvatar', summary: '更新头像' })
  upAvatar(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('上传失败');
    }
    return this.uploadService.upAvatar(file, req.user.id);
  }

  @Upload({
    filePath: File.imageFilePath,
    formdataId: File.imageFileFormDataId,
    maxSize: File.imageMaxSizeLimit,
    mimeType: File.imageFileMimeType,
  })
  @GPost({ url: 'upImage', summary: '上传图片' })
  upImage(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('上传失败');
    }
    return this.uploadService.upImage(file, req.user.id);
  }

  @Upload({
    filePath: File.excelFilePath,
    formdataId: File.excelFileFormDataId,
    maxSize: File.excelMaxSizeLimit,
    mimeType: File.excelFileMimeType,
  })
  @GPost({ url: 'upExcel', summary: '上传excel' })
  upExcel(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('上传失败');
    }
    return this.uploadService.upExcel(file, req.user.id);
  }
}
