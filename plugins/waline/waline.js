import { init } from "https://unpkg.com/@waline/client@v3/dist/waline.js";

(function(d) {
    let main = function(hook) {
        hook.mounted(function() {
            let content = d.querySelector(".content");
            let waline = d.createElement("div");
            waline.id = "waline";
            waline.className = "markdown-section";
            content.append(waline);
        });

        hook.doneEach(function() {
            if(path == "/") return ;
            init({
                el: "#waline",
                serverURL: "https://jiaoliao946-waline.netlify.app/.netlify/functions/comment",
                path: root + path,
                reaction: [
                    root + "/assets/icons/waline/reaction0.png",
                    root + "/assets/icons/waline/reaction1.png",
                    root + "/assets/icons/waline/reaction2.png",
                    root + "/assets/icons/waline/reaction3.png",
                    root + "/assets/icons/waline/reaction4.png",
                    root + "/assets/icons/waline/reaction5.png",
                ],
                locale: {
                    reactionTitle: "本文如何？",
                    reaction0: "很喜欢",
                    reaction1: "好极了",
                    reaction2: "有疑惑",
                    reaction3: "吃瓜中",
                    reaction4: "真无聊",
                    reaction5: "出错了",
                    placeholder: "欢迎留言，支持Markdown，审核通过后才会显示",
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
                login: "force"
            });
            const finished = new CustomEvent("finished");     //定义事件"finished"
            d.querySelector("#waline").dispatchEvent(finished);     //id为waline的标签触发了事件"finished"
        });
    };

    $docsify = $docsify || {};
    $docsify.plugins = [].concat($docsify.plugins || [], main);
})(document);