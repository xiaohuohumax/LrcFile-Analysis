<template>
  <div class="d-flex" style="height:30em;">
    <div class="card w-25 flex-grow-1 p-4">
      <div class="h4">LRC歌词</div>
      <hr>
      <textarea v-model="lrcSource" class="w-100 h-100 border-0" style="outline:none;"
        placeholder="请填入lrc歌词"></textarea>
    </div>
    <div class="pe-4"></div>
    <div class="card w-25 flex-grow-1 p-4 overflow-y-auto">
      <div class="h4">LRC歌词解析结果</div>
      <hr>
      <pre class=" h-100">{{ lrc }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Lrc, LrcParser } from '@xiaohuohumax/lrc-parser';

const lrcSource = ref('');
const lrc = ref<Lrc>(null!);
const lrcParser = new LrcParser();

watch(() => lrcSource.value, () => lrc.value = lrcParser.parser(lrcSource.value));
</script>