var browser = {
    versions:function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            isIE: !!(document.all && u.indexOf('Opera') === -1),
            //不能用===，因为navigator.appVersion.match(/MSIE\s\d/i)为object类型，不是string类型
            isIE7: app.match(/MSIE\s\d/i) == "MSIE 7",
            isIE8: app.match(/MSIE\s\d/i) == "MSIE 8",
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            //can be true when using mac book!!!!
            //mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            winPhone:u.indexOf('Windows Phone ') > -1,
            iPhone: u.indexOf('iPhone') > -1,
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }()
};

(function(){

    if( browser.versions.ios || browser.versions.android || browser.versions.iPad || browser.versions.iPhone || browser.versions.winPhone){
        location.href = "http://shikong.html5dw.com/mobile/index.html";
        return;
    }

    if(browser.versions.isIE7 || browser.versions.isIE8){
        alert("亲，官网目前不支持当前浏览器，请用ie9及以上的ie浏览器或者chrome等webkit内核浏览器打开");
        return;
    }
}());
