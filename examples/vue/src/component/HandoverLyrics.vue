<template>
  <audio class="w-100" ref="audio" :src="musicUrl" controls></audio>
  <div class="lyrics mt-4">
    <div v-html="lyricsToText(nowLyric)"></div>
    <div class="text-end" v-html="lyricsToText(nextLyric)"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import lrcSource from '@/assets/lrc/The Myth.lrc?raw';
import musicUrl from '@/assets/music/The Myth.mp3';
import { lyricsToText } from '../util/lyricGender';

import { LrcUtil, Lyric } from '@xiaohuohumax/lrc-util';

const lrcUtil = new LrcUtil(lrcSource);

const audio = ref<HTMLAudioElement>(null!);
const nowLyric = ref<Lyric>();
const nextLyric = ref<Lyric>();

function timeUpdate() {
  const time = audio.value.currentTime * 1000;
  lrcUtil.setTime(time);
  nowLyric.value = lrcUtil.getLyric();
  nextLyric.value = lrcUtil.getNextLyric();
}

onMounted(() => {
  timeUpdate();
  audio.value.addEventListener('timeupdate', timeUpdate);
});
</script>