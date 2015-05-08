$(function(){
   $("form").on("submit", function(e){
      var title = $("#title").val(),
          name = $("#name").val();
          body = $("#body").html();

       $.post("/pc/admin/tutorial", {
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