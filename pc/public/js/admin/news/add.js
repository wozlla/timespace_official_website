$(function(){
   $("form").on("submit", function(e){
      var title = $("#title").val(),
          body = $("#body").val(),
          isShow = !!$("#isShow").prop("checked"),
          icon = $("#icon-url").val(),
          id = $("#id").val();

       $.post("/pc/admin/news", {
           id: id,
           title: title,
           icon:icon,
           isShow: isShow,
           body: body
      }, function(url){
         location.href = url;
      });

      return false;
   });
});