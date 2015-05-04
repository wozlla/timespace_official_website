//seajs.config({
//    "base": "/pc",
//    alias:[
//    ]
//});

//seajs.us#e('./index.js',function(index){
seajs.use('/pc/js/website/index/index.js', function (index) {
    index.init();
});

