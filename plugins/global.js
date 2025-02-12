((d) => {
    let main = (hook) => {
        hook.doneEach(() => {
            if(location.pathname == "/") return ;

            //不蒜子
            let busuanzi = d.createElement("script");
            busuanzi.src = "https://busuanzi.9420.ltd/js";
            d.querySelector("script").before(busuanzi);
            busuanzi.remove();
        });

        hook.ready(() => {
            const footer = d.createElement("footer");
            const text = ["By ", ", Comment area by ", ", Some of navbar's icons by "], 
                from = ["jiaoliao946", "Waline", "Icon8"],
                href = ["https://github.com/jiaoliao946", "https://waline.js.org", "https://igoutu.cn"];
            for(let i = 0; i < 3; ++i) {
                const a = d.createElement("a");
                a.href = href[i], a.textContent = from[i];
                const span = d.createElement("span");
                span.textContent = text[i];
                span.append(a);
                footer.append(span);
            }
            d.querySelector("body > section").append(footer);
        });
    }

    $docsify.plugins = [].concat($docsify.plugins, main);
})(document);