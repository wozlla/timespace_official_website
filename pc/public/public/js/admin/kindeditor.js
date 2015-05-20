var options = {
    uploadJson: "/pc/admin/upload",

    afterChange: function () {
        if (window.editor) {
            window.editor.sync();
        }
    },
    afterPaste: function (contentStr) {
        var kindeditor = this;

        //var htmlItem = getHtmlItem(e.event.clipboardData.items);
        //
        //if(!htmlItem){
        //    return;
        //}
        //
        //htmlItem.getAsString(function (contentStr) {
        //var dom = $(e.currentTarget);
        var kindDom = $(this.cmd.doc).find("."+this.bodyClass);

        var imgDataArr = [];

        var REGEX = /"(https:\/\/[^.]+\.googleusercontent\.com\/[^"]+)"/mg;
        var imgPathArr = parse(contentStr, REGEX);


        var isNoticeError = false;

        if (imgPathArr.length === 0) {
            return;
        }

        imgPathArr.forEach(function (path, index) {
            //it should start vpn when invoke this method!
            fileUploader.getImgBase64DataFromSrc(path, function (dataURL) {
                var url = "/pc/admin/upload/batch";

                imgDataArr.push({
                    base64Data: dataURL,
                    fieldName: "imgFile" + String(index)
                });

                if (isFinishFetchData(imgDataArr, imgPathArr)) {
                    fileUploader.batchUploadInMultipartType(url, imgDataArr, function (dataArr) {
                        var content = null;
                        var imgDataArr = getImgPathBeforeAndAfterReplace(imgPathArr, dataArr.urlArr);

                        content = replaceImgUrl(contentStr, imgDataArr);

                        //kindeditor.insertContent(content);
                        updateContent(kindDom, kindeditor.srcElement, content);
                    });
                }
            }, function () {
                if (isNoticeError) {
                    return;
                }

                isNoticeError = true;

                alert("加载图片失败,请检查您是否开启了vpn");

                return;
            });
        })
        //});
    }
};


//function getHtmlItem(itemArr) {
//    return Array.prototype.filter.call(itemArr, function (data) {
//        return data.type === "text/html";
//    })[0];
//}

function parse(contentStr, regex) {
    var dataArr = null,
        result = [];

    while ((dataArr = regex.exec(contentStr)) !== null) {
        result.push(dataArr[1]);
    }

    return result;
}

function isFinishFetchData(imgDataArr, imgPathArr) {
    return imgDataArr.length === imgPathArr.length;
}

//function isFinishUploadImg(imgContainer, imgPathArr) {
//    return getLength(imgContainer) === imgPathArr.length;
//}
//
//function getLength(container) {
//    var i = null,
//        count = 0;
//
//    for (i in container) {
//        if (container.hasOwnProperty(i)) {
//            count = count + container[i].length;
//        }
//    }
//
//
//    return count;
//}

function getImgPathBeforeAndAfterReplace(beforePathArr, afterPathArr) {
    var result = [];

    if (beforePathArr.length !== afterPathArr.length) {
        throw new Error("the img path data's number before replace are not equal to path data'number after replace");
        return;
    }

    beforePathArr.forEach(function (path, index) {
        //result[path] = afterPathArr[index];
        result.push([path, findCorrespondPath(afterPathArr, index)]);
    });

    return result;
}

function findCorrespondPath(pathArr, index) {
    return pathArr.filter(function (data) {
        //because it's a async process that fetch data from server, it should ensure the data is corrsponding,
        //so the data server side returned contain index data to help front end corresponding.
        return data[0] === index;
    })[0][1];
}

function replaceImgUrl(contentStr, imgContainer) {
    var result = contentStr;

    //for (path in imgContainer) {
    //    if (imgContainer.hasOwnProperty(path)) {
    //        result = result.replace(new RegExp(path, "g"), imgContainer[path][0]);
    //    }
    //}
    imgContainer.forEach(function (pathArr) {
        result = result.replace(new RegExp(pathArr[0], "g"), pathArr[1]);
    });

    return result;
}

function updateContent(kindDom, dom, contentStr) {
    kindDom.html(contentStr);
    dom.val(contentStr);
}


KindEditor.ready(function (K) {
    window.editor = K.create("#body", options);
});
