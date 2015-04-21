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

    $(".second-row li").on("mouseover", function(e){
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




    //still building modal mention
    $("nav .hotnews,  nav .comment," +
    "nav .dropdown, " +
        ".bird, " +
    //".download," +
    ".first-row .left li, .first-row .middle, .first-row .right," +
    ".second-row ul li, .second-row .contact-us-big").on("click", function(e){
      $("#myModal").modal();

        e.preventDefault();
    });

    $(".download").on("click", function(e){
        if(browser.versions.isIE){
            alert("亲，ie浏览器不支持试玩，请使用chrome等webkit内核浏览器进行试玩。")
            return;
        }
        var playWindow = $("#play");

        //playWindow.attr("src", "http://shikong.html5dw.com/mobile/qrcode.html");
        playWindow.show();
    });
});

