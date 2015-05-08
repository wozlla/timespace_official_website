$(function(){
   $("form").on("submit", function(e){
      var title = $("#title").val(),
          name = $("#name").val(),
          body = $("#body").html(),
          id = $("#id").val();

       $.put("/pc/admin/tutorial", {
           id: id,
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