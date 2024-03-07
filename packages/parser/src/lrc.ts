
/**
 * 歌词信息
 * 
 * 例如:
 * 
 * ```text
 * [ar:Lyrics artist]
 * [al:Album where the song is from]
 * [ti:Lyrics (song) title]
 * ```
 */
export interface Info {
  [title: string]: string
}

/**
 * 歌词元数据
 */
export interface Meta {
  /**歌词偏移时间 毫秒 */
  offset: number
  /**歌曲时长 */
  length: number | null
  /**是否使用性别标识 */
  hasGender: boolean
  /**是否使用单词时间 */
  hasWordTime: boolean
}

/**
 * 性别标识
 * 
 * M: 男性, F: 女性, D: 合唱
 */
export type Gender = 'M' | 'F' | 'D' | null

/**
 * 单词
 */
export interface Word {
  /**单词下标 */
  index: number
  /**单词内容 */
  word: string
  /**开始时间 */
  start: number
  /**结束时间 */
  end: number
}

/**
 * 歌词
 */
export interface Lyric {
  /**行号 */
  line: number
  /**原始行数据 */
  source: string
  /**解析后的歌词, 去除辅助标记 */
  lyric: string
  /**开始时间 */
  start: number
  /**结束时间 */
  end: number | null

  // 以下皆为扩展数据

  /**性别标识 */
  gender: Gender
  /**单词 */
  words: Word[]
}

/**
 * LRC歌词
 */
export interface Lrc {
  /**信息 */
  info: Info
  /**元数据 */
  meta: Meta
  /**歌词 */
  lyrics: Lyric[]
}
