$(function(){
   $("form").on("submit", function(e){
      var title = $("#title").val(),
          body = $("#body").val(),
          isShow = !!$("#isShow").prop("checked"),
          category = $("#category").val(),
          id = $("#id").val();

       $.put("/pc/admin/description", {
           id: id,
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