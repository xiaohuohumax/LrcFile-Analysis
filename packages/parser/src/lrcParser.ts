import { ENTER_RE, INFO_LENGTH_TIME_RE, INFO_RE, TIME_LYRIC_RE, TIME_RE, WORD_TIME_RE } from './re';
import { DEF_GENDER_MATCH_RULE, DEF_PARSER_CONFIG, GenderMatchRule, ParserConfig } from './config';
import { Lrc, Lyric, Gender, Word } from './lrc';
import { timeCount } from './util';

/**
 * 歌词行
 */
interface Line {
  lNumber: number,
  lData: string
}

/**
 * 性别匹配规则按顺序合并为字符串
 * @param matchRule 匹配规则
 * @returns 合并字符串
 */
function genderMatchRuleToStr(matchRule: GenderMatchRule): string {
  return matchRule.F + matchRule.D + matchRule.M;
}

/**
 * LRC歌词解析器
 */
export class LrcParser {

  /**解析器配置 */
  protected config: Required<ParserConfig>;

  constructor(config?: ParserConfig) {
    // 简单克隆
    this.config = JSON.parse(JSON.stringify(DEF_PARSER_CONFIG));

    config && Object
      .entries(config)
      .forEach(([key, value]) => value != undefined && (this.config[<keyof ParserConfig>key] = value));

    const defGender = genderMatchRuleToStr(DEF_GENDER_MATCH_RULE);
    const hasDef = this.config.genderMatchRules.some(g => genderMatchRuleToStr(g) == defGender);
    !hasDef && this.config.genderMatchRules.unshift(DEF_GENDER_MATCH_RULE);
  }

  /**
   * 解析lrc文件
   * @param source lrc 文件数据
   * @returns Lrc 解析对象
   */
  public parser(source: string): Lrc {
    const { useOffsetTime, useGenderExt, useWordTimeExt } = this.config;

    // 基础标准解析
    const lrc: Lrc = this.parserBase(source);

    // 性别扩展
    useGenderExt && this.genderExt(lrc);

    // 单词时间扩展
    useWordTimeExt && this.wordTimeExt(lrc);

    // 处理meta信息
    this.updateMeta(lrc);

    // 修改偏移时间
    useOffsetTime && this.offsetTime(lrc);

    return lrc;
  }

  /**
   * 解析信息
   * @param line 行数据
   * @param lrc Lrc
   * @returns 是否获取到消息
   */
  protected lineToInfo(line: Line, lrc: Lrc): boolean {
    const match = line.lData.match(INFO_RE);
    if (match == null) {
      return false;
    }

    const [, title, value] = match;
    lrc.info[title] = value.trim();

    return true;
  }

  /**
   * 解析歌词
   * @param line 行数据
   * @param lrc Lrc
   */
  protected lineToLyric({ lData, lNumber }: Line, lrc: Lrc): void {
    const match = lData.match(TIME_LYRIC_RE);
    if (match == null) {
      return;
    }

    const [, times, lyric] = match;
    const nLyrics: Lyric[] = Array.from(times.matchAll(TIME_RE))
      .map(match => timeCount(match.slice(1)))
      .map(start => ({
        line: lNumber,
        source: lData,
        lyric,
        start,
        end: null,
        gender: null,
        words: []
      }));

    lrc.lyrics.push(...nLyrics);
  }

  /**
   * 基础解析器
   * @param source lrc 文件数据
   * @returns Lrc
   */
  protected parserBase(source: string): Lrc {
    const lrc: Lrc = this.getBaseLrc();

    if (typeof (source) != 'string') {
      return lrc;
    }

    // 按行分割
    const lines: Line[] = source
      .split(ENTER_RE)
      .map((lData, index) => ({ lNumber: index + 1, lData }));

    if (lines.length == 0) {
      return lrc;
    }

    for (const line of lines) {
      // 处理信息标签
      if (this.lineToInfo(line, lrc)) {
        continue;
      }
      this.lineToLyric(line, lrc);
    }

    // 降序排列计算结束时间
    // 再升序除去空标签
    let start: number | null = null;
    lrc.lyrics = lrc.lyrics
      .sort((a, b) => a.start < b.start ? 1 : -1)
      .map(lyric => {
        lyric.end = start;
        start = lyric.start;
        return lyric;
      })
      .reverse()
      .filter(l => l.lyric.trim() != '');

    return lrc;
  }

  /**
   * 获取Lrc默认对象
   * @returns Lrc
   */
  protected getBaseLrc(): Lrc {
    return {
      info: {},
      meta: { offset: 0, length: null, hasGender: false, hasWordTime: false },
      lyrics: []
    };
  }

  /**
   * 演唱者性别扩展
   * @param lrc Lrc
   */
  protected genderExt(lrc: Lrc): void {
    const { genderMatchRules } = this.config;

    let beforeGender: Gender = null;

    function matchGender(lyric: Lyric) {
      for (const genderMatchRule of genderMatchRules) {
        for (const [gender, genderRe] of Object.entries<string>(genderMatchRule)) {
          const match = lyric.lyric.match(new RegExp(genderRe, 'i'));
          if (match == null) {
            continue;
          }
          lyric.gender = <Gender>gender.toUpperCase();
          lyric.lyric = lyric.lyric.slice(match[0].length);
          beforeGender = lyric.gender;
          return;
        }
      }
      lyric.gender = beforeGender;
    }

    lrc.lyrics.forEach(matchGender);
  }

  /**
   * 单词时间扩展
   * @param lrc Lrc
   */
  protected wordTimeExt(lrc: Lrc): void {
    const { lyrics } = lrc;

    function matchWordTime(lyric: Lyric) {
      const { lyric: lData } = lyric;

      const match = Array.from(lData.matchAll(WORD_TIME_RE));
      if (match.length == 0) {
        return;
      }

      let lIndex = 0, beforeEnd = lyric.start, nLyric = '';

      const words: Word[] = match
        .map(m => {
          const word = lData.substring(lIndex, m.index);

          const start = beforeEnd;
          lIndex = m.index! + m[0].length;
          beforeEnd = timeCount(m.slice(1));

          const index = nLyric.length;
          nLyric += word;

          return {
            index,
            word,
            start,
            end: beforeEnd
          };
        })
        .filter(w => w.word.trim() != '');

      // 补充其余的歌词 <mm:ss.xx> word
      lIndex < lData.length
        && (nLyric += lData.substring(lIndex, lData.length));

      lyric.lyric = nLyric;
      lyric.words = words;
    }

    lyrics.forEach(matchWordTime);
  }

  /**
   * 更新统计元数据
   * @param lrc Lrc
   */
  protected updateMeta(lrc: Lrc): void {
    for (const [title, value] of Object.entries(lrc.info)) {
      switch (title.toLocaleLowerCase()) {
        case 'offset': {
          // 偏移时间
          lrc.meta.offset += parseInt(value);
          delete lrc.info['offset'];
          break;
        }
        case 'length': {
          // 时长
          const lMatch = value.match(INFO_LENGTH_TIME_RE);
          if (lMatch) {
            lrc.meta.length = timeCount(['0', ...lMatch.slice(1, 3), '0']);
            delete lrc.info['length'];
          }
          break;
        }
      }
    }
    // 性别
    lrc.meta.hasGender = lrc.lyrics.some(l => l.gender != null);
    // 单词时间
    lrc.meta.hasWordTime = lrc.lyrics.some(l => l.words.length > 0);
  }

  /**
   * 歌词和单词添加偏移时间
   * @param lrc Lrc
   */
  protected offsetTime(lrc: Lrc): void {
    const { lyrics, meta: { offset } } = lrc;
    lyrics.forEach(lyric => {
      lyric.start += offset;
      lyric.end && (lyric.end += offset);
      lyric.words.forEach(word => {
        word.start += offset;
        word.end += offset;
      });
    });
  }
}