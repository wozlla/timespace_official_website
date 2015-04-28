var news = (function(){
   return {
       getListByPage:function(e, pageNumber){
           e = e || window.event;

           $.get("/pc/admin/news/content", {
               pageNumber: pageNumber
           }, function(htmlContent){
               $("#content").html(htmlContent);
               //$(e.target).siblings().removeClass("active");
               //$(e.target).addclass("active");
           });
       }
   }
}());
