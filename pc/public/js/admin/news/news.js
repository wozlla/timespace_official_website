var news = (function () {
    return {
        getListByPage: function (e, pageNumber) {
            e = e || window.event;

            $.get("/pc/admin/news/content", {
                pageNumber: pageNumber
            }, function (htmlContent) {
                $("#content").html(htmlContent);
                //$(e.target).siblings().removeClass("active");
                //$(e.target).addclass("active");
            });
        },
        handleFiles: function (files) {
            //upload single file
            var file = files[0],
                url = "/pc/admin/upload/icon",
                limit = 100; //100kb

            fileUploader.send(file, url, limit, function (data, base64Data) {
                if (data.isSuccess === true) {
                    $("#icon").attr("src", base64Data);
                    $("#icon").show();
                    $("#icon-url").val(data.url);
                }
                else {
                    alert("上传失败:" + data.message);
                }
            });
        }
    }
}());
