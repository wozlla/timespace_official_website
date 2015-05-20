$(function(){
   $("form").on("submit", function(e){
       var name = $("#name").val(),
           id = $("#id").val();

       $.put("/pc/admin/descriptionCategory", {
           id: id,
           name:name
      }, function(url){
         location.href = url;
      });

      return false;
   });
});