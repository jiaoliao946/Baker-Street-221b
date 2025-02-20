import { init } from "https://unpkg.com/@waline/client@v3/dist/waline.js";     //引入Waline客户端初始化函数
import katex from "https://unpkg.com/katex@0.16/dist/katex.mjs";     //引入KaTex

((d) => {
    const main = (hook) => {
        hook.mounted(() => {
            const waline = d.createElement("div");     //Waline的容器元素
            waline.id = "waline";
            waline.className = "markdown-section";     //保证宽度跟随文章

            const content = d.querySelector(".content");
            content.append(waline);     //把Waline加在内容末尾
            
            content.dispatchEvent(new Event("waline"));     //Waline添加成功事件，用于添加页脚

            for(let i = 0; i < 6; ++i) {
                const audio = d.createElement("audio");
                audio.className = "wl-reaction-audio";
                audio.src = "/assets/sounds/waline/reaction" + i + ".mp3";
                content.append(audio);     //把音频依次加在内容末尾
            }
        });

        hook.doneEach(() => {
            if(location.pathname == "/") return ;     //封面跳过，防止没找到元素报错

            init({
                el: "#waline",     //容器元素
                serverURL: "https://jiaoliao946-waline.netlify.app/.netlify/functions/comment",     //服务器地址
                path: location.href,     //每个评论发布的文章地址

                reaction: [     //reaction的图片
                    "/assets/icons/waline/reaction0.png",
                    "/assets/icons/waline/reaction1.png",
                    "/assets/icons/waline/reaction2.png",
                    "/assets/icons/waline/reaction3.png",
                    "/assets/icons/waline/reaction4.png",
                    "/assets/icons/waline/reaction5.png",
                ],
                locale: {     //一些文字内容的更改
                    reactionTitle: "本文如何？",     //reaction总标题
                    reaction0: "很喜欢",
                    reaction1: "好极了",
                    reaction2: "有疑惑",
                    reaction3: "吃瓜中",
                    reaction4: "真无聊",
                    reaction5: "出错了",     //每个reaction的标题
                    placeholder: "欢迎登录留言，支持Markdown和LaTex，每个IP每分钟只能发布一次评论，审核通过后才会显示",     //评论区提示
                    sofa: "还没有人留言哦！快来抢沙发吧~",     //无评论提示
                    level0: "石器时代",
                    level1: "来硬的",
                    level2: "金光闪闪",
                    level3: "钻石！",
                    level4: "深藏不露",     //用户头衔
                },

                login: "force",     //必须登录
                texRenderer: (blockMode, tex) =>     //Tex渲染器（KaTex）
                    katex.renderToString(tex, {
                        displayMode: blockMode,
                        throwOnError: false,
                    }),
                emoji: [     //可用表情
                    "https://unpkg.com/@waline/emojis@1.2.0/bilibili"     //bilibili表情
                ],
                search: false,     //关闭表情包搜索
                noCopyright: true     //关闭来源footer
            });

            const playSound = (selector) => d.querySelector(selector).play();     //播放音频

            for(let i = 1; i < 7; ++i) 
                d.querySelector(".wl-reaction-item:nth-of-type(" + i + ")").onpointerenter = 
                    () => playSound(".wl-reaction-audio:nth-of-type(" + i + ")");     //进入reaction，播放音频
        });
    };

    $docsify.plugins = [].concat($docsify.plugins, main);
})(document);