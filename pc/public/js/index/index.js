$(function(){
    var isMove = false;

    $(".banner").hover(function(e){
        if(isMove){
            return;
        }
        animation.moveRight($("#banner-title"), 100, 0.5);
        animation.moveLeft($("#banner-bg"), 200, 0.2);

        isMove = true;
    }, function(){
    });

    var isAnimating = false;

    $(".pop-window div").on("click", function(){
        if(isAnimating){
            return;
        }

        var obj = $(this);

        if(obj.hasClass("pop-out")){
            animation.popOut(obj.parent(), function(){
                isAnimating = true;
                obj.removeClass("pop-out");
                obj.addClass("pop-in");
            }, function(){
                isAnimating = false;
            }, 200, 10);

            return;
        }

        animation.popIn(obj.parent(), function(){
            isAnimating = true;
            obj.removeClass("pop-in");
            obj.addClass("pop-out");
        }, function(){
            isAnimating = false;
        }, 100, 10);
    });

    var titles = $("#switch-title").find("li");

    //todo click
    titles.on("click", function(){
    });

    animation.switchImg($("#switch-img").children("img"), titles);



    //snow
    //add multi images effect
    $(document).snowfall('clear');
    $(document).snowfall({
        images :["/image/index/banner/flower_1.png", "/image/index/banner/flower_2.png"],
        flakeCount: 10, minSize: 20, maxSize:32});
});

