$(function(){
   $("form").on("submit", function(e){
      var title = $("#title").val(),
          body = $("#body").val(),
          isShow = !!$("#isShow").prop("checked"),
          category = $("#category").val();

       $.post("/pc/admin/description", {
           category: category,
           isShow:isShow,
           title: title,
           body: body
      }, function(url){
         location.href = url;
      });

      return false;
   });
});