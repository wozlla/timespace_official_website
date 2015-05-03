$(function(){
   $("form").on("submit", function(e){
      var title = $("#title").val(),
          body = $("#body").val(),
          icon = $("#icon-url").val(),
          id = $("#id").val();

       $.put("/pc/admin/news", {
           id: id,
           title: title,
           icon:icon,
           body: body
      }, function(url){
         location.href = url;
      });

      return false;
   });
});