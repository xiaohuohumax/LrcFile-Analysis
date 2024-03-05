import lrcSource from './assets/lrc/The Myth.lrc?raw';
import { LrcParser } from '@xiaohuohumax/lrc-parser';

const lrcParser = new LrcParser({ lyricAddOffset: false });

console.log(lrcParser.parser(lrcSource));