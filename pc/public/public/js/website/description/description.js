var description = (function(){
   return {
       showDetail: function(url, id){
           //$.get(url, {
           //    id: id
           //}, function(htmlContent){
           //    $("#content-container").html(htmlContent);
           //});

           window.open("/pc/description?id=" + id);
       }
   }
}());
