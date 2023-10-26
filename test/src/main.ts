import Lrc from "lrc-file-analysis";
import axios from "axios";
import "./index.css";
import assets from "./assets";

const lrc = new Lrc();

const q = <T = HTMLElement>(name: string) => document.querySelector(name) as T;

const musicSources = [
    {
        mUrl: assets.MusicCountingStars,
        lrcUrl: assets.LrcCountingStars
    },
    {
        mUrl: assets.MusicHeartToHeart,
        lrcUrl: assets.LrcHeartToHeart
    }
];

const video = q<HTMLAudioElement>("audio");
const musicList = q<HTMLUListElement>(".music-list");
const wordsNow = q<HTMLDivElement>(".words .now");
const wordsNext = q<HTMLDivElement>(".words .next");

const lrcInfo = q<HTMLPreElement>(".lrc-info");
const lrcWord = q<HTMLPreElement>(".lrc-word");
const lrcContext = q<HTMLPreElement>(".lrc-context");

function switchMusic(music: typeof musicSources[0]) {
    video.src = music.mUrl;
    // 获取数据
    axios.get(music.lrcUrl).then((response) => {
    // 设置数据源
        lrc.setLrcContext(response.data);
        lrcContext.innerHTML = lrc.lrcContext;

        lrcInfo.innerHTML = JSON.stringify(lrc.infoTags, undefined, 2);
        lrcWord.innerHTML = JSON.stringify(lrc.wordTags, undefined, 2);
    }).catch((error) => console.log(error));
    video.play();
}

function addMusicLi() {
    musicList.innerHTML = "";
    musicSources.forEach(music => {
        const li = document.createElement("li");
        const musicName = music.mUrl.split("/").pop();
        li.innerHTML = `<span>${musicName}</span><button>播放</button>`;
        li.querySelector("button")?.addEventListener("click", () => switchMusic(music));
        musicList.appendChild(li);
    });
}

addMusicLi();

video.addEventListener("timeupdate", function () {
    // 添加监视
    const time = video.currentTime * 1000;
    lrc.setTime(time, true); // 更新时间
    wordsNow.innerHTML = `${lrc.getDeviationTime()}: ${lrc.getWord()}`;
    wordsNext.innerHTML = `${lrc.getNextDeviationTime()}: ${lrc.getNextWord()}`;
});