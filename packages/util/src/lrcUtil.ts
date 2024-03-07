import { LrcParser, Lrc, Lyric } from '@xiaohuohumax/lrc-parser';
import { DEF_UTIL_CONFIG, UtilConfig } from './config';

/**
 * LRC歌词解析工具
 */
export class LrcUtil {

  protected config: Required<UtilConfig>;
  protected lrcParser: LrcParser;
  protected lrc!: Lrc;
  protected time: number = 0;
  protected lyricsIndex = -1;

  /**
   * @param scource LRC文件数据
   * @param config 配置 
   */
  constructor(protected scource: string, config?: UtilConfig) {
    this.config = Object.assign(DEF_UTIL_CONFIG);

    config && Object
      .entries(config)
      .forEach(([key, value]) => value != undefined && (this.config[<keyof UtilConfig>key] = value));

    this.lrcParser = new LrcParser(this.config.parserConfig);
    this.init();
  }

  /**
   * 替换LRC歌词数据
   * @param source 新的LRC歌词数据
   */
  public replaceScource(source: string): void {
    this.scource = source;
    this.init();
  }

  /**
   * 初始化
   */
  protected init(): void {
    this.lyricsIndex = 0;
    this.lrc = this.lrcParser.parser(this.scource);
  }

  /**
   * 获取LRC歌词解析信息
   * @returns LRC歌词解析信息
   */
  public getLrc(): Lrc {
    return this.lrc;
  }

  /**
   * 设置当前时间
   * @param time 当前时间毫秒
   */
  public setTime(time: number): void {
    const { lyrics } = this.lrc;
    const { useFuzzy: fuzzy } = this.config;

    const startIndex = time <= this.time ? 0 : this.lyricsIndex + 1;
    this.time = time;

    for (const [index, lyric] of lyrics.slice(startIndex).entries()) {
      if (fuzzy) {
        if (lyric.start <= this.time) {
          this.lyricsIndex = startIndex + index;
          continue;
        }
      } else if (lyric.start == this.time) {
        this.lyricsIndex = startIndex + index;
        break;
      }
    }
  }

  /**
   * 获取当前歌词信息
   * @returns 当前歌词信息
   */
  public getLyric(): Lyric {
    return this.lrc.lyrics[this.lyricsIndex];
  }

  /**
   * 获取下一句歌词信息
   * @returns 下一句歌词信息
   */
  public getNextLyric(): Lyric | undefined {
    return this.lrc.lyrics[this.lyricsIndex + 1];
  }

  /**
   * 获取当前歌词的下标
   * @returns 当前歌词下标
   */
  public getLyricsIndex(): number {
    return this.lyricsIndex;
  }
}