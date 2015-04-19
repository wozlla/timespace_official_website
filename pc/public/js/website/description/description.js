var description = (function(){
   return {
       showDetail: function(url, id){
           location.href = url + "?id=" + id;
       }
   }
}());
