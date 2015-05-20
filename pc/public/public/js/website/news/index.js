define(function(require, exports, module) {
    var global = require("../global"),
        jump = require("../jumpToTop");

    //function limitText(){
    //    var MAXLENGTH = 130;
    //
    //    $(".body .item p").each(function(){
    //        var text = $(this).text();
    //
    //        if(text.trim().length >= MAXLENGTH){
    //
    //            $(this).text(text.slice(0, MAXLENGTH) + "......");
    //        }
    //    });
    //}

    exports.init = function(){
        global.init();
        jump.init();
        //
        //limitText();
    };
});