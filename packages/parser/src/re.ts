/**
 * 换行
 */
export const ENTER_RE = /\r?\n/ig;

/**
 * 信息标签
 * 
 * 例如:
 * ```
 * [ar:Lyrics artist]
 * [al:Album where the song is from]
 * [ti:Lyrics (song) title]
 * ```
 */
export const INFO_RE = /^\[([a-z_]+):([^\]]*)\]$/i;

/**
 * 歌词时长
 */
export const INFO_LENGTH_TIME_RE = /(\d{1,2}):(\d{1,2})/i;

/**
 * 常规歌词标签
 * 
 * 例如:
 * ```
 * [00:21.10][00:45.10]Repeating lyrics
 * ```
 */
export const TIME_LYRIC_RE = /^((?:\[(?:\d{1,2}:)?\d{1,2}:\d{1,2}(?:\.\d{2,3})?\])+)(.*)$/i;

/**
 * 简单扩展性别
 * 
 * 例如:
 * ```
 * [00:01.00]F: Line 2 lyrics
 * [00:06.00]M: Line 3 lyrics
 * [00:11.00]D: Line 5 lyrics
 * ```
 */
export const TAG_RE = /^\s*([FMD]):\s+/i;

/**
 * 歌词时间
 * 
 * 捕获组:
 * ```
 * (00):(00):(00).(000)
 *  1    2    3    4
 * ```
 */
export const TIME_RE = /(?:(\d{1,2}):)?(\d{1,2}):(\d{1,2})(?:\.(\d{2,3}))?/ig;

/**
 * 单词时间
 * 
 * 捕获组:
 * ```
 * <(00):(00):(00).(000)>
 *   1    2    3    4
 * ```
 */
export const WORD_TIME_RE = /<(?:(\d{1,2}):)?(\d{1,2}):(\d{1,2})(?:\.(\d{2,3}))?>/ig;