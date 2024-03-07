import { version as pv } from '../package.json';

export * from './lrc';
export * from './lrcParser';
export * from './config';

/**
 * 版本号
 */
export const version = pv;