var bulletinBoard = (function () {
    return {
        getListByPage: function (e, pageNumber) {
            e = e || window.event;

            $.get("/pc/admin/game/bulletinBoard/content", {
                pageNumber: pageNumber
            }, function (htmlContent) {
                $("#content").html(htmlContent);
            });
        }
    }
}());
