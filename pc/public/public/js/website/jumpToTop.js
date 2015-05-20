define(function (require, exports, module) {
    function _getCurrentScrollTop() {
        if (navigator.userAgent.indexOf("Chrome") >= 0) {
            return document.body.scrollTop;
        }
        else {
            return document.documentElement.scrollTop;
        }
    }

    exports.init = function () {
        $(window).on("scroll", function () {
            var top = _getCurrentScrollTop(),
                HEIGHT = 1000;

            if (top >= HEIGHT) {
                $(".jump-to-top").show();
            }
            else {
                $(".jump-to-top").hide();
            }
        });
    }
});
