# @xiaohuohumax/lrc-parser

LRC歌词文件解析器

## Install

```shell
npm i @xiaohuohumax/lrc-parser
```

## Use

```ts
// 歌词内容
import lrcSource from './assets/lrc/The Myth.lrc?raw';
import { LrcParser } from '@xiaohuohumax/lrc-parser';

// 初始化 & 配置
const lrcParser = new LrcParser({ lyricAddOffset: false });

// 解析结果
console.log(lrcParser.parser(lrcSource));
```

## example

[example-node](../../examples/node/README.md)

