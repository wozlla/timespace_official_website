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

                $(target).parents("li").after(
                    "<li class='body'><span>"
                    + body
                    + "</span></li>"
                    + "<li><button onclick='javascript:$(this).prev().remove();$(this).remove();'>关闭</button></li>"
                );
            }
        }
    }
}());