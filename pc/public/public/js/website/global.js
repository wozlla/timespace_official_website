define(function (require, exports, module) {
    var animation = require("./animation");

    function _initModal(){
        //$(
        //    //".contact-us-small," +
        //    ".first-row .middle, .first-row .right"
        //    //".second-row .contact-us-big"
        //).on("click", function (e) {
        //        $("#myModal").modal();
        //
        //        e.preventDefault();
        //    });

        $(".contact-us-small,.contact-us-big").on("click", function (e) {
            $("#contact-modal").modal();

            e.preventDefault();
        });
    }

    function _submitContactUs(){
        $("#contact-form").on("submit", function (e) {
            var name = $("#name").val(),
                email = $("#email").val(),
                body = $("#body").val(),
                form = this,
                url = "/pc/contactUs";

            e.preventDefault();
            e.stopPropagation();

            if (!/^[0-9a-zA-Z-_.]+@[0-9a-zA-Z-_]+\.[0-9a-zA-Z-_]+$/.test(email)) {
                alert("您的邮箱不正确,请重新填写");
                return;
            }
            if(name.length === 0){
                alert("姓名不能为空");
                return;
            }
            if(body.length === 0){
                alert("内容不能为空");
                return;
            }

            $.post(url, {
                name: name,
                email: email,
                body: body
            }, function (isSuccess) {
                form.reset();
                $("#contact-modal").modal("hide");

                if (isSuccess) {
                    alert("我们收到了您的宝贵意见,谢谢您的关注");
                    return;
                }

                alert("发送失败,请稍候再试");
            });
        });
    }

    exports.init = function () {
        var isAnimating = false;

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

        _initModal();

        _submitContactUs();
    };
});
