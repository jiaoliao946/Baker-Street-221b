((d) => {
    const main = (hook) => {
        let articleCount, articalHeight;     //文章字数和总长度;

        hook.beforeEach(function(content) {
            articleCount = content.match(/[\u4E00-\u9FA5]|[a-zA-Z0-9]+/g).length;     //得到文章汉字和英文单词的总字数
            if(articleCount > 10000)     //若数量过万
                articleCount = (articleCount / 10000).toFixed(2) + "万";     //以万为单位且保留两位小数
            return content;
        });

        hook.doneEach(() => {
            if(location.pathname == "/") return ;     //封面跳过，防止不必要的操作

            //使用getComputedStyle，得到文章总长度具体像素值的字符串，而不是填在CSS里各种单位的字符串
            articalHeight = parseInt(getComputedStyle(d.querySelector("#main")).height.replace("px", ""));

            fetch("https://api.github.com/repos/jiaoliao946/Baker-Street-221b/commits?path=" 
                + location.pathname + ".md")     //使用commit API去Github获取首次上传和上次更新时间
                .then(response => response.json())     //返回响应的json
                    .then(json => {
                        const standardize = (number) => number < 10 ? "0" + number : number;     //在一位数前加0
                        const toString = (date, sep) => {     //由Date变量得到表示时间的字符串，sep指年、月、日之间的分隔符
                            return date.getFullYear() + sep + standardize(date.getMonth() + 1) +     //年、月
                                sep + standardize(date.getDate()) + " " +     //日
                                standardize(date.getHours()) + ":" + standardize(date.getMinutes());     //时、分
                        }

                        const date0 = new Date(json[json.length - 1].commit.committer.date);     //首次上传时间Date变量
                        const date1 = new Date(json[0].commit.committer.date);     //上次更新时间Date变量
                        uploadData.setAttribute("datetime", toString(date0, "-"));     //设置uploadData的datetime属性
                        updateData.setAttribute("datetime", toString(date1, "-"));     //设置updateData的datetime属性
                        uploadData.textContent = toString(date0, "/");     //填入首次上传时间
                        updateData.textContent = toString(date1, "/");     //填入上次更新时间
                    }).catch(error => console.error('错误:', error));     //报错

            const uploadData = d.createElement("time");     //首次上传时间
            const updateData = d.createElement("time");     //上次更新时间
            updateData.textContent = uploadData.textContent = "未知";     //fetch为异步操作，未获取到时间时填入“未知”
            const visitData = d.createElement("span");     //访问次数
            visitData.id = "busuanzi_page_pv";     //用于不蒜子填入该页访问次数

            const info = new Array();     //每个文章信息

            for(let i = 0; i < 5; ++i) {
                const icon = d.createElement("img");     //文章信息的图标
                icon.className = "infoIcon";
                icon.src = "/assets/icons/article/info" + i + ".svg";

                info[i] = d.createElement("span");
                info[i].className = "info";

                //若为“字数”或“预计阅读时长”，先填入文本，防止图标被覆盖
                if(i == 3) info[3].textContent = articleCount;
                else if(i == 4) info[4].textContent = (articleCount / 250).toFixed(2);

                info[i].prepend(icon);     //把图标依次加在文章信息开头
            }

            info[0].title = "首次上传时间", info[0].append(uploadData);
            info[1].title = "上次更新时间", info[1].append(updateData);
            info[2].title = "访问次数", info[2].append(visitData);
            info[3].title = "字数", info[4].title = "预计阅读时长（分钟）";     //给文章信息分别添加悬浮提示

            const infoL = d.createElement("span");     //文章信息栏左半边
            infoL.id = "infoL";
            //把“首次上传时间”和“上次更新时间”依次加在文章信息栏左半边开头
            infoL.append(info[0]), infoL.append(info[1]);

            const infoR = d.createElement("span");     //文章信息栏右半边
            infoR.id = "infoR";
            //把“访问次数”、“字数”和“预计阅读时长”依次加在文章信息栏右半边开头
            infoR.append(info[2]), infoR.append(info[3]), infoR.append(info[4]);

            const infobar = d.createElement("span");     //文章信息栏
            infobar.id = "infobar";
            infobar.append(infoL), infobar.append(infoR);     //把左半边和右半边依次加在文章信息栏末尾
            d.querySelector("#main > h1").after(infobar);     //把文章信息栏加在标题后
        });

        hook.mounted(() => {
            const article = d.querySelector("#main");     //文章

            const hitokoto = d.createElement("a");     //一言
            hitokoto.id = "hitokoto";
            hitokoto.target = "_blank";     //点击打开新页面
            fetch("https://v1.hitokoto.cn/")
                .then(response => response.json())
                    .then(json => {
                        hitokoto.href = `https://hitokoto.cn/?uuid=${json.uuid}`;     //点击跳转到的一言地址
                        const text = json.hitokoto, from = json.from, who = json.from_who;
                        hitokoto.textContent = text + (from != null || who != null ? " ——" : "");
                        if(who != null) hitokoto.textContent += who;     //若有作者则加入
                        if(from != null) hitokoto.textContent += "『" + from +"』";     //若有来源则加入
                    }).catch(error => console.error('错误:', error));
            article.before(hitokoto);     //把一言放在文章前

            let hideUp;     //下一个等待执行的隐藏指令
            //隐藏回到开头按钮，jud1决定延时结束后是否判断未移出一定范围
            const hide = (ele, timeout, jud1) => {
                if(!jud1) clearTimeout(hideUp);     //若延时结束后一定执行，则清除现在等待执行的隐藏指令
                hideUp = setTimeout(() => {
                    if(!jud1 || scrollY < 130) ele.style.right = "-80px";     //若无需判断或者需要判断且判断通过，则隐藏
                }, timeout);
            }
            //显示回到开头按钮，jud2决定延时结束后是否判断移动了一定范围，jud3决定显示后是否等下隐藏
            const show = (ele, timeout, jud2, jud3) => {
                setTimeout(() => {
                    if(!jud2 || scrollY >= 130) {     //若无需判断或者需要判断且判断通过，则显示
                        ele.style.right = "0";
                        if(jud3) hide(ele, 1000, false);     //若jud3为真，则等下隐藏
                    }
                }, timeout);
            }

            const up = d.createElement("img");     //回到开头按钮图标
            up.id = "up";
            up.src = "/assets/icons/article/up.svg";
            const upDiv = d.createElement("div");     //回到开头按钮容器，用于触边弹出
            upDiv.id = "upDiv";
            upDiv.append(up);     //把图标加在回到开头按钮容器末尾
            article.after(upDiv);     //把回到开头按钮容器加在文章后
            up.onclick = () => { scrollTo(0, 0), hide(upDiv, 0, false) };     //点击图标，回到文章开头
           
            let jud = 0;     //用于判断鼠标是否悬浮于上方
            d.onwheel = (event) => {     //移动滚轮
                if(scrollY >= 130)     //若移之前超出一定范围
                    if(event.wheelDelta > 0) {     //若向上移
                        hide(upDiv, 100, true);     //隐藏（需判断）
                        if(jud == 0) show(upDiv, 100, true, true);     //若未悬浮，显示（需判断、隐藏）
                    } else if(jud == 0) hide(upDiv, 0, false);     //若未悬浮，隐藏（无需延迟、判断）
                    //因此悬浮时除非移入一定范围，否则无论怎么移都不隐藏
            };
            upDiv.onpointerenter = () => {     //接触容器，因此容器露出的一点点可用于触边显示
                //若移出一定范围，清除现在等待执行的隐藏指令，更新jud，显示（无需延迟、判断、隐藏）
                if(scrollY >= 130) clearTimeout(hideUp), jud = 1, show(upDiv, 0, false, false);
            };
            upDiv.onpointerleave = () => { jud = 0, hide(upDiv, 1000, false) };     //离开容器，更新jud，隐藏（无需判断）
        });

        hook.ready(() => {     //一定在doneEach后
            const getPCT = () => Math.ceil(scrollY / articalHeight * 100) + "%";
            const progress = d.createElement("div");     //进度条
            progress.id = "progress";
            progress.style.width = location.pathname == "/" ? 0 : getPCT();     //初始化，防止刷新后进度条要再滚动一次才会更新
            d.querySelector("main").prepend(progress);     //把进度条加在主体开头
            d.onscroll = () => progress.style.width = getPCT();     //滚动，更新进度条长度
        });
    };

    $docsify.plugins = [].concat($docsify.plugins, main);
})(document);