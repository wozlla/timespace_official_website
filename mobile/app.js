(function() {

    if (isIOS) {
        setTimeout(function() {
            snowFall.snow(document.body, {
                images: [
                    "images/flower_1.png",
                    "images/flower_2.png"
                ],
                shadow: false,
                maxSpeed: 2,
                flakeCount: 5,
                minSize: 20,
                maxSize: 50,
                useTransform: true
            });
        }, 2000);
    }

    function init() {
        var $$ = Dom7;

        window.timespace = new Framework7({
            pushState: true
        });

        var viewMain = timespace.addView('#view-main');
        var viewActivity = timespace.addView('#view-activity');
        var viewStrategy = timespace.addView('#view-about');


        /*
         *  main view
         */
        var sliderOk = true;
        var sliderTimeout;

        var mainSwiper = new Swiper('#view-main-swipe', {
            pagination: '.swiper-pagination',
            direction: 'vertical'
        });

        mainSwiper.on('slideChangeStart', function() {
            sliderOk = false;
        });

        mainSwiper.on('slideChangeEnd', function (swiper) {
            if(sliderTimeout) {
                clearTimeout(sliderTimeout);
                sliderTimeout = null;
            }
            if (swiper.activeIndex === 1) {
                $$(".ts-actions-item .one, " +
                    ".ts-actions-item .two, " +
                    ".ts-actions-item .three, " +
                    ".ts-actions-item .four, " +
                    ".ts-actions-item .bg").addClass('normal-position');
                sliderTimeout = setTimeout(function() {
                    sliderOk = true;
                    sliderTimeout = null;
                }, 500);
            } else {
                $$(".ts-actions-item .one, " +
                    ".ts-actions-item .two, " +
                    ".ts-actions-item .three, " +
                    ".ts-actions-item .four, " +
                    ".ts-actions-item .bg").removeClass('normal-position');
                sliderOk = true;
            }
        });

        var scale = window.innerWidth / 640;
        $$('.actions-content').transform("scale(" + scale + ',' + scale + ')');

        $$('.ts-actions-item').on('click', function() {
            if(sliderOk) {
                timespace.popup('.ts-popup-meng');
            }
        });

        /*
         *  activity view
         */
        $$('.activity-item').on('click', function (e) {
            window.location = $$(this).data('url');
        });

        /**
         * second popup menu
         */
        $$('.ts-data-popup-li').on('click', function() {
            var notify = timespace.addNotification({
                title: '时空召唤',
                message: '该功能即将开放，敬请期待!',
                closeIcon: false
            });
            setTimeout(function() {
                timespace.closeNotification(notify);
            }, 1500);
        });

        /*
         * about-page-animation
         * written by chen_yan
         * any problem please contact me -- tangsmail@yeah.net
         */

        $$('#weibo-link').on('click', function() {
            window.location = 'http://weibo.com/timespacesummon';
        });

        var intID;

        $$('.tab-link').on('click', function () {
            if($$(this).data('noswitch')) {
                return;
            }
            if ($$(this).prop('href').indexOf('view-about') == -1) {
                $$(".ts-actions-item .left, " +
                ".ts-actions-item .right, " +
                ".ts-actions-item .background, " +
                ".ts-actions-item .discription, " +
                ".ts-actions-item .hr").removeClass('normal-position');
                clearInterval(intID);
            } else {
                setTimeout(function () {
                    $$(".ts-actions-item .left, " +
                    ".ts-actions-item .right").addClass('normal-position');
                }, 200);
                setTimeout(function () {
                    $$(".ts-actions-item .background, " +
                    ".ts-actions-item .discription").addClass('normal-position');
                }, 500);
                setTimeout(function () {
                    $$(".ts-actions-item .hr").addClass('normal-position');
                }, 1000);
                intID = setInterval(function () {
                    if ($$(".shaky_icon").hasClass('normal-position')) {
                        $$(".shaky_icon").removeClass('normal-position')
                    } else {
                        $$(".shaky_icon").addClass('normal-position')
                    }
                }, 300);
            }
        });
    }

    var checkBgImgLoadedInterval = setInterval(function() {
        if(bgImgLoaded) {
            clearInterval(checkBgImgLoadedInterval);
            init();
        }
    }, 200);
})();

