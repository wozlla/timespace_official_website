$(function(){
   $("form").on("submit", function(e){
      var title = $("#title").val(),
          name = $("#name").val();
          body = $("#body").val();

       $.post("/pc/admin/game/bulletinBoard", {
           title: title,
           name: name,
           body: body
      }, function(data){
           if(data.isSuccess){
               location.href = data.url;
               return;
           }

           alert(data.message);
      });

      return false;
   });
});