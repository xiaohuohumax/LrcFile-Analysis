<template>
  <div class="controls">
    <audio class="w-100" ref="audio" :src="musicUrl" controls></audio>
    <div ref="lyricsMain" class="card overflow-y-hidden position-relative mt-4" style="height:20em;">
      <div ref="lyricBody" class="lyric-body w-100 position-absolute text-center fw-blod">
        <div ref="items" :class="lyric.tag?.toLocaleLowerCase()" :id="lyric.time + ''" class="item mt-2"
          v-for="lyric in lrc.lyrics.filter(l => l.lyric != '')" :key="lyric.time">
          {{ lyricsHtml(lyric) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import lrcSource from '@/assets/lrc/The Myth.lrc?raw';
import musicUrl from '@/assets/music/The Myth.mp3';
import { lyricsHtml } from '../util/lyricTag';

import { LrcUtil, Lyric } from '@xiaohuohumax/lrc-util';

const lrcUtil = new LrcUtil(lrcSource, { fuzzy: true, parserConfig: { lyricAddOffset: true } });

const audio = ref<HTMLAudioElement>(null!);
const lyricsMain = ref<HTMLDivElement>(null!);
const lyricBody = ref<HTMLDivElement>(null!);

const items = ref<HTMLDivElement[]>(null!);

const lrc = lrcUtil.getLrc();
const nowLyric = ref<Lyric>(null!);

onMounted(() => {
  const bodyHeight = lyricsMain.value.clientHeight;

  lyricBody.value.style.top = bodyHeight / 2 + 'px';

  watch(() => nowLyric.value, () => {
    if (nowLyric.value.lyric == '') {
      return;
    }

    items.value.forEach(item => item.classList.remove('now'));

    const nowItem = items.value.find(item => item.id == nowLyric.value.time + '');

    if (nowItem) {
      nowItem?.classList.add('now');
      lyricBody.value.style.top = (-1 * nowItem.offsetTop + bodyHeight / 2 - nowItem.clientHeight / 2) + 'px';
    }
  });

  audio.value.addEventListener('timeupdate', () => {
    lrcUtil.setTime(audio.value.currentTime * 1000);
    nowLyric.value = lrcUtil.getLyric();
  });

});
</script>

<style scoped>
.lyric-body {
  animation: top 1s ease-in-out;
  transition: all 1s;
}

.item {
  transition: all .5s ease-in-out;
  opacity: .4;
}

.now {
  font-size: 1.2em !important;
  color: red;
  opacity: 1;
}
</style>