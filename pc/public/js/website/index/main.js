seajs.config({
    //#build:js:replace-seajs-base ./#
    "base": "/pc",
    //#endbuild#
    alias:[
    ]
});

//  if(buildSetting.state === "dev"){
//    seajs.use('app/js/app',function(){});
//  }
//  else{

//    seajs.use('js/website/index/index.js',function(index){
//      index.init();
//    });

//  }
seajs.use('./index.js',function(index){
    index.init();
});

