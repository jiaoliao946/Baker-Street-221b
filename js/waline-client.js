import { init } from "https://unpkg.com/@waline/client@v3/dist/waline.js";
window.onload = function waline() {
    init({
        el: "#waline",
        serverURL: "https://jiaoliao946-waline.netlify.app/.netlify/functions/comment",
        reaction: [
            "../assets/icons/waline/reactions/like.png",
            "../assets/icons/waline/reactions/good.png",
            "../assets/icons/waline/reactions/question.png",
            "../assets/icons/waline/reactions/melon.png",
            "../assets/icons/waline/reactions/boring.png",
            "../assets/icons/waline/reactions/wrong.png",
        ],
        locale: {
            reactionTitle: "本文如何？",
            reaction0: "很喜欢",
            reaction1: "好极了",
            reaction2: "有疑惑",
            reaction3: "吃瓜中",
            reaction4: "真无聊",
            reaction5: "出错了",
            placeholder: "欢迎留言，支持Markdown和Tex",
            sofa: "还没有人留言哦！快来抢沙发吧~",
            level0: "石器时代",
            level1: "来硬的",
            level2: "金光闪闪",
            level3: "钻石！",
            level4: "深藏不露",
        }
    });
}