define(function(require, exports, module) {
window.requestNextAnimationFrame = (function () {
    var originalRequestAnimationFrame = undefined,
        wrapper = undefined,
        callback = undefined,
        geckoVersion = 0,
        userAgent = navigator.userAgent,
        index = 0,
        self = this;

    wrapper = function (time) {
        time = +new Date();
        self.callback(time);
    };

    if(window.requestAnimationFrame) {
        return requestAnimationFrame;
    }

    /*!
     bug!
     below code:
     when invoke b after 1s, will only invoke b, not invoke a!

     function a(time){
     console.log("a", time);
     webkitRequestAnimationFrame(a);
     }

     function b(time){
     console.log("b", time);
     webkitRequestAnimationFrame(b);
     }

     a();

     setTimeout(b, 1000);
     */

    // Workaround for Chrome 10 bug where Chrome
    // does not pass the time to the animation function

    if (window.webkitRequestAnimationFrame) {
        // Define the wrapper

        // Make the switch

        originalRequestAnimationFrame = window.webkitRequestAnimationFrame;

        window.webkitRequestAnimationFrame = function (callback, element) {
            self.callback = callback;

            // Browser calls the wrapper and wrapper calls the callback

            return originalRequestAnimationFrame(wrapper, element);
        }
    }

    //修改time参数
    if (window.msRequestAnimationFrame) {
        originalRequestAnimationFrame = window.msRequestAnimationFrame;

        window.msRequestAnimationFrame = function (callback) {
            self.callback = callback;

            return originalRequestAnimationFrame(wrapper);
        }
    }

    // Workaround for Gecko 2.0, which has a bug in
    // mozRequestAnimationFrame() that restricts animations
    // to 30-40 fps.

    if (window.mozRequestAnimationFrame) {
        // Check the Gecko version. Gecko is used by browsers
        // other than Firefox. Gecko 2.0 corresponds to
        // Firefox 4.0.

        index = userAgent.indexOf('rv:');

        if (userAgent.indexOf('Gecko') != -1) {
            geckoVersion = userAgent.substr(index + 3, 3);

            if (geckoVersion === '2.0') {
                // Forces the return statement to fall through
                // to the setTimeout() function.

                window.mozRequestAnimationFrame = undefined;
            }
        }
    }

//            return  window.requestAnimationFrame ||  //传递给callback的time不是从1970年1月1日到当前所经过的毫秒数！
    return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||

        function (callback, element) {
            var start,
                finish;

            window.setTimeout(function () {
                start = +new Date();
                callback(start);
                finish = +new Date();

                self.timeout = 1000 / 60 - (finish - start);

            }, self.timeout);
        };
}());

window.cancelNextRequestAnimationFrame = window.cancelRequestAnimationFrame
|| window.webkitCancelAnimationFrame
|| window.webkitCancelRequestAnimationFrame
|| window.mozCancelRequestAnimationFrame
|| window.oCancelRequestAnimationFrame
|| window.msCancelRequestAnimationFrame
|| clearTimeout;

module.exports= {
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

            requestNextAnimationFrame(_move);
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

            requestNextAnimationFrame(_move);
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

            requestNextAnimationFrame(_move);
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

            requestNextAnimationFrame(_move);
        }

        _move();
    },

    _data: [
        ["/pc/image/index/pic/1.jpg", "/pc/image/index/batton/play.jpg", "/pc/image/index/batton/play_h.jpg"],
        ["/pc/image/index/pic/2.jpg", "/pc/image/index/batton/feature.jpg", "/pc/image/index/batton/feature_h.jpg"],
        //todo skill.jpg
        ["/pc/image/index/pic/3.jpg", "/pc/image/index/batton/skill.jpg", "/pc/image/index/batton/skill_h.jpg"]
    ],
    _anim: null,

    switchImg: function(imgDom, titles, initIndex){
        var self = this,
            index = initIndex || 0,
            count = this._data.length,
            interval = 2000;

        this._anim = setInterval(function(){
            if(index < count - 1){
                index += 1;
            }
            else{
                index = 0;
            }

            self.select(imgDom, titles, index)
        }, interval);
    },
    stopSwitch: function(){
        clearInterval(this._anim);
    },
    _restoreTitle: function(titles){
        var self = this;

        titles.each(function(index, titleDom){
            $(titleDom).css("background-image", "url('" + self._data[index][2] + "')");
        });
    },
    select: function(imgDom, titles, index){
        this._restoreTitle(titles);

        var image = new Image();
        image.src = this._data[index][0];
        image.onload = function(){
            imgDom.attr("src", this.src);
            imgDom.data("index", index);
        };

        var image2 = new Image();
        image2.src = this._data[index][1];
        image2.onload = function(){
            $(titles.get(index)).css("background-image", "url('" + this.src+ "')");
            //$(titles.get(index)).data("index", index);
        };
    }
};

    });
