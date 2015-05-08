var options = {
    uploadJson: "/pc/admin/upload",

    afterPaste: function (e) {
        $(e.event.clipboardData.items[1].getAsString(function (contentStr) {
            var dom = $(e.currentTarget);

            var imgContainer = {};

            var REGEX = /"(https:\/\/[^.]+\.googleusercontent\.com\/[^"]+)"/mg;
            var imgPathArr = parse(contentStr, REGEX);

            if (imgPathArr.length === 0) {
                return;
            }

            imgPathArr.forEach(function (path) {
                //it should start vpn when invoke this method!
                fileUploader.getImgBase64DataFromSrc(path, function(dataURL){
                    var url = "/pc/admin/upload";

                    fileUploader.uploadInMultipartType(url, dataURL, function(data){
                        var content = null;

                        /*!
                         although in afterPaste func, the content doesn't contain more of the same path,
                         (but if put the code in afterChange func, then it contain)
                         but i still remain the structure to compatible!

                         the path may exist in multi places(such as img src,data-src),
                         so it's structure should be array.
                         */

                        if (!imgContainer[path]) {
                            imgContainer[path] = [data.url];
                        }
                        else {
                            imgContainer[path].push(data.url);
                        }

                        if (isFinishUploadImg(imgContainer, imgPathArr)) {
                            content = replaceImgUrl(contentStr, imgContainer);
                            updateContent(dom, content);
                        }
                    });

                });
            })
        }));
    }
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
