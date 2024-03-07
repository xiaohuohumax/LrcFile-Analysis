import { Gender } from './lrc';

/**
 * 性别匹配规则
 */
export type GenderMatchRule = {
  [gender in Exclude<Gender, null>]: string
}

/**
 * 解析器配置
 */
export interface ParserConfig {
  /**是否给歌/单词添加偏移时间 */
  useOffsetTime?: boolean

  /**是否开启性别扩展 */
  useGenderExt?: boolean
  /**性别标识 */
  genderMatchRules?: GenderMatchRule[]

  /**是否开启单词时间扩展 */
  useWordTimeExt?: boolean
}

/**
 * 默认性别匹配规则
 */
export const DEF_GENDER_MATCH_RULE: GenderMatchRule = {
  F: '\\s*F:\\s*',
  M: '\\s*M:\\s*',
  D: '\\s*D:\\s*'
};

/**
 * 解析器默认配置
 */
export const DEF_PARSER_CONFIG: Required<ParserConfig> = {
  useOffsetTime: true,
  useGenderExt: true,
  genderMatchRules: [],
  useWordTimeExt: true
};