$(function(){
   $("form").on("submit", function(e){
       var name = $("#name").val();

       $.put("/pc/admin/descriptionCategory", {
           name:name
      }, function(url){
         location.href = url;
      });

      return false;
   });
});