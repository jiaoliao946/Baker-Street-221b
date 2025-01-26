(function(d){
    function playSound(id) {
        document.querySelector(id).play();
    }

    let main = function(hook) {
        hook.mounted(function() {
            let content = d.querySelector(".content");
            for(let i = 0; i < 6; ++i) {
                let reaction = d.createElement("audio");
                reaction.id = "reaction" + i;
                reaction.src = root + "/assets/sounds/waline/reaction" + i + ".mp3";
                content.append(reaction);
            }
        });

        hook.doneEach(function() {
            if(path == "/") return ;
            d.querySelector("#waline").addEventListener("finished", () => {
                document.querySelector("img[alt='很喜欢']").onpointerover = () => { playSound("#reaction0"); };
                document.querySelector("img[alt='好极了']").onpointerover = () => { playSound("#reaction1"); };
                document.querySelector("img[alt='有疑惑']").onpointerover = () => { playSound("#reaction2"); };
                document.querySelector("img[alt='吃瓜中']").onpointerover = () => { playSound("#reaction3"); };
                document.querySelector("img[alt='真无聊']").onpointerover = () => { playSound("#reaction4"); };
                document.querySelector("img[alt='出错了']").onpointerover = () => { playSound("#reaction5"); };
            });
        });
    };

    $docsify = $docsify || {};
    $docsify.plugins = [].concat($docsify.plugins || [], main);
})(document);