import { ParserConfig, DEF_PARSER_CONFIG } from '@xiaohuohumax/lrc-parser';

/**
 * 解析工具配置
 */
export interface UtilConfig {
  /**是否启用模糊匹配 */
  useFuzzy?: boolean
  /**解析器配置 */
  parserConfig?: ParserConfig
}

/**
 * 默认配置
 */
export const DEF_UTIL_CONFIG: Required<UtilConfig> = {
  useFuzzy: true,
  parserConfig: DEF_PARSER_CONFIG
};