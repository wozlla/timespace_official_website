var news = (function(){
   return {
       getListByPage:function(e, pageNumber){
           e = e || window.event;

           $.get("/pc/admin/news/content", {
               pageNumber: pageNumber
           }, function(htmlContent){
               $("#content").html(htmlContent);
               //$(e.target).siblings().removeClass("active");
               //$(e.target).addclass("active");
           });
       },
       handleFiles: function(files){
           //upload single file
           var file = files[0];
           var url = "/pc/admin/news/uploadIcon";
           var size = file.size / (1024);
           var limit = 100; //100kb
           var ext = YYC.Html5.file.getFileExtension(file.name);

           if(size > limit){
               alert("图片不能超过" + limit + "kb");
               return;
           }

           YYC.Html5.file.readFile(file, function(e){
               //var imgBase64Data = YYC.Tool.code.base64.encode(e.target.result);
               var imgBase64Data = e.target.result;

               $.post(url, {
                   icon: imgBase64Data,
                   ext: ext
               }, function(data){
                   if(data.isSuccess === true){
                       $("#icon").attr("src", imgBase64Data);
                       $("#icon").show();
                       $("#icon-url").val(data.url);
                   }
                   else{
                       alert("上传失败:" + data.message);
                   }
               });
           });
       }
   }
}());
