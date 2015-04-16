(function() {

    var $$ = Dom7;

    var timespace = new Framework7({
        pushState: true
    });

    var viewMain = timespace.addView('#view-main');
    var viewActivity = timespace.addView('#view-activity');
    var viewStrategy = timespace.addView('#view-about');

    var mainSwiper = new Swiper('#view-main-swipe', {
        pagination:'.swiper-pagination',
        direction: 'vertical'
    });

    mainSwiper.on('slideChangeStart', function(swiper) {
        if(swiper.activeIndex !== 1) {
            timespace.accordionClose(".accordion-item");
        }
    });

    mainSwiper.on('slideChangeEnd', function(swiper) {
        if(swiper.activeIndex === 1) {
            $$( ".ts-actions-item .one, " +
                ".ts-actions-item .two, " +
                ".ts-actions-item .three, " +
                ".ts-actions-item .four, " +
                ".ts-actions-item .bg").addClass('normal-position');
        } else {
            $$( ".ts-actions-item .one, " +
                ".ts-actions-item .two, " +
                ".ts-actions-item .three, " +
                ".ts-actions-item .four, " +
                ".ts-actions-item .bg").removeClass('normal-position');
        }
    });

    $$('.accordion-item-two').on('open', function () {
        $$('.actions-content-container').addClass('open2');
    });

    $$('.accordion-item-two').on('close', function () {
        $$('.actions-content-container').removeClass('open2');
    });

    $$('.accordion-item-three').on('open', function () {
        $$('.actions-content-container').addClass('open3');
    });

    $$('.accordion-item-three').on('close', function () {
        $$('.actions-content-container').removeClass('open3');
    });

    var scale = window.innerWidth/640;
    $$('.actions-content').transform("scale(" + scale + ',' + scale + ')');

    if(isIOS) {
        snowFall.snow(document.body, {
            images: [
                "images/flower_1.png",
                "images/flower_2.png"
            ],
            shadow: false,
            maxSpeed: 2,
            flakeCount: 5,
            minSize: 20,
            maxSize: 50
        });
    }

})();

