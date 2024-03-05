<template>
  <div class="info">
    <pre>{{ lrcSource }}</pre>
    <pre>{{ lrcUtil.getLrc() }}</pre>
  </div>
  <div class="controls">
    <audio ref="audio" :src="musicUrl" controls></audio>
    <div class="lyrics">
      <div v-html="lyricsHtml(nowLyric)"></div>
      <div v-html="lyricsHtml(nextLyric)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import lrcSource from './assets/lrc/The Myth.lrc?raw';
import musicUrl from './assets/music/The Myth.mp3';

import { LrcUtil, Lyric } from '@xiaohuohumax/lrc-util';

const lrcUtil = new LrcUtil(lrcSource, { fuzzy: true, parserConfig: { lyricAddOffset: true } });

const audio = ref<HTMLAudioElement>(null!);

const nowLyric = ref<Lyric>();
const nextLyric = ref<Lyric>();

const tagMap = {
  M: '男', F: '女', D: '合唱'
};

function lyricsHtml(lyric: Lyric | undefined) {
  let res = '';
  if (lyric) {
    res = `[${lyric.time}]: ${lyric.lyric}`;
    if (lyric.tag) {
      res = tagMap[lyric.tag] + res;
    }
  }
  return res;
}


onMounted(() => audio.value.addEventListener('timeupdate', () => {
  const time = audio.value.currentTime * 1000;
  lrcUtil.setTime(time);
  nowLyric.value = lrcUtil.getLyric();
  nextLyric.value = lrcUtil.getNextLyric();
}));
</script>

<style scoped>
.info {
  display: flex;
  margin: 5em;
  font-size: 1.25em;
  font-weight: 800;
}

.info pre {
  flex: 1 1;
}

.controls {
  position: fixed;
  bottom: 0;
  width: 100svw;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em 10em;
  background: rgba(0, 0, 0, 0.5);
  font-size: 1.5em;
  color: white;
}

.lyrics {
  margin-top: 1em;
  width: 100%;
}

.lyrics div:first-child {
  text-align: left;
}

.lyrics div:last-child {
  text-align: right;
}
</style>
