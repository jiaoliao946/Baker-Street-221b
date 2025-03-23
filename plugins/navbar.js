((d) => {
    const main = (hook) => {
        hook.mounted(() => {
            const logo = d.createElement("img");     //图标
            logo.id = "logo";
            logo.src = "/assets/icons/logo.svg";
            
            const title = d.createElement("a");     //博客标题
            title.id = "title";
            title.href = "/", title.textContent = "贝克街221号";
            title.prepend(logo);     //把logo加在博客标题开头
            
            const navbar = d.createElement("div");     //导航栏
            navbar.id = "navbar";
            navbar.className = location.pathname == "/" ? "navbar-coverpage" : "navbar-article";     //防止doneEach在mounted之前执行

            navbar.append(title);     //把博客标题加在导航栏开头
            navbar.append(d.createElement("ul"));     //建立导航索引
            d.querySelector("body").prepend(navbar);     //把导航栏加在body开头

            const nav = new Array(), navIcon = new Array();     //每个导航及图标
            const navText = ["首页", "文章", "关于", "设置"], navHref = ["/", "/README"];     //每个导航的文本及点击后跳转到的地址

            for(let i = 0; i < 4; ++i) {
                navIcon[i] = d.createElement("dotlottie-player");     //使用DotLottie加载图标
                navIcon[i].className = "navIcon";
                navIcon[i].src = "/assets/icons/navbar/nav" + i + ".lottie";

                nav[i] = d.createElement("li");
                nav[i].className = "nav";
                
                if(navHref[i] != undefined) {     //若导航点击后会跳转
                    const a = d.createElement("a");     //导航首个元素为链接
                    a.textContent = navText[i], a.href = navHref[i];
                    nav[i].append(a);
                } else nav[i].textContent = navText[i];     //反之填入文本即可

                nav[i].prepend(navIcon[i]);     //把图标依次加在对应导航开头
                d.querySelector("#navbar > ul").append(nav[i]);     //把导航依次加在ul末尾
                nav[i].addEventListener("pointerenter", () => {
                    navIcon[i].seek(0), navIcon[i].play(); 
                });     //给导航分别添加进入事件（播放图标）
            }

            const construct = (ele, texts, hrefs) => {
                const ul = d.createElement("ul");     //导航的下拉列表
                ele.append(ul);     //把ul加在ele导航末尾
                
                for(let i = 0; i < texts.length; ++i) {
                    const a = d.createElement("a");     //列表中的链接
                    a.textContent = texts[i], a.href = hrefs[i];

                    const li = d.createElement("li");     //列表的元素
                    li.append(a), ul.append(li);     //把链接依次加在li末尾，把li加在ul末尾
                }

                ele.onpointerenter = () => ul.style.display = "flex";     //进入ele，显示列表
                ele.onpointerleave = () => ul.style.display = "none";     //离开ele，隐藏列表
            }

            construct(nav[2], ["Github", "投稿", "数据"], 
                ["https://github.com/jiaoliao946/Baker-Street-221b", "/About/submit", "/About/data"]);     //构建导航——“关于”
            nav[2].querySelector("a").target = "_blank";     //点击Github打开新页面
            //construct(nav[3]);

            const hide = () => {     //隐藏导航栏
                navbar.style.top = "-45px";     //导航栏向上
                button.style.top = "5px";     //导航栏切换按钮向上
                d.querySelector("main").style.marginTop = 0;     //主体向上
                d.querySelector(".toc-nav").style.top = "45px";     //目录向上
            };
            const show = () => {     //显示导航栏
                navbar.style.top = 0;     //导航栏向下
                button.style.top = "50px";     //导航栏切换按钮向下
                d.querySelector("main").style.marginTop = "45px";     //主体向下
                d.querySelector(".toc-nav").style.top = "90px";     //目录向下
            };

            d.addEventListener("scroll", () => scrollY > 130 ? hide() : show());     //网站滚动超过一定范围，隐藏导航栏，反之显示

            const button = d.createElement("button");     //导航栏切换按钮
            button.className = "navbar-toggle";
            for(let i = 0; i < 3; ++i) button.append(d.createElement("span"));     //给该按钮添加三条杠
            d.querySelector(".sidebar-toggle").before(button);     //把该按钮加在侧边栏切换按钮前
            button.onclick = () => navbar.style.top == "-45px" ? show() : hide();     //点击该按钮，若显示则隐藏，若隐藏则显示
        });

        hook.doneEach(() => {
            if(d.querySelector("#navbar") != null)     //防止doneEach在mounted之前执行
                d.querySelector("#navbar").className = location.pathname == "/" ?
                    "navbar-coverpage" : "navbar-main";     //显示封面和主体时class不同（方便设计CSS）
        });
    }

    $docsify.plugins = [].concat($docsify.plugins, main);
})(document);