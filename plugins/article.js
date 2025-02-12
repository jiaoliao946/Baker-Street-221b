((d) => {
    let main = (hook) => {
        let articleCount, articalHeight;     //文章字数和总长度;

        hook.beforeEach(function(content) {
            articleCount = content.match(/[\u4E00-\u9FA5]|[a-zA-Z0-9]+/g).length;     //得到文章汉字和英文单词的总字数
            if(articleCount > 10000) articleCount = (articleCount / 10000).toFixed(2) + "万";
            return content;
        });

        hook.doneEach(() => {
            if(location.pathname == "/") return ;

            articalHeight = parseInt(getComputedStyle(d.querySelector("#main")).height.replace("px", ""));     //得到文章总长度
            //显示首次上传和上次更新时间、访问次数、字数和预计阅读时间
            //使用commit API去Github获取首次上传和上次更新时间
            fetch("https://api.github.com/repos/jiaoliao946/Baker-Street-221b/commits?path=" + location.pathname + ".md")
                .then(response => response.json())
                    .then(json => {
                        let standardize = (number) => {
                            return number < 10 ? "0" + number : number;
                        }
                    
                        let toString = (date, sep) => {     //由Date变量得到表示时间的字符串
                            return date.getFullYear() + sep + standardize(date.getMonth() + 1) + sep + standardize(date.getDate()) + 
                                " " + standardize(date.getHours()) + ":" + standardize(date.getMinutes());
                        }

                        let date0 = new Date(json[json.length - 1].commit.committer.date);
                        let date1 = new Date(json[0].commit.committer.date);
                        uploadData.setAttribute("datetime", toString(date0, "-"));
                        updateData.setAttribute("datetime", toString(date1, "-"));
                        uploadData.textContent = toString(date0, "/");
                        updateData.textContent = toString(date1, "/");
                    }).catch(error => {
                        console.error('错误:', error);
                    });
            //等待装填数据
            const uploadData = d.createElement("time");
            const updateData = d.createElement("time");
            updateData.textContent = uploadData.textContent = "未知";
            const visitData = d.createElement("span");
            visitData.id = "busuanzi_page_pv";
            //所有info Span
            const info = new Array();
            for(let i = 0; i < 5; ++i) {
                const icon = d.createElement("img");
                icon.className = "infoIcon";
                icon.src = "/assets/icons/article/info" + i + ".svg";

                info[i] = d.createElement("span");
                info[i].className = "info";

                if(i == 3) info[3].textContent = articleCount;
                else if(i == 4) info[4].textContent = Math.round(articleCount / 250);

                info[i].prepend(icon);
            }
            info[0].title = "首次上传时间", info[0].append(uploadData);
            info[1].title = "上次更新时间", info[1].append(updateData);
            info[2].title = "访问次数", info[2].append(visitData);
            info[3].title = "字数", info[4].title = "预计阅读时间（分钟）";
            //左半边
            const infoL = d.createElement("span");
            infoL.id = "infoL";
            infoL.append(info[0]), infoL.append(info[1]);
            //右半边
            const infoR = d.createElement("span");
            infoR.id = "infoR";
            infoR.append(info[2]), infoR.append(info[3]), infoR.append(info[4]);
            //总
            const infobar = d.createElement("span");
            infobar.id = "infobar";
            infobar.append(infoL), infobar.append(infoR);
            d.querySelector("#main > h1").after(infobar);
        });

        hook.mounted(() => {
            let hideUp;
            let hide = (ele, timeout, jud1) => {
                if(!jud1) clearTimeout(hideUp);
                hideUp = setTimeout(() => {
                    if(!jud1 || scrollY < 130) ele.style.right = "-80px";
                }, timeout);
            }
            let show = (ele, timeout, jud1, jud2) => {
                setTimeout(() => {
                    if(!jud1 || scrollY >= 130) ele.style.right = "0";
                    if(jud2) hide(ele, 1000, false);
                }, timeout);
            }

            const up = d.createElement("img");//回到开头按钮
            up.id = "up";
            up.src = "/assets/icons/article/up.svg";

            const upDiv = d.createElement("div");
            upDiv.id = "upDiv";
            upDiv.append(up);

            d.querySelector("#main").after(upDiv);
            //点击回到开头
            up.onclick = () => { scrollTo(0, 0), hide(upDiv, 0, false) };
            //判断是否悬浮
            let jud = 0;
            //上滑弹出
            d.onwheel = (event) => {
                if(scrollY >= 130)
                    if(event.wheelDelta > 0) {
                        hide(upDiv, 100, true);
                        if(jud == 0) show(upDiv, 100, true, true);
                    } else if(jud == 0) hide(upDiv, 0, false);
            };
            //触边弹出及悬浮稳定
            upDiv.onpointerenter = () => {
                if(scrollY >= 130) show(upDiv, 0, false, false), jud = 1, clearTimeout(hideUp);
            };
            upDiv.onpointerleave = () => { hide(upDiv, 1000, false), jud = 0 };
        });

        hook.ready(() => {
            let getPCT = () => Math.ceil(d.documentElement.scrollTop / articalHeight * 100);
            const progress = d.createElement("progress");     //进度条
            progress.max = 100, progress.value = location.pathname == "/" ? 0 : getPCT();
            d.onscroll = () => progress.value = getPCT();
            d.querySelector("main").prepend(progress);
        });
    };

    $docsify.plugins = [].concat($docsify.plugins, main);
})(document);