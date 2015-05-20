var tutorial = (function () {
    return {
        getListByPage: function (e, pageNumber) {
            e = e || window.event;

            $.get("/pc/admin/tutorial/content", {
                pageNumber: pageNumber
            }, function (htmlContent) {
                $("#content").html(htmlContent);
            });
        }
    }
}());
