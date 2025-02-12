((d) => {
    let main = (hook) => {
        hook.mounted(() => {
            const logo = d.createElement("img");
            logo.id = "logo";
            logo.src = "/assets/icons/logo.svg";
            
            const title = d.createElement("a");
            title.id = "title";
            title.href = "/", title.textContent = "贝克街221号";
            title.prepend(logo);
            
            const navbar = d.createElement("div");
            navbar.id = "navbar";
            navbar.className = location.pathname == "/" ? "navbar-coverpage" : "navbar-article";

            navbar.append(title);
            navbar.append(d.createElement("ul"));
            d.querySelector("body").prepend(navbar);

            const nav = new Array(), icon = new Array();
            const navText = ["首页", "文章", "关于", "设置"], navHref = ["/", "README"];

            for(let i = 0; i < 4; ++i) {
                icon[i] = d.createElement("dotlottie-player");
                icon[i].className = "navIcon";
                icon[i].src = "/assets/icons/navbar/nav" + i + ".lottie";

                nav[i] = d.createElement("li");
                nav[i].className = "nav";
                
                if(navHref[i] != undefined) {
                    const a = d.createElement("a");
                    a.textContent = navText[i], a.href = navHref[i];
                    nav[i].append(a);
                } else nav[i].textContent = navText[i];

                nav[i].prepend(icon[i]);

                d.querySelector("#navbar > ul").append(nav[i]);
                nav[i].onpointerover = () => icon[i].play();
            }

            let construct = (ele, titles, hrefs) => {
                const ul = d.createElement("ul");
                ele.append(ul);
                
                for(let i = 0; i < titles.length; ++i) {
                    const a = d.createElement("a");
                    a.textContent = titles[i], a.href = hrefs[i];

                    const li = d.createElement("li");
                    li.append(a), ul.append(li);
                }

                ele.onpointerenter = () => {
                    ul.style.display = "flex";
                }
                ele.onpointerleave = () => {
                    ul.style.display = "none";
                }
            }

            construct(nav[2], ["Github", "投稿", "数据"], 
                ["https://github.com/jiaoliao946/Baker-Street-221b", "/About/submit", "/About/data"]);
            //construct(nav[3]);

            let hide = () => {
                navbar.style.top = "-45px";
                button.style.top = "5px";
                d.querySelector("main").style.marginTop = 0;
                d.querySelector(".toc-nav").style.top = "45px";
            };
            let show = () => {
                navbar.style.top = 0;
                button.style.top = "50px";
                d.querySelector("main").style.marginTop = "45px";
                d.querySelector(".toc-nav").style.top = "90px";
            };

            d.addEventListener("scroll", () => d.documentElement.scrollTop > 130 ? hide() : show())

            let button = d.createElement("button");
            button.className = "navbar-toggle";
            for(let i = 0; i < 3; ++i) button.append(d.createElement("span"));
            d.querySelector(".sidebar-toggle").before(button);
            button.onclick = () => navbar.style.top == "-45px" ? show() : hide();
        });

        hook.doneEach(() => {
            if(d.querySelector("#navbar") != null)
                d.querySelector("#navbar").className = location.pathname == "/" ?
                    "navbar-coverpage" : "navbar-article";
        });
    }

    $docsify.plugins = [].concat($docsify.plugins, main);
})(document);