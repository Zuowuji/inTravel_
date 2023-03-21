import { join } from 'path';
// jwt设置密钥的那个键名
export const jwtEnvKey = 'token_secret';

// 超管用户名
export const rootName = 'admin';

// 账号停用提示
export const accountStopText = '您的账号已停用,请联系管理恢复使用';

// 无操作权限提示
export const noAuthText = '抱歉!您没有操作权限';

// 禁止操作超管账号提示
export const noHandleRoot = '禁止操作超管账号';

// 文件管理
export const File = {
  // 图片部分
  imageFilePath: join(__dirname, '../files/images'), //图片存储路径
  imageFileMimeType: 'image', // image MIME类型限制
  imageFileFormDataId: 'image', // 图片文件传输formdata id
  imageAccessProffix: '/images', // image文件访问前缀
  imageMaxSizeLimit: 3, // // 文件大小限制(单位m)
  // excel部分
  excelFilePath: join(__dirname, '../files/excels'), // excel文件存储路径
  excelFileMimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // excel MIME类型限制
  excelFileFormDataId: 'xlsx',
  excelAccessProffix: '/excel', // 资源访问前缀
  excelMaxSizeLimit: 3,
  // 头像部分
  avatarFilePath: join(__dirname, '../files/avatars'), //图片存储路径
  avatarFileMimeType: 'image', // image MIME类型限制
  avatarFileFormDataId: 'avatar', // 图片文件传输formdata id
  avatarAccessProffix: '/avatars', // image文件访问前缀
  avatarMaxSizeLimit: 3, // // 文件大小限制(单位m)
  baseHttp: 'localhost:3000', // 录入数据库是否要添加一个ip
};
