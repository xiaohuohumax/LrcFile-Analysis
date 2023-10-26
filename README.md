# LrcFile-Analysis v2.0
## lrc歌词文件解析

**这个脚本可以将网络上的lrc歌词文件解析出来,并可以跟随video,audio播放器显示歌词**

## 📖使用

简单例子 [test](./test/src/main.ts)

### 导入

```shell
npm i lrc-file-analysis

# import Lrc from "lrc-file-analysis";
```
或者拷贝 [lrc.global.js](./dist/lrc.global.js) 到项目

```html
<script src="./dist/lrc.global.js"></script>
```

### 创建 Lrc 对象

```javascript
let lrc = new Lrc(); // 创建Lrc 对象
lrc.setLrcContext(`lrc resource`); // 添加lrc源文件内容
// 或者
let lrc = new Lrc(`lrc resource`); // 创建Lrc 对象 初始化时就添加lrc源文件内容
```

搭配 axios 使用

```javascript
const lrcUrl = './lrc/Heart To Heart.lrc'; // lrc url
let lrc = new Lrc(); // 创建Lrc 对象
// 获取数据
axios.get(lrcUrl).then((response) => {
    // 设置数据源
    lrc.setLrcContext(response.data);
}).catch((error) => console.log(error));
```

### 更新歌词

```javascript
let video = document.querySelector("video")
// 添加时间监视
video.addEventListener('timeupdate', function () { 
    let time = video.currentTime * 1000;
    lrc.setTime(time, true); // 更新时间
    word.innerHTML = `
        [播放器时间:${time}]<br/>
        [歌词时间:${lrc.getDeviationTime()}]<br/>
        [歌词:${lrc.getWord()}]<br/>
        [下一句歌词时间:${lrc.getNextDeviationTime()}]<br/>
        [下一句歌词:${lrc.getNextWord()}]<br/>
    `;
})
```

## 🎉效果

![效果](./image/use.gif)
