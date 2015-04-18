var index = (function(){
    return {
        //update: function(url, id){
        //    $.put(url, {
        //        id: id
        //    }, function(data){
        //    });
        //},
        delete: function(url, id){
            $.delete(url, {
                id: id
            }, function(data){
            });
        }
    }
}());