((d) => {
    const main = (hook) => {
        hook.doneEach(() => {     //不蒜子必须每次重新执行一遍
            if(location.pathname == "/") return ;     //封面跳过，防止不必要的操作

            const busuanzi = d.createElement("script");     //不蒜子
            busuanzi.src = "https://busuanzi.9420.ltd/js";     //指向改良版不蒜子代码地址
            d.querySelector("script").before(busuanzi);
            busuanzi.remove();     //发挥完作用就移去，防止script越积越多
        });

        hook.mounted(() => {
            const themeColor = getComputedStyle(d.documentElement).getPropertyValue("--theme-color");
            const color = [themeColor.slice(1, 3), themeColor.slice(3, 5), themeColor.slice(5, 7)];
            for(let i = 0; i < 3; ++i) color[i] = (parseInt(color[i], 16) + 35).toString(16);
            //主题色的浅色版本
            d.documentElement.style.setProperty("--theme-color-light", "#" + color[0] + color[1] + color[2]);
            //主题色的透明版本
            d.documentElement.style.setProperty("--theme-color-pellucid", "#" + color[0] + color[1] + color[2] + "59");

            const footer = d.createElement("footer");     //页脚
            const text = ["By ", " | Comment area by ", " | Some of navbar's icons by "],     //每段内容
                from = ["jiaoliao946", "Waline", "Icon8"],     //每段来源名称
                href = ["https://github.com/jiaoliao946", "https://waline.js.org", "https://igoutu.cn"];     //每段来源链接

            for(let i = 0; i < 3; ++i) {
                const a = d.createElement("a");     //来源
                a.href = href[i], a.textContent = from[i];

                const span = d.createElement("span");     //段
                span.textContent = text[i];
                span.append(a), footer.append(span);     //把每个来源依次加在对应段末尾，把每段依次加在页脚末尾
            }

            d.querySelector("body > section").append(footer);     //把页脚加在封面末尾
            //监听到Waline添加成功后，复制页脚节点并加在内容末尾
            d.querySelector(".content").addEventListener("waline", 
                () => d.querySelector("#waline").after(footer.cloneNode(true)));
        });
    }

    $docsify.plugins = [].concat($docsify.plugins, main);
})(document);