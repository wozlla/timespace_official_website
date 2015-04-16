$(function(){
    function limitText(){
        var MAXLENGTH = 100;

        $(".body .item p").each(function(){
            var text = $(this).text();

            if(text.length >= MAXLENGTH){
                $(this).text(text.slice(0, MAXLENGTH) + "......");
            }
                });
    }

    limitText();
});