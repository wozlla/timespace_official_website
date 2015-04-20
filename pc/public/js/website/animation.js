var animation = {
    moveRight: function(dom, distance, speed, onEndFunc){
        var total = 0,
            left = dom.position().left;

        function _move(){
            total = total + speed;

            if(total >= distance){
                onEndFunc && onEndFunc();
                return;
            }


            dom.css("left", left + total);

            setTimeout(function(){
                _move();
            }, 100);
        }

        _move();
    },
    moveLeft: function(dom, distance, speed, onEndFunc){
        var total = 0,
            left = dom.position().left;

        function _move(){
            total = total - speed;

            if(Math.abs(total) >= distance){
                onEndFunc && onEndFunc();
                return;
            }


            dom.css("left", left + total);

            setTimeout(function(){
                _move();
            }, 100);
        }

        _move();
    },
    place: function(dom, left, onEndFunc){
        dom.css("left", left);

        onEndFunc && onEndFunc();
    },
    popOut: function(dom,  width, speed , onStartFunc, onEndFunc){
        var total = 0,
            right = null;

        right = Number(dom.css("right").slice(0, -2));
        this._originTotal = right + dom.width();

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
    popIn: function(dom,  speed, onStartFunc, onEndFunc){
        var total = 0,
            right = null,
            originTotal = this._originTotal;

        onStartFunc();

        function _move(){
            right = Number(dom.css("right").slice(0, -2));
            total = right + dom.width();

            if(Math.abs(total) <= originTotal){
                onEndFunc();
                return;
            }

            dom.css("right", right - speed);

            setTimeout(function(){
                _move();
            }, 100);
        }

        _move();
    },

    //sequence: function(actionArr){
    //    var self = this;
    //
    //    function init(){
    //        var actionData = actionArr.pop();
    //        var dataArr = actionData.slice(1);
    //
    //        dataArr.push(function(){
    //            init();
    //        });
    //
    //        actionData[0].apply(animation, dataArr);
    //    }
    //
    //  actionArr.forEach(function(actionData){
    //      var dataArr = actionData.slice(1);
    //
    //      dataArr.push(function(){
    //          self.update(self.sequence());
    //      });
    //
    //      actionData[0].apply(animation, dataArr);
    //  });
    //
    //    actionArr.pop();
    //},
    //
    //scrollText: function(textDom, left, right, speed){
    //    var originLeft = textDom.position().left;
    //
    //
    //    var total = 0,
    //        right = null,
    //        originTotal = this._originTotal;
    //
    //    function _move(){
    //        total = total - speed;
    //
    //        if(Math.abs(total) >= distance){
    //            return;
    //        }
    //
    //
    //        dom.css("left", left + total);
    //
    //        setTimeout(function(){
    //            _move();
    //        }, 100);
    //    }
    //
    //    _move();
    //},



    _data: [
        ["/image/index/pic/1.png", "/image/index/batton/play.jpg", "/image/index/batton/play_h.jpg"],
        ["/image/index/pic/2.png", "/image/index/batton/feature.jpg", "/image/index/batton/feature_h.jpg"],
        //todo skill.png
        ["/image/index/pic/3.png", "/image/index/batton/feature.jpg", "/image/index/batton/feature_h.jpg"]
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

