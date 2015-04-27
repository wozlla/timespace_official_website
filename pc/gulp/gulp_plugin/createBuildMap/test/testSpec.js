var fs = require('fs'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plugin = require('../index'),
    convertUtils = require('../../convertUtils'),
    assert = require('stream-assert'),
    Vinyl = require('vinyl'),
    path = require('path'),
    sinon = require('sinon');

describe("createBuildMap", function () {
    var sandbox = null;
    var stream = null;
    var fileContent = null;
    var buildConfig = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        stream = plugin();

        buildConfig =
        {
            "urlMap": [{
            "staticResourcePrefix": "/pc/js",
            "relativePrefix": "../pulic/js"
        }]
        };

        sandbox.stub(fs, "readFileSync").returns(
            JSON.stringify(
                buildConfig
            )
        );
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
         */
        });

        //attach data event listener can switch the stream into flowing mode,
        // which will trigger the end event!

        //Attaching a data event listener to a stream that has not been explicitly paused will switch the stream into flowing mode.
        //Note that the end event will not fire unless the data is completely consumed. This can be done by switching into flowing mode,
        stream.on('data', function () {
        });
    });
    afterEach(function () {
        sandbox.restore();
    });

    it("can parse replace command", function (done) {
        var filePath = path.join(__dirname, "./file/footer.ejs");

        stream.on('end', function () {
            fs.readFile(
                path.join(process.cwd(), "gulp/resourceMap.json"),
                function (e, data) {
                    if (e) {
                        gutil.log(e.message);
                        //self.emit('error', new gutil.PluginError(PLUGIN_NAME, e.message));
                        return;
                    }

                    var json = JSON.parse(data.toString());

                    expect(json[filePath]).toBeArray();
                    expect(json[filePath][0]).toEqual(
                        {
                            command: 'replace',
                            dist: '/pc/dist/no_cmd.js',
                            fileUrlArr: ['../pulic/js/bower_components/jquery/dist/jquery.js', '../pulic/js/bower_components/bootstrap/dist/js/bootstrap.min.js', '../pulic/js/bower_components/seajs/dist/sea.js', '../pulic/js/bower_components/seajs-wrap/dist/seajs-wrap.js', '../pulic/js/website/global.js', '../pulic/js/website/animation.js', '../pulic/js/website/nav.js'],
                            startLine: 203,
                            endLine: 893
                        }
                    );

                    done();
                }
            );
        });


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

        /*!
         bug!!!!!!!!! not invoke transform func!!!! kao!!!!!

         //gulp.src(filePath)
         //    .pipe(plugin())
         //.pipe(assert.first(function( srcData ){
         //    //expect(fs.writeFile).toCalledOnce();
         //    //expect(fs.writeFile.args[0][0]).toEqual("../resourceMap.json");
         //    //expect(fs.writeFile.args[0][1]).toEqual(
         //    //    ""
         //    //);
         //    var json = JSON.parse(fs.readFileSync("/gulp/resourceMap.json"));
         //
         //    expect(json[filePath]).toBeArray();
         //    expect(json[filePath]).toEqual([
         //        {
         //            "command": "replace",
         //            "startLine": 10,
         //            "endLine": 18,
         //            "dist": "/pc/dist/no_cmd_module.js",
         //            "fileUrlArr": [
         //                "js/website/global.js",
         //                "js/website/animation.js"
         //            ]
         //        }
         //    ])
         //}))
         //.pipe( assert.end(done));

         */
    });
    it("can parse seajsMain command", function (done) {
        var filePath = path.join(__dirname, "./file/footer.ejs");

        stream.on('end', function () {
            fs.readFile(
                path.join(process.cwd(), "gulp/resourceMap.json"),
                function (e, data) {
                    if (e) {
                        gutil.log(e.message);
                        //self.emit('error', new gutil.PluginError(PLUGIN_NAME, e.message));
                        return;
                    }

                    var json = JSON.parse(data.toString());

                    expect(json[filePath]).toBeArray();
                    expect(json[filePath][1]).toEqual(
                        {
                            command: 'seajsMain',
                            dist: '/pc/dist/cmd.js ',
                            fileUrlArr: ['../pulic/js/website/index/main.js'],
                            startLine: 1007,
                            endLine: 1149
                        }
                    );

                    done();
                }
            );
        });


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
    //it("can build multi page's build map", function(done){
    //    stream.on('end', function(newFile) {
    //        fs.readFile(
    //            path.join(process.cwd(), "gulp/resourceMap.json"),
    //            function(e, data){
    //                if(e){
    //                    gutil.log(e.message);
    //                    //self.emit('error', new gutil.PluginError(PLUGIN_NAME, e.message));
    //                    return;
    //                }
    //
    //                var json = JSON.parse(data.toString());
    //
    //                expect(json[filePath]).toBeArray();
    //                expect(json[filePath][1]).toEqual(
    //                    { command : 'seajsMain', dist : '../dist/cmd.js ', fileUrlArr : [ '../pulic/js/website/index/main.js' ], startLine : 854, endLine : 962 }
    //                );
    //
    //                done();
    //            }
    //        );
    //    });
    //
    //
    //    var testFile1 = new Vinyl({
    //        //cwd: "./",
    //        //base: "./file",
    //        path: filePath,
    //        contents: new Buffer(fs.readFileSync(filePath))
    //    });
    //
    //    stream.write(testFile1);
    //
    //    stream.end();
    //});
});

