var index = (function(){
    return {
        showUpdatePage: function(url, id){
            location.href=url+ "?id=" + id;
        },
        delete: function(url, id){
            var isDelete = window.confirm("is it sure to delete?");

            if(!isDelete){
                return;
            }

            $.delete(url, {
                id: id
            }, function(url){
                //refresh page
               location.href = url;
            });
        },
        contactUs:{
            showDetail: function(body, e){
                var e = e || window.event,
                target = e.srcElement || e.target;

$(target).parents("li").next(".body").remove();
                $(target).parents("li").after(
                    "<li class='body'>" +
                    "<p>"
                    + body
                    + "</p>"
                    + "<button style='display:block;' onclick='javascript:$(this).prev().remove();$(this).remove();'>关闭</button>" +
                    "</li>"
                );
            }
        }
    }
}());