import { Lyric } from '@xiaohuohumax/lrc-util';

const genderMap = {
  M: '男', F: '女', D: '合唱'
};

export function lyricsToText(lyric: Lyric | undefined) {
  let res = '';
  if (lyric) {
    res = `[${lyric.start}]: ${lyric.lyric}`;
    if (lyric.gender) {
      res = genderMap[lyric.gender] + res;
    }
  }
  return res;
}