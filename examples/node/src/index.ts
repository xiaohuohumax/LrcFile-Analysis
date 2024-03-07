import lrcSource from './assets/lrc/The Myth.lrc?raw';
import { Lrc, LrcParser } from '@xiaohuohumax/lrc-parser';

const testBaseParser = new LrcParser({
  genderMatchRules: [
    {
      F: '\\s*男:\\s*',
      M: '\\s*女:\\s*',
      D: '\\s*合唱:\\s*',
    }
  ]
});

const lrc: Lrc = testBaseParser.parser(lrcSource);

console.log(JSON.stringify(lrc, undefined, 2));