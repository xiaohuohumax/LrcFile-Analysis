# @xiaohuohumax/lrc-util

LRC歌词文件解析辅助工具, 获取当前歌词, 下一句等等

## Install

```shell
npm i @xiaohuohumax/lrc-util
```

## Use

```ts
import lrcSource from './***.lrc?raw';
import { LrcUtil, Lyric } from '@xiaohuohumax/lrc-util';

const lrcUtil = new LrcUtil(lrcSource);

const audio = ref<HTMLAudioElement>(null!);

const nowLyric = ref<Lyric>();
const nextLyric = ref<Lyric>();

function timeUpdate() {
  const time = audio.value.currentTime * 1000;
  // 设置时间
  lrcUtil.setTime(time);
  // 当前歌词
  nowLyric.value = lrcUtil.getLyric();
  // 下一句歌词
  nextLyric.value = lrcUtil.getNextLyric();
}

onMounted(() => {
  timeUpdate();
  audio.value.addEventListener('timeupdate', timeUpdate);
});
```

## example

[example-vue](../../examples/vue/README.md)
