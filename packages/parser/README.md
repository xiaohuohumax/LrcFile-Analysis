# @xiaohuohumax/lrc-parser

LRC歌词文件解析器

## Install

```shell
npm i @xiaohuohumax/lrc-parser
```

## Use

```ts
import lrcSource from './***.lrc?raw';
import { LrcParser, Lrc } from '@xiaohuohumax/lrc-parser';

const lrcParser = new LrcParser();
const lrc: Lrc = lrcParser.parser(lrcSource);

console.log(JSON.stringify(lrc, undefined, 2));
```

## example

[example-node](../../examples/node/README.md)

