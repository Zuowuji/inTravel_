import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import { File } from '../../config/app.config';

// todo 是否只包含字母跟数字(不能有空格)
export function isLetterAndNumber(str: string): boolean {
  const reg = /^[A-Za-z0-9]+$/;
  return reg.test(str);
}

// todo 是否存在中文
export function isExistChinese(str: string) {
  const reg = new RegExp('[\u4E00-\u9FA5]');
  return reg.test(str);
}

// todo 保留数组中的数字类型
export function keepNumberArray(array: any[]) {
  return array.reduce((a, b) => {
    if (typeof b === 'number' && !isNaN(b)) {
      a.push(b);
    }
    return a;
  }, []);
}

// todo 结果返回集:批量添加时的返回提示

interface ResultManyType {
  success: number;
  error: number;
  name: string;
}
export function resultMany(options: ResultManyType) {
  return {
    success: options.success,
    error: options.error,
    message: `添加结果:成功${options.success}个,失败${options.error},如有失败,请仔细检查参数值是否符合要求,${options.name}是否已经存在`,
  };
}

// todo 删除某个文件
interface DelFileOptionsType {
  type: string;
  filename: string;
}
export function delFile(options: DelFileOptionsType) {
  const delfilefn = (filePath: string) =>
    new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  let filepath = '';
  switch (options.type) {
    case File.excelFileFormDataId:
      filepath = File.excelFilePath + '/' + options.filename;
      return delfilefn(filepath);
    case File.imageFileFormDataId:
      filepath = File.imageFilePath + '/' + options.filename;
      return delfilefn(filepath);
    default:
      throw new BadRequestException('请联系管理对该类型文件做删除处理');
  }
}
