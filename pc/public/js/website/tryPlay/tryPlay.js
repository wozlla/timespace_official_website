$(function(){
    //still building modal mention
    $(".hotnews,  .comment," +
    ".try-play-button").on("click", function(e){
        $("#myModal").modal();

        e.preventDefault();
    });


    //if(browser.versions.isIE7 || browser.versions.isIE8 || browser.versions.isIE9){
    if(browser.versions.isIE){
        var playWindow = $("#play");

        //playWindow.attr("src", "http://shikong.html5dw.com/mobile/qrcode.html");
        playWindow.hide();

        alert("亲，ie浏览器不支持试玩，请使用chrome等webkit内核浏览器进行试玩。")
        return;
    }
});
