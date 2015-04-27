//var fs = require( 'fs' ),
//    gulp = require( 'gulp' ),
//    getList = require('./index'),
//    //should = require( 'should' ),
//    //gutil = require( 'gulp-util' ),
//    assert = require( 'stream-assert' );
//    //handlebars = require( 'gulp-handlebars' ),
//    //wrap = require( 'gulp-wrap' ),
//    //seajsCombo = require( '../index' );
//
//describe("getSeajsFileList", function(){
//    beforeEach(function(){
//    });
//
//    it("return seajs dependence files listArr", function(done){
//        gulp.src("./resourceMap.json")
//            .pipe(getList())
//            .pipe( assert.first(function( srcData ){
//                expect(srcData.contents.toString()).(
//                    ["/gulp_plugin/test/main.js", "/gulp_plugin/test/a.js",
//                    "/gulp_plugin/test/c.js", "/gulp_plugin/test/b.js"]
//                    )
//            }))
//            .pipe( assert.end(done));
//    });
//});