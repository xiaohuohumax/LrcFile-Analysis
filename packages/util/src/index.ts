import { LrcParser, Lrc, Lyric, ParserConfig } from '@xiaohuohumax/lrc-parser';

export * from '@xiaohuohumax/lrc-parser';

export interface UtilConfig {
  // 是否启用模糊匹配
  fuzzy: boolean
  // 解析器配置
  parserConfig: ParserConfig
}

// 默认配置
export const DEF_UTIL_CONFIG: UtilConfig = {
  fuzzy: true,
  parserConfig: {
    lyricAddOffset: true
  }
};

export class LrcUtil {
  protected lrcParser: LrcParser;
  protected lrc!: Lrc;
  protected time: number = 0;
  protected lyricsIndex = -1;

  /**
   * @param scource LRC文件数据
   * @param config 配置 
   */
  constructor(private scource: string, private config: UtilConfig = DEF_UTIL_CONFIG) {
    this.lrcParser = new LrcParser(config.parserConfig);
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

  private init(): void {
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
    const { fuzzy } = this.config;

    const startIndex = time <= this.time ? -1 : this.lyricsIndex;
    this.time = time;
    for (let i = startIndex + 1; i < lyrics.length; i++) {
      const lyric = lyrics[i];
      if (fuzzy) {
        if (lyric.time <= this.time) {
          this.lyricsIndex = i;
          continue;
        }
      } else if (lyric.time == this.time) {
        this.lyricsIndex = i;
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