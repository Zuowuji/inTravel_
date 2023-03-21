import { applyDecorators, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

interface GPostOptions {
  url: string;
  summary: string;
  description?: string;
}

interface GGetOptions {
  url: string;
  summary: string;
  description?: string;
}

export function GPost(options: GPostOptions) {
  return applyDecorators(
    Post(options.url),
    ApiOperation({ summary: options.summary, description: options.description ?? '' }),
  );
}

export function GGet(options: GGetOptions) {
  return applyDecorators(
    Get(options.url),
    ApiOperation({ summary: options.summary, description: options.description ?? '' }),
  );
}
