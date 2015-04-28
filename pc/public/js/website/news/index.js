define(function(require, exports, module) {
    var global = require("../global");

    function limitText(){
        var MAXLENGTH = 100;

        $(".body .item p").each(function(){
            var text = $(this).text();

            if(text.trim().length >= MAXLENGTH){

                $(this).text(text.slice(0, MAXLENGTH) + "......");
            }
        });
    }

    exports.init = function(){
        global.init();

        limitText();
    };
});