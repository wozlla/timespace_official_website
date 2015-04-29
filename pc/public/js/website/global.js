define(function(require, exports, module) {
    var animation = require("./animation");

    var isAnimating = false;

    exports.init = function(){
        $(".pop-window div").on("click", function () {
            var obj = $(this),
                width = 210,
                speed = 10;

            if (isAnimating) {
                return;
            }

            if (obj.hasClass("pop-out")) {
                animation.popOut(obj.parent(), width, speed, function () {
                    isAnimating = true;
                    obj.removeClass("pop-out");
                    obj.addClass("pop-in");
                }, function () {
                    isAnimating = false;
                });

                return;
            }

            animation.popIn(obj.parent(), speed, function () {
                isAnimating = true;
                obj.removeClass("pop-in");
                obj.addClass("pop-out");
            }, function () {
                isAnimating = false;
            });
        });



//still building modal mention
        $(
            ".contact-us-small," +
            ".first-row .middle, .first-row .right," +
            ".second-row .contact-us-big"
        ).on("click", function (e) {
                $("#myModal").modal();

                e.preventDefault();
            });
    };
});
