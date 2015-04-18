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
        }
    }
}());