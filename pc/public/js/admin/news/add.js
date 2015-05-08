$(function(){
   $("form").on("submit", function(e){
      var title = $("#title").val(),
          body = $("#body").html(),
          isShow = !!$("#isShow").prop("checked"),
          icon = $("#icon-url").val();

       $.post("/pc/admin/news", {
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