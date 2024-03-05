export interface Info {
  [title: string]: string
}

export interface Meta {
  offset: number
  tag: boolean
}

// M: 男性, F: 女性, D: 合唱
export type Tag = 'M' | 'F' | 'D'

export interface Lyric {
  time: number
  lyric: string
  tag?: Tag
}

export interface Lrc {
  info: Info
  meta: Meta
  lyrics: Lyric[]
}

export interface ParserConfig {
  // 是否将解析好的歌词时间添加偏移时间?
  lyricAddOffset: boolean
}

// 默认配置
export const DEF_PARSER_CONFIG: ParserConfig = {
  lyricAddOffset: false
};

const ENTER_RE = /(\r?\n)|\r/i;
const LABEL_RE = /\[(\w+:[^\]]*?)\]/i;
const INFO_RE = /^\[([a-z]+):([^\]]*)\]$/i;
const TIME_LYRIC_RE = /^((?:\[\d{2}:\d{2}(?:\.\d{2,3})?\]\s*)+)(.*)$/i;
const TAG_RE = /^\s*([FMD]):\s+/i;

const TIME_RE = /(\d{2}):(\d{2})(?:\.(\d{2,3}))?/ig;
const TIME_STEEP = [60000, 1000, 1];

// 时间计算
function timeCount(times: string[]) {
  return TIME_STEEP.map((steep, index) => parseInt(times[index]) * steep || 0)
    .reduce((x, y) => x + y);
}

export class LrcParser {
  constructor(protected config: ParserConfig = DEF_PARSER_CONFIG) { }
  public parser(source: string): Lrc {
    const lrc: Lrc = {
      info: {},
      meta: { offset: 0, tag: false },
      lyrics: []
    };

    if (typeof (source) !== 'string') {
      return lrc;
    }

    const lines = source
      .split(ENTER_RE)
      .filter(line => line.trim() !== '');

    // 处理换行歌词
    for (let i = lines.length - 1; i > 0; i--) {
      const line = lines[i].trimStart();
      if (!line.startsWith('[') || line.match(LABEL_RE) == null) {
        lines[i - 1] += lines[i];
        lines.splice(i, 1);
      }
    }
    let beforeTag: Tag;

    function parserLine(line: string) {
      // 处理信息标签
      const infoMatch = line.match(INFO_RE);
      if (infoMatch != null) {
        const title = infoMatch[1];
        const data = infoMatch[2];

        if (title === 'offset') {
          lrc.meta.offset += parseInt(data);
        } else {
          lrc.info[title] = data;
        }
        return;
      }
      // 处理歌词信息
      const lyricMatch = line.match(TIME_LYRIC_RE);
      if (lyricMatch != null) {
        const times = lyricMatch[1];
        let lyric = lyricMatch[2];

        // 处理合唱标志
        let tag: Tag | undefined;
        const tagMatch = lyric.match(TAG_RE);
        if (tagMatch != null) {
          lrc.meta.tag = true;
          tag = <Tag>tagMatch[1].toUpperCase();
          beforeTag = tag;
          lyric = lyric.slice(tagMatch[0].length);
        } else if (lrc.meta.tag) {
          tag = beforeTag;
        }

        for (const timeMatch of times.matchAll(TIME_RE)) {
          // 时间
          const time = timeCount(timeMatch.slice(1));

          lrc.lyrics.push({
            time,
            tag,
            lyric
          });
        }
      }
    }

    lines.forEach(parserLine);

    // 添加偏移
    if (this.config.lyricAddOffset) {
      lrc.lyrics.forEach(lyric => {
        lyric.time += lrc.meta.offset;
      });
    }

    return lrc;
  }
}