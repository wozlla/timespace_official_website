var news = (function(){
   return {
       showDetail: function(url, id){
           $.get(url, {
               id: id
           }, function(htmlContent){
               $("#content-container").html(htmlContent);
           });
       },
       getListByPage:function(e, pageNumber){
           e = e || window.event;

           $.get("/pc/news/content", {
               pageNumber: pageNumber
           }, function(htmlContent){
               $("#content").html(htmlContent);
               //$(e.target).siblings().removeClass("active");
               //$(e.target).addclass("active");
           });
       }
   }
}());
