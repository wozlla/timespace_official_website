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

