import { init } from "https://unpkg.com/@waline/client@v3/dist/waline.js";

((d) => {
    function playSound(selector) {
        d.querySelector(selector).play();
    }

    let main = (hook) => {
        hook.mounted(() => {
            const waline = d.createElement("div");
            waline.id = "waline";
            waline.className = "markdown-section";

            const content = d.querySelector(".content");
            content.append(waline);

            for(let i = 0; i < 6; ++i) {
                const audio = d.createElement("audio");
                audio.className = "wl-reaction-audio";
                audio.src = "/assets/sounds/waline/reaction" + i + ".mp3";
                content.append(audio);
            }
        });

        hook.doneEach(() => {
            if(location.pathname == "/") return ;

            init({
                el: "#waline",
                serverURL: "https://jiaoliao946-waline.netlify.app/.netlify/functions/comment",
                path: location.href,
                reaction: [
                    "/assets/icons/waline/reaction0.png",
                    "/assets/icons/waline/reaction1.png",
                    "/assets/icons/waline/reaction2.png",
                    "/assets/icons/waline/reaction3.png",
                    "/assets/icons/waline/reaction4.png",
                    "/assets/icons/waline/reaction5.png",
                ],
                locale: {
                    reactionTitle: "本文如何？",
                    reaction0: "很喜欢",
                    reaction1: "好极了",
                    reaction2: "有疑惑",
                    reaction3: "吃瓜中",
                    reaction4: "真无聊",
                    reaction5: "出错了",
                    placeholder: "欢迎登录留言，支持Markdown，审核通过后才会显示",
                    sofa: "还没有人留言哦！快来抢沙发吧~",
                    level0: "石器时代",
                    level1: "来硬的",
                    level2: "金光闪闪",
                    level3: "钻石！",
                    level4: "深藏不露",
                },
                emoji: [
                    "https://unpkg.com/@waline/emojis@1.2.0/bilibili"
                ],
                login: "force",
                noCopyright: true
            });

            for(let i = 1; i < 7; ++i) 
                d.querySelector(".wl-reaction-item:nth-of-type(" + i + ")").onpointerenter = 
                    () => playSound(".wl-reaction-audio:nth-of-type(" + i + ")");
        });
    };

    $docsify.plugins = [].concat($docsify.plugins, main);
})(document);