(function(){
    var isAnimating = false;

    $(".pop-window div").on("click", function(){
        var obj = $(this),
            width = 200,
            speed = 10;

        if(isAnimating){
            return;
        }


        if(obj.hasClass("pop-out")){
            animation.popOut(obj.parent(), function(){
                isAnimating = true;
                obj.removeClass("pop-out");
                obj.addClass("pop-in");
            }, function(){
                isAnimating = false;
            }, width, speed);

            return;
        }

        animation.popIn(obj.parent(), function(){
            isAnimating = true;
            obj.removeClass("pop-in");
            obj.addClass("pop-out");
        }, function(){
            isAnimating = false;
        }, speed);
    });
}());
