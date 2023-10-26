// 时间进率
const timeRule = [60000, 1000, 1];

interface LrcInfoTags {
    [name: string]: string
}

interface LrcWordTags {
    [name: number]: string
}


// 歌词解析类
export default class Lrc {
    // 歌词文件内容
    public lrcContext: string = "";
    // 歌词信息标签
    public infoTags: LrcInfoTags = {};
    // 歌词歌词标签
    public wordTags: LrcWordTags = {};

    private wordTimes: number[] = [];

    /**
     * 当前时间
     */
    private nowTime: number = -1;

    constructor(lrcContext: string = "") {
        this.lrcContext = lrcContext;
        this.init();
    }
    public setLrcContext(lrcContext: string) {
        this.lrcContext = lrcContext;
        this.init();
    }

    private init() {
        this.infoTags = Lrc.getInfoTags(this.lrcContext); // 信息标签
        this.wordTags = Lrc.getWordTags(this.lrcContext); // 歌词标签
        this.nowTime = 0; // 时间
        this.wordTimes = Object.keys(this.wordTags).map(time => parseInt(time));
    }

    public static getInfoTags(lrcContext: string): LrcInfoTags {
        const res: LrcInfoTags = {};
        lrcContext.replace(/\[([A-Za-z]+):([^\]]*)\]/gm, (_text, $1, $2) => {
            if ($1 !== "offset") {
                res[$1] = $2;
            } // 排除时间偏移
            return "";
        });
        return res;
    }
    static _wordStrToJson(lineItem = "", offset = 0) {
        const res = {};

        // 歌去除时间保留歌词,并去除两端多余空格
        const findWord = lineItem.replace(/(?:\[\d+:\d+(?:[.:]\d+)?\])+/g, "").trim();
        if (!findWord) return res; // 去除歌词为空

        // 匹配多个时间 例如 [1:2.3][4:2.4]hello world
        const times = lineItem.match(/(?:\[\d+:\d+(?:[.:]\d+)?\])/g);

        times.forEach(timeItem => {
            const findTimeItem = timeItem.match(/\d+/g); // 切割每一个时间的m s ms部分
            // 初始为偏移时间 解决[offset:-232]操作
            const times = [
                offset,
                ...findTimeItem.map((val, index) => parseInt(val) * timeRule[index])
            ];
            // 数组求和
            res[times.reduce((t1, t2) => t1 + t2)] = findWord;
        });
        return res;
    }
    /**
     * 解析lrc文件的歌词信息
     */
    public static getWordTags(lrcContext: string = ""): LrcInfoTags {
        let res: LrcInfoTags = {};
        const lines = lrcContext.split("\n"); // 按行切分
        let offset = 0; // 时间补偿
        lines.forEach(lineItem => {
            // 匹配歌词
            lineItem.replace(/(?:\[\d+:\d+(?:[.:]\d+)?\])+.*/, () => {
                res = {
                    ...res,
                    ...this._wordStrToJson(lineItem, offset)
                };
                return "";
            });
            // 匹配 offset
            lineItem.replace(/\[offset:(-?[1-9]\d+)\]/, (_text, $1) => {
                offset -= parseInt($1);
                return "";
            });
        });
        return res;
    }
    /**
     * 设置时间 与 匹配模式
     */
    setTime(nowTime: number, flag: boolean = true, timeDeviation: number = 300) {
        if (flag) {
            // 模糊匹配
            const time = this.wordTimes
                .find(time => (
                    (time >= nowTime - timeDeviation)
                    && (time <= nowTime + timeDeviation)
                ));
            time && (this.nowTime = time);
        } else {
            // 精确匹配
            this.wordTags[nowTime] || (this.nowTime = nowTime);
        }
    }
    private getWordByTime(wordTime: number): string | undefined {
        return this.wordTags[wordTime];
    }
    /**
     * 获取歌词
     */
    getWord() {
        return this.getWordByTime(this.nowTime);
    }
    /**
     * 获取当前使用的歌词真实时间
     */
    getDeviationTime() {
        return this.nowTime;
    }
    /**
     * 获取下一句歌词时间
     */
    getNextDeviationTime() {
        // 获取下一个元素
        const nextIndex = this.wordTimes.indexOf(this.nowTime) + 1;
        return this.wordTimes[Math.min(this.wordTimes.length, nextIndex)];
    }
    /**
     * 获取下一句歌词
     */
    getNextWord() {
        return this.getWordByTime(this.getNextDeviationTime());
    }
}