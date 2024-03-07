<template>
  <audio class="w-100" ref="audio" :src="musicUrl" controls></audio>
  <div ref="lyricsMain" class="card overflow-y-hidden position-relative mt-4" style="height:20em;">
    <div ref="lyricBody" class="lyric-body w-100 position-absolute text-center fw-blod">
      <div ref="lyricItems" class="lyric-item mt-2" :id="lyric.start.toString()" v-for="lyric in lrc.lyrics"
        :key="lyric.start">
        {{ lyricsToText(lyric) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import lrcSource from '@/assets/lrc/The Myth.lrc?raw';
import musicUrl from '@/assets/music/The Myth.mp3';
import { lyricsToText } from '../util/lyricGender';

import { LrcUtil, Lyric } from '@xiaohuohumax/lrc-util';

// 移动歌词
const lyricsMain = ref<HTMLDivElement>(null!);
const lyricBody = ref<HTMLDivElement>(null!);

function updateLyricBodyTop(top: number): void {
  const bodyHeight = lyricsMain.value.clientHeight;
  lyricBody.value.style.top = top + bodyHeight / 2 + 'px';
}

// 监听歌词变化并修改样式
const NOW_ITEM = 'now';
const nowLyric = ref<Lyric>(null!);
const lyricItems = ref<HTMLDivElement[]>(null!);

function updateNowLyricItemStyle() {
  lyricItems.value.forEach(item => item.classList.remove(NOW_ITEM));
  const nowItem = lyricItems.value.find(item => item.id == nowLyric.value.start.toString());
  if (nowItem) {
    nowItem?.classList.add(NOW_ITEM);
    updateLyricBodyTop(-1 * nowItem.offsetTop - nowItem.clientHeight / 2);
  }
}

watch(() => nowLyric.value, updateNowLyricItemStyle);
window.addEventListener('resize', updateNowLyricItemStyle);

// 播放器添加时间监视
const audio = ref<HTMLAudioElement>(null!);
const lrcUtil = new LrcUtil(lrcSource);
const lrc = lrcUtil.getLrc();

onMounted(() => {
  updateLyricBodyTop(0);

  // 时间监听
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

.lyric-item {
  transition: all .5s ease-in-out;
  opacity: .4;
}

.now {
  font-size: 1.2em !important;
  color: red;
  opacity: 1;
}
</style>