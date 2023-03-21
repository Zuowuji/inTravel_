import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  PayloadTooLargeException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Response, Request } from 'express';
import { noAuthText } from '../../config/app.config';
import { isExistChinese } from '../implement/implement';

@Catch()
export class MExcetionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取上下文
    const request = ctx.getRequest<Request>(); // 获取请求的信息
    const response = ctx.getResponse<Response>(); // 获取响应对象

    let message = '其它异常,可联系管理';
    let code = HttpStatus.UNAUTHORIZED;
    console.log(exception);
    if (exception instanceof TypeError) {
      // todo
      message = exception.message;
    } else if (exception instanceof UnauthorizedException) {
      // todo
      message = noAuthText;
      code = (exception as UnauthorizedException).getStatus();
    } else if (exception instanceof NotFoundException) {
      // todo
      message = '失败:建议检查formdataId,接口路径,传参方式,文件类型等信息';
      code = (exception as NotFoundException).getStatus();
    } else if (exception instanceof PrismaClientKnownRequestError) {
      // todo
      message = '值的类型是错误的';
      code = Number((exception as PrismaClientKnownRequestError).code);
    } else if (exception instanceof MethodNotAllowedException) {
      // todo
      message = '文件类型错误';
      code = (exception as MethodNotAllowedException).getStatus();
    } else if (exception instanceof BadRequestException) {
      // todo
      const responseObject = exception.getResponse() as BadRequestException; // 获取错误对象
      message = isExistChinese(responseObject.message) ? responseObject.message : '参数错误,类型/字段是否有误'; // 错误消息
      code = exception.getStatus(); // 错误状态码
    } else if (exception instanceof PayloadTooLargeException) {
      // todo
      message = (exception as PayloadTooLargeException).message; // 错误消息
      if (message == 'File too large') {
        message = '超出文件大小限制';
      }
      code = exception.getStatus(); // 错误状态码
    } else if (exception instanceof ForbiddenException) {
      // todo
      message = '禁止访问'; // 错误消息
      code = exception.getStatus(); // 错误状态码
    }

    return response.status(code).json({
      message: message,
      time: new Date().getTime(),
      success: false,
      path: request.url,
      code: code,
    });
  }
}
