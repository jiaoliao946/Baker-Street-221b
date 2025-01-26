(function(){
    let main = function(hook) {
        hook.doneEach(function() {
            if(path == "/") return ;
            const logo = document.querySelector(".logo");
            logo.onclick = () => { location.href = "." };     //点击logo
        });
    };

    $docsify = $docsify || {};
    $docsify.plugins = [].concat($docsify.plugins || [], main);
})();