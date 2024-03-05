# @xiaohuohumax/lrc-util

LRC歌词文件解析辅助工具, 获取当前歌词, 下一句等等

## Install

```shell
npm i @xiaohuohumax/lrc-util
```

## Use

```ts
import { LrcUtil, Lyric } from '@xiaohuohumax/lrc-util';

// 初始化 & 配置
const lrcUtil = new LrcUtil(lrcSource, { fuzzy: true, parserConfig: { lyricAddOffset: true } });

// audio dom
const audio = document.querySelector('audio');

// 添加监听
audio.addEventListener('timeupdate', () => {
  // 获取时间 毫秒
  const time = audio.value.currentTime * 1000;
  // 设置时间
  lrcUtil.setTime(time);
  // 当前歌词
  const nowLyric: Lyric = lrcUtil.getLyric();
  // 下一句歌词
  const nextLyric: Lyric = lrcUtil.getNextLyric();
})
```

## example

[example-vue](../../examples/vue/README.md)
