<template>
  <div class="h3 text-center mt-4">LRC歌词解析器简单使用</div>
  <div class="d-flex fs-6 m-4">
    <div class="w-25 flex-grow-1">
      <div class="card p-4 mb-4">
        <div class="h4">切换</div>
        <hr>
        <HandoverLyrics />
      </div>
      <div class="card p-4">
        <div class="h4">滚动</div>
        <hr>
        <RollLyrics />
      </div>
    </div>
    <div class="me-4"></div>
    <div class="w-25 flex-grow-1">
      <div class="card p-4 mb-4">
        <div class="h4">LRC数据</div>
        <hr>
        <pre style="height:15em;">{{ lrcSource }}</pre>
      </div>
      <div class="card p-4">
        <div class="h4">解析结果</div>
        <hr>
        <pre style="height:30em;">{{ lrc }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HandoverLyrics from './component/HandoverLyrics.vue';
import RollLyrics from './component/RollLyrics.vue';
import lrcSource from '@/assets/lrc/The Myth.lrc?raw';
import { LrcUtil } from '@xiaohuohumax/lrc-util';

const lrcUtil = new LrcUtil(lrcSource, { fuzzy: true, parserConfig: { lyricAddOffset: true } });

const lrc = lrcUtil.getLrc();
</script>