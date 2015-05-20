var contactUs = (function () {
    return {
        getListByPage: function (e, pageNumber) {
            e = e || window.event;

            $.get("/pc/admin/contactUs/content", {
                pageNumber: pageNumber
            }, function (htmlContent) {
                $("#content").html(htmlContent);
            });
        },

    }
}());
