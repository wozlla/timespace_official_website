$(function(){
    var isMove = false;

    $(".banner").hover(function(e){
        if(isMove){
            return;
        }
        animation.moveRight($("#banner-title"), 50, 1.5);
        animation.moveLeft($("#banner-bg"), 50, 1.2);

        isMove = true;
    }, function(){
    });


    var titles = $("#switch-title").find("li");

    //todo click
    titles.on("click", function(){
    });

    animation.switchImg($("#switch-img").children("img"), titles);



    $(document).snowfall('clear');
    $(document).snowfall({
        images :["/image/index/banner/flower_1.png", "/image/index/banner/flower_2.png"],
        flakeCount: 10, minSize: 20, maxSize:32});
});

