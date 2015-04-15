$(function(){
    var animation = {
        moveRight: function(dom, distance, speed){
            var total = 0,
                left = dom.position().left;

            function _move(){
                total = total + speed;

                if(total >= distance){
                    return;
                }


                dom.css("left", left + total);

                setTimeout(function(){
                    _move();
                }, 100);
            }

            _move();
        },
        moveLeft: function(dom, distance, speed){
            var total = 0,
            left = dom.position().left;

            function _move(){
                total = total - speed;

                if(Math.abs(total) >= distance){
                    return;
                }


                dom.css("left", left + total);

                setTimeout(function(){
                    _move();
                }, 100);
            }

            _move();
        },

        isAnimating: false,

        popOut: function(dom, onStartFunc, onEndFunc, width, speed){
            var total = 0,
                right = null;

            onStartFunc();

            function _move(){
                right = Number(dom.css("right").slice(0, -2));
                total = right + dom.width();

                if(Math.abs(total) >= width){
                    onEndFunc();
                    return;
                }

                dom.css("right", right + speed);

                setTimeout(function(){
                    _move();
                }, 100);
            }

            _move();
        },
        popIn: function(dom, onStartFunc, onEndFunc, width, speed){
            var total = 0,
                right = null;

            onStartFunc();

            function _move(){
                right = Number(dom.css("right").slice(0, -2));
                total = right + dom.width();

                if(Math.abs(total) <= width){
                    onEndFunc();
                    return;
                }

                this.isAnimating = true;

                dom.css("right", right - speed);

                setTimeout(function(){
                    _move();
                }, 100);
            }

            _move();
        },



        _data: [
            ["pic/1.png", "batton/play.jpg", "batton/play_h.jpg"],
            ["pic/2.png", "batton/feature.jpg", "batton/feature_h.jpg"],
            //todo skill.png
            ["pic/3.png", "batton/feature.jpg", "batton/feature_h.jpg"]
        ],
        switchImg: function(imgDom, titles){
                var self = this,
                index = 0,
                count = this._data.length,
                interval = 1000;

            setInterval(function(){
                if(index < count - 1){
                    index += 1;
                }
                else{
                    index = 0;
                }

                self.select(imgDom, titles, index)
            }, interval);
        },
        _restoreTitle: function(titles){
            var self = this;

            titles.each(function(index, titleDom){
               $(titleDom).css("background-image", "url('" + self._data[index][2] + "')");
            });
        },
        select: function(imgDom, titles, index){
            this._restoreTitle(titles);

            imgDom.attr("src", this._data[index][0] );
            //imgDom.css("background-image", "url('" + this._data[index][0] + "')");
            $(titles.get(index)).css("background-image", "url('" + this._data[index][1] + "')");
        }
    };

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
        images :["banner/flower_1.png", "banner/flower_2.png"],
        flakeCount: 10, minSize: 20, maxSize:32});
});
