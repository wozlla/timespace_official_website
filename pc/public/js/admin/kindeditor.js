var options = {
    uploadJson: "/pc/admin/upload",

    afterPaste: function (e) {
        $(e.event.clipboardData.items[1].getAsString(function(contentStr){
        //var contentStr = $(cmd.doc.getElementsByClassName(this.bodyClass)).html();
        //var contentStr = dom.html();

//var dom = $(cmd.doc.getElementsByClassName(this.bodyClass));
            var dom = $(e.currentTarget);

        var imgContainer = {};

        var REGEX = /"(https:\/\/[^.]+\.googleusercontent\.com\/[^"]+)"/mg;
        var imgPathArr = parse(contentStr, REGEX);

        if (imgPathArr.length === 0) {
            return;
        }

        imgPathArr.forEach(function (path) {
            var image = new Image();

            //because the path is from outer domain, so enable crossOrigin
            image.crossOrigin = "anonymous";

            image.src = path;
            image.onload = function () {
                var canvas = document.createElement("canvas");
                canvas.width = this.width;
                canvas.height = this.height;

                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0);

                var dataURL = canvas.toDataURL("image/png");

                //test single upload
                //batch upload

                //use multipart/form-data  format to batch post img data


                var url = "/pc/admin/upload";

                var fd = new FormData();


                var blob = fileOperator.dataURLToBlob(dataURL);

                /*!
                 if not set the 3rd param, the filename will be "blob"(in chrome),
                 and the server side(use node-formiable) will not set the uploaded file's extension!
                 so just set the 3rd param with any filename(just contain correct extension, and the filename could be any one, since it will be renamed in server side(node-formiable))

                 reference:
                 Since you are uploading Blobs, by default,
                 the user agent will set the name parameter of the Content-Disposition header in the file's multipart boundary to "blob" or something similar.
                 You can theoretically override this value with the 3rd parameter in FormData.append, but support for this is not very good.
                 For example, this is not supported in Safari or Firefox versions older than 22. I suspect mobile browsers might also not support this, but I haven't confirmed
                 */
                fd.append("imgFile", blob, "a.png");


                //send formData
                $.ajax({
                    url: url,
                    type: "POST",
                    data: fd,
                    processData: false,  // 告诉jQuery不要去处理发送的数据
                    contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
                    success: function (data) {
                        //console.log(data.url);
                        var content = null;

                        //the path may exist in multi places(such as img src,data-src),
                        //so it's structure should be array.
                        if(!imgContainer[path]){
                            imgContainer[path] = [data.url];
                        }
                        else{
                            imgContainer[path].push(data.url);
                        }

                        if (isFinishUploadImg(imgContainer, imgPathArr)) {
                            content = replaceImgUrl(contentStr, imgContainer);
                            updateContent(dom, content);
                        }
                    },
                    error: function (jqXHR, error, errorThrown) {
                        console.log("upload " + path + " failed. error:" + error);
                    }
                });
            }
        })
        }));
    },
};


function parse(contentStr, regex) {
    var dataArr = null,
        result = [];

    while ((dataArr = regex.exec(contentStr)) !== null) {
        result.push(dataArr[1]);
    }

    return result;
}


function isFinishUploadImg(imgContainer, imgPathArr) {
    return getLength(imgContainer) === imgPathArr.length;
}

function getLength(container) {
    var i = null,
        count = 0;

    for (i in container) {
        if (container.hasOwnProperty(i)) {
            count = count + container[i].length;
        }
    }


    return count;
}

function replaceImgUrl(contentStr, imgContainer) {
    var path = null,
        result = contentStr;

    for (path in imgContainer) {
        if (imgContainer.hasOwnProperty(path)) {
            result = result.replace(new RegExp(path, "g"), imgContainer[path][0]);
        }
    }

    return result;
}

function updateContent(dom, contentStr) {
    dom.html(contentStr);
}

KindEditor.ready(function (K) {
    window.editor = K.create("#body", options);
});
