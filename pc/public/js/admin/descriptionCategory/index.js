$(function () {
    $(".category-list").sortable({
        onDrop: function ($item, container, _super) {
            var result = [],
                url = "/pc/admin/descriptionCategory/sort";

            $(container.target).children("li").each(function (index, li) {
                result.push([
                    $(li).children("span").text(),
                    index + 1
                ]);
            });

            $.put(url, {
                dataArr:JSON.stringify(result)
            }, function(isSuccess){
                if(isSuccess === true){
                    alert("排序成功");
                    return;
                }

                alert("失败:" + arguments[0]);
            });

            //$item.find('ol.dropdown-menu').sortable('enable')
            _super($item, container)
        }
    });
});
