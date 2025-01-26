const root = window.location.protocol + "//" + window.location.host;
let path;

(function(d) {
    let main = function(hook) {
        hook.doneEach(function() {
            path = window.location.pathname;
        });
    }

    $docsify = $docsify || {};
    $docsify.plugins = [].concat($docsify.plugins || [], main);
})(document);