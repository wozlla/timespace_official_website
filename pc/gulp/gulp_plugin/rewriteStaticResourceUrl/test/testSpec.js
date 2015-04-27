var fs = require('fs'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plugin = require('../index'),
    assert = require('stream-assert'),
    Vinyl = require('vinyl'),
    path = require('path'),
    convertUtils = require('../../convertUtils'),
    sinon = require('sinon');

describe("rewriteStaticResourceUrl", function () {
    var sandbox = null;
    var stream = null;
    var fileContent = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        stream = plugin();
        fileContent = convertUtils.toString(function () {/*
         <script type="text/javascript" >
         var jiathis_config={
         summary:"",
         shortUrl:false,
         hideMore:false
         }
         </script>

         <!--no-cmd-module-->
         <!--#build:js:replace /pc/dist/no_cmd.js#-->
         <script src="/pc/js/bower_components/jquery/dist/jquery.js"></script>
         <script src="/pc/js/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
         <script src="/pc/js/bower_components/seajs/dist/sea.js"></script>
         <script src="/pc/js/bower_components/seajs-wrap/dist/seajs-wrap.js"></script>
         <script src="/pc/js/website/global.js"></script>
         <script src="/pc/js/website/animation.js"></script>
         <script src="/pc/js/website/nav.js"></script>
         <!--bower_components-->
         <!--global init-->
         <!--custom module with no cmd-->
         <!--#endbuild#-->
         <script type="text/javascript" src="http://v3.jiathis.com/code_mini/jia.js" charset="utf-8"></script>


         <!--#build:js:seajsMain /pc/dist/cmd.js #-->
         <script src="/pc/js/website/index/main.js"></script>
         <!--#endbuild#-->
         */ });
    });
    afterEach(function () {
        sandbox.restore();
    });

    it("rewrite js url based on resourceMap.json", function (done) {
        var filePath = "/footer.ejs";
        var resourceMap =
        {
            "/footer.ejs": [
                {
                    command: 'replace',
                    dist: '../dist/no_cmd.js',
                    startLine: 203,
                    endLine: 893
                },
                {
                    command: 'seajsMain',
                    dist: '../dist/cmd.js ',
                    startLine: 1007,
                    endLine: 1149
                }
            ]
        };

        sandbox.stub(fs, "readFileSync").returns(
            JSON.stringify(
                resourceMap
            )
        );

        stream.on('data', function (newFile) {
            var contents = newFile.contents.toString();

            expect(contents.trim()).toContain(
            "<script src='../dist/no_cmd.js'></script>"
            );
            expect(contents.trim()).toContain(
                "<script src='../dist/cmd.js'></script>"
            );

            /*!
            jasmine-node not support nagativeCompare yet(yet @2.0.0 is not stable)

            //expect(contents.trim()).not.toContain(
            //    "#build:js"
            //);
            //expect(contents.trim()).not.toContain(
            //    "#endbuild#"
            //);
            */

            expect(contents.trim().indexOf("#build:js") > -1).toBeFalsy();
            expect(contents.trim().indexOf("#endbuild#") > -1).toBeFalsy();

            done();
        });

        //stream.on('end', function() {
        //});


        var testFile1 = new Vinyl({
            //cwd: "./",
            //base: "./file",
            path: filePath,
            contents: new Buffer(
                fileContent
            )
        });


        stream.write(testFile1);

        stream.end();
    });
});

