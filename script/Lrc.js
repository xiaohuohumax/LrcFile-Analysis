/*
 * @Author: xiaohuohu
 * @Date: 2021-03-05 08:29:51
 * @LastEditTime: 2021-03-05 14:59:31
 * @Description: lrc文件 歌词解析器
 */
// 歌词解析类
class Lrc {
    // 时间进率
    static _timeRule = [60000, 1000, 1]

    constructor(lrcContext = "") {
        this.lrcContext = lrcContext;
        this._init();
    }
    // 初始化
    _init() {
        this.infoTags = Lrc.getInfoTags(this.lrcContext); // 信息标签
        this.wordTags = Lrc.getWordTags(this.lrcContext); // 歌词标签
        this._lastWord = ""; // 歌词
        this._lastTime = 0; // 时间
    }
    /**
     * @description: 设置新歌词
     * @param {String} lrcContext lrc文件内容
     * @return {void} viod
     */
    setLrcContext(lrcContext = "") {
        this.lrcContext = lrcContext;
        this._init();
    }
    /**
     * @description: 歌词解析
     * @param {String} lineItem 歌词单行 [00:00.00]... hello world
     * @param {Number} offset 偏移时间
     * @return {JSON} 解析结果 {时间:歌词} 例如:  {0:"hello world"}
     */
    static _wordStrToJson(lineItem = "", offset = 0) {
        let res = {};

        // 歌去除时间保留歌词,并去除两端多余空格
        let findWord = lineItem.replace(/(?:\[\d+\:\d+(?:[.:]\d+)?\])+/g, '').trim();
        if (!findWord) return res; // 去除歌词为空

        // 匹配多个时间 例如 [1:2.3][4:2.4]hello world
        let timeArr = lineItem.match(/(?:\[\d+\:\d+(?:[.:]\d+)?\])/g);

        timeArr.forEach(timeItem => {
            let findTimeItem = timeItem.match(/\d+/g); // 切割每一个时间的m s ms部分
            let nowTime = offset; // 初始为偏移时间 解决[offset:-232]操作
            findTimeItem.forEach((val, index) => {
                nowTime += parseInt(val) * Lrc._timeRule[index]; // 分钟,秒,毫秒转换为转毫秒之后累加
            })
            res[nowTime] = findWord;
        })
        return res;
    }
    /**
     * @description: 解析lrc文件的歌曲信息
     * @param {String} lrcContext lrc文件内容
     * @return {JSON} 解析结果 {类型:信息} 例如: {ti:"hello world!", ...}
     */
    static getInfoTags(lrcContext = "") {
        let res = {};
        if (typeof (lrcContext) !== 'string') return res;

        lrcContext.replace(/\[([A-Za-z]+)\:([^\[\]]*)\]/gm, (_text, $1, $2) => {
            if ($1 == "offset") return; // 排除时间偏移
            res[$1] = $2;
        });
        return res;
    }
    /**
     * @description: 解析lrc文件的歌词信息
     * @param {String} lrcContext lrc文件内容
     * @return {JSON} 解析结果 {时间[毫秒]:歌词} 例如: {0:"hello world", ...}
     */
    static getWordTags(lrcContext = "") {
        let res = {};
        if (typeof (lrcContext) !== 'string') return res;
        const lineArr = lrcContext.split("\n"); // 按行切分
        let offset = 0; // 时间补偿
        lineArr.forEach(lineItem => {
            // 匹配歌词
            lineItem.replace(/(?:\[\d+\:\d+(?:[.:]\d+)?\])+.*/, () => {
                res = {
                    ...res,
                    ...this._wordStrToJson(lineItem, offset)
                }
            })
            // 匹配 offset
            lineItem.replace(/^\[offset\:(\-?[1-9]\d+)\]$/, (_text, $1) => {
                offset -= parseInt($1)
            })
        })
        return res;
    }
    /**
     * @description: 获取匹配模糊时间的真实时间
     * @param {Number} nowTime 时间
     * @param {Number} timeDeviation 模糊时间范围
     * @return {Number | undefined} 真实时间 | 未找到
     */
    _deviationTime(nowTime, timeDeviation = 300) {
        const topTime = nowTime + timeDeviation; // 模糊上限
        const bottomTime = nowTime - timeDeviation; // 模糊下限
        return Object.keys(this.wordTags).find(time => ((time >= bottomTime) && (time <= topTime)))
    }
    /**
     * @description: 设置时间 与 匹配模式
     * @param {Number} nowTime 设置时间
     * @param {Boolean} flag 匹配模式 true 模糊 false 精确
     * @param {Number} timeDeviation 模糊 范围 
     * time - timeDeviation <= time <= time + timeDeviation
     * @return {void} null
     */
    setTime(nowTime, flag = true, timeDeviation = 300) {
        if (flag) { // 模糊匹配
            let time = this._deviationTime(nowTime, timeDeviation);
            this._lastWord = time ? this.wordTags[time] : this._lastWord;
            this._lastTime = time ? time : this._lastTime;
        } else { // 精确匹配
            const res = this.wordTags[nowTime];
            this._lastWord = res ? res : '';
            this._lastTime = nowTime;
        }
    }
    /**
     * @description: 获取歌词
     * @return {String} 匹配的歌词
     */
    getWord() {
        return this._lastWord;
    }
    /**
     * @description: 获取当前使用的歌词真实时间
     * @return {Number} 歌词时间
     */
    getDeviationTime() {
        return this._lastTime;
    }
    /**
     * @description: 获取下一句歌词时间
     * @return {Number} 时间
     */
    getNextDeviationTime() {
        let timeArr = Object.keys(this.wordTags);
        let len = timeArr.length;
        let nextIndex = timeArr.indexOf(this._lastTime) + 1;
        return timeArr[Math.min(len, nextIndex)]
    }
    /**
     * @description: 获取下一句歌词
     * @return {String} 歌词
     */
    getNextWord() {
        let index = this.getNextDeviationTime();
        return this.wordTags[index];
    }
}