(function(d){
    let main = function(hook) {
        hook.doneEach(function() {
            if(path == "/") return ;
            const logo = document.createElement("img");
            logo.className = "logo";
            logo.src = root + "/assets/icons/logo.png";
            d.querySelector(".sidebar-nav > ul > li > a").prepend(logo);
            logo.onclick = () => { location.href = root };     //点击logo
        });
    };

    $docsify = $docsify || {};
    $docsify.plugins = [].concat($docsify.plugins || [], main);
})(document);