$(function(){
   $("form").on("submit", function(e){
      var title = $("#title").val(),
          body = $("#body").val(),
          id = $("#id").val();

       $.put("/admin/news", {
           id: id,
           title: title,
           body: body
      }, function(url){
         location.href = url;
      });

      return false;
   });
});