import { Lyric } from '@xiaohuohumax/lrc-util';

const tagMap = {
  M: '男', F: '女', D: '合唱'
};

export function lyricsHtml(lyric: Lyric | undefined) {
  let res = '';
  if (lyric) {
    res = `[${lyric.time}]: ${lyric.lyric}`;
    if (lyric.tag) {
      res = tagMap[lyric.tag] + res;
    }
  }
  return res;
}