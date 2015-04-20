$(function(){
    var isMove = false;

    $(".banner").hover(function(e){
        if(isMove){
            return;
        }

        isMove = true;

        animation.moveRight($("#banner-title"), 50, 1.5);
        animation.moveLeft($("#banner-bg"), 50, 1.2);

    }, function(){
    });

    var isTextMove = {
    }

    $(".second-row li").hover(function(e){
        var dom = null,
            textFlag = null;
        var distance = 70,
            placeLeftPos = 110,
            speed = 2;

        if(e.target.tagName === "DIV"){
            dom = $(e.target).children();
        }
        else if(e.target.tagName === "IMG"){
            dom = $(e.target).next().children();
        }
        else if(e.target.tagName === "SPAN"){
            dom = $(e.target);
        }

        textFlag = dom.html();


        if(isTextMove[textFlag]){
            return;
        }

        isTextMove[textFlag] = true;


        animation.moveLeft(dom, distance, speed, function(){
            animation.place(dom, placeLeftPos, function(){
                animation.moveLeft(dom, 70, speed, function(){
                    isTextMove[textFlag] = false;
                });
            });
        });
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

