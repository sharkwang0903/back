(function () {
    "use strict";

    function start() {
        window.NumberBackpack.game.init();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
}());
