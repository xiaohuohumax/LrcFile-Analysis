function Lrc(requestUrl) {
    // lrc歌词解析器 依赖axios库 | LRC lyrics Analytic Rely on 'axios' Library
    this.flagTags = {};// 解析的标志标签 | Parsed flag labels [by:xiaohuohu] 
    this.timeTags = {};// 解析的歌词标签 | Parsed lyrics labels [3:20.3]hello world
    this.requestText = '';// 请求的lrc内容 | requested lrc content
    // 当前状态 0 未加载 1 获取失败 2 解析失败 3 解析成功 | now state 0 Unloaded 1 request failure 2 Analytic failure 3 Analytic success
    this.canPlay = 0;
    // 与canPlay 对应提示 除3之外 | tips :Consistent with 'canplay' Except for 3
    this.canPlayInf = ['外星人正在搜寻歌词,请稍后', '外星人未找到歌词', '歌词外星人无法解析'];
    this.lastWord = '';// 上一次歌词 | Last lyrics
    this.requestUrl = requestUrl;// 歌词网址 | lrc url
    this.getLrc(); // 开始分析 | begin analytic
}
Lrc.prototype.getLrc = function () {
    // 异步获取歌词 | get lyrics
    let _this = this;
    _this.canPlay = 0;
    axios.get(_this.requestUrl).then(function (response) {
        let data = response.data;// 获取数据 | get data
        _this.requestText = data;
        _this.flagTags = _this.getFlagTags(data);// 解析标志
        _this.timeTags = _this.getTimeTags(data);// 解析歌词
        // 判断是否成功解析,不为空.
        _this.canPlay = (Object.keys(_this.timeTags).length == 0) ? 2 : 3;// 设置当前状态 | set now state 2:3
    }).catch(function (error) {
        _this.canPlay = 1;// 设置错误状态 set error state 1
        console.log(error);
    });
}
Lrc.prototype.getRequestText = function () {
    // 获取lrc源文件 |get lrc text
    return this.requestText;
}
Lrc.prototype.getFlagTags = function (text) {
    // 解析标记标签 text lrc文本 
    // return {标签名:标签值} 例如: {by:xiaohuohu}
    let res = {};
    if (typeof (text) !== 'string') { return res; }// 检查参数 | check type
    let find = text.match(/\[[A-Za-z]+\:[^\[\]]*\]/g);// 匹标志标签 | match tags /\[[A-Za-z]+\:[^\[\]]*\]/
    for (let findKey in find) {
        let textArrayItem = find[findKey];
        let tagName = textArrayItem.substring(textArrayItem.indexOf('[') + 1, textArrayItem.indexOf(':'));
        let tagText = textArrayItem.substring(textArrayItem.indexOf(':') + 1, textArrayItem.indexOf(']'));
        res[tagName] = tagText;
    }
    return res;
}
Lrc.prototype.getWord = function (time, flag = true, timeDeviation = 150) {
    // 获取解析歌词 time: 毫秒 flag:是否模糊匹配 若为 false 且找不到时返回 '' 
    // timeDeviation:模糊时间 (time - timeDeviation< time < time + timeDeviation),flag 为true 时生效
    if (this.canPlay == 3) {// 解析成功
        if (flag) {// 模糊匹配
            for (let key in this.timeTags) {
                // 获取大概区间的第一个歌词
                if ((key >= time - timeDeviation) && (key <= time + timeDeviation)) {
                    this.lastWord = this.timeTags[key];
                    return this.timeTags[key];
                } else if (key > time + timeDeviation) {// 未找到返回上一次的歌词
                    return this.lastWord;
x                }
            }
        } else {// 精确匹配
            let res = this.timeTags[time];
            return res ? res : '';
        }
    } else {// 其它状态
        return this.canPlayInf[this.canPlay];
    }
}
Lrc.prototype.getTag = function () {
    // 获取歌曲信息
    return this.flagTags;
}
Lrc.prototype.getTimeTags = function (text) {
    // 解析歌词标签 text lrc全部文本
    // return {time:word} 例如{12300:'hello world'}
    // [m:s.ms] or [m:s:ms] or [m:s], [1:2.3] or [01:02.03] or [01:02] ...
    let res = {};// 结果
    if (typeof (text) != 'string') { return res; }// 检查参数
    let textArray = text.split('\n');// 歌词拆分
    let timeRule = [60000, 1000, 1];// 对应位数的毫秒数
    let addTime = 0;// 时间补偿
    for (let textArrayKey in textArray) {
        let textArrayItem = textArray[textArrayKey];
        if (textArrayItem.match(/(?:\[\d+\:\d+(?:[.:]\d+)?\])+.*/)) {// 判断是否符合歌词的规则
            let findWord = textArrayItem.replace(/(?:\[\d+\:\d+(?:[.:]\d+)?\])+/g, '').trim();// 歌去除时间保留歌词,并去除两端多余空格
            if (findWord) {// 去除歌词为空的项
                let findTime = textArrayItem.match(/(?:\[\d+\:\d+(?:[.:]\d+)?\])/g);// 匹配多个时间 例如 [1:2.3][4:2.4]hello world
                for (let findTimeKey in findTime) {
                    let findTimeItem = findTime[findTimeKey].match(/\d+/g);// 切割每一个时间的m s ms部分
                    let nowTime = addTime;// 初始为偏移时间 解决[offset:-232]操作
                    for (let x = 0; x < findTimeItem.length; x++) {
                        nowTime += parseInt(findTimeItem[x]) * timeRule[x];// 分钟,秒,毫秒转换为转毫秒之后累加
                    }
                    res[nowTime > 0 ? nowTime : 0] = findWord;// 限制下线时间 0
                }
            }
        } else if (textArrayItem.match(/^\[offset\:\-?[1-9]\d+\]$/)) {// 匹配偏移时间 解决[offset:-232]操作
            // [offset:-232]正值表示整体提前，负值相反
            addTime -= parseInt(textArrayItem.substring(textArrayItem.indexOf(':') + 1, textArrayItem.length));
        }
    }
    return res;
}