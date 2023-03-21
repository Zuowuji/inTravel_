import { compareSync, hashSync } from 'bcryptjs';

// todo 创建一个加盐的密码,默认是10
export function createHashPassword(password: string, slat = 10): string {
  const hashPassword = hashSync(password, slat);
  return hashPassword;
}

// todo 验证字符1与加盐后的字符2是否一致
export function comparePassword(password: string, encryptPassword: string): boolean {
  const check = compareSync(password, encryptPassword);
  return check;
}
