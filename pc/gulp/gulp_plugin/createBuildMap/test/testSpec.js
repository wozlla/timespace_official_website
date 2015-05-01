var fs = require("fs"),
    plugin = require("../index"),
    fake = require("../../testFake"),
    Vinyl = require("vinyl"),
    path = require("path"),
    sinon = require("sinon");

describe("createBuildMap", function () {
    var sandbox = null;
    var stream = null;
    var fileContent = null;
    var filePath = null;
    var buildConfig = null;
    var cwd = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        stream = plugin();

        buildConfig = fake.single.getBuildConfig();

        sandbox.stub(fs, "readFileSync").returns(
            JSON.stringify(
                buildConfig
            )
        );
        sandbox.stub(fs, "writeFileSync");

        cwd = fake.cwd;
        sandbox.stub(process, "cwd").returns(cwd);

        filePath = fake.single.filePath;
        fileContent = fake.single.getFileContent();
        //fileContent = convertUtils.toString(function () {/*
        // <!--#build:css:replace /pc/dist/a.css#-->
        // <link href="/pc/css/website/index/a.css" type="text/css" rel="stylesheet">
        // <link href="/pc/css/website/a.css" type="text/css" rel="stylesheet">
        // <!--#endbuild#-->
        //
        // <script type="text/javascript" >
        // var jiathis_config={
        // summary:"",
        // shortUrl:false,
        // hideMore:false
        // }
        // </script>
        //
        // <!--no-cmd-module-->
        // <!--#build:js:replace dist/no_cmd.js#-->
        // <script src="/pc/js/bower_components/jquery/dist/jquery.js"></script>
        // <script src="/pc/js/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
        // <script src="/pc/js/bower_components/seajs/dist/sea.js"></script>
        // <script src='/pc/js/bower_components/seajs-wrap/dist/seajs-wrap.js'></script>
        // <script src="/pc/js/website/global.js"></script>
        // <script src="/pc/js/website/animation.js"></script>
        // <script src="/pc/js/website/nav.js"></script>
        // <!--bower_components-->
        // <!--global init-->
        // <!--custom module with no cmd-->
        // <!--#endbuild#-->
        // <script type="text/javascript" src="http://v3.jiathis.com/code_mini/jia.js" charset="utf-8"></script>
        //
        //
        // <!--#build:js:seajsMain dist/cmd.js #-->
        // <script src="/pc/js/website/index/main.js"></script>
        // <!--#endbuild#-->
        // */
        //});

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
        stream.on('end', function () {
            var args = fs.writeFileSync.args[0];
            expect(args[0]).toEqual(
                path.join(cwd, "gulp/resourceMap.json")
            );
            var json = JSON.parse(args[1].toString());
            expect(json[filePath]).toBeArray();
            expect(json[filePath][0]).toEqual(
                {
                    command: 'replace',
                    dist: 'dist/a.css',
                    fileUrlArr: ['public/css/website/index/a.css', 'public/css/website/a.css'],
                    startLine: 0,
                    endLine: 240,
                    type: 'css'
                }
            );
            expect(json[filePath][1]).toEqual(
                {
                    command: 'replace',
                    dist: 'dist/no_cmd.js',
                    fileUrlArr: ['public/js/bower_components/jquery/dist/jquery.js', 'public/js/bower_components/bootstrap/dist/js/bootstrap.min.js', 'public/js/bower_components/seajs/dist/sea.js', 'public/js/bower_components/seajs-wrap/dist/seajs-wrap.js', 'public/js/website/global.js', 'public/js/website/animation.js', 'public/js/website/nav.js'],
                    startLine: 415,
                    endLine: 1003,
                    type: 'js'
                }
            );

            done();
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
         //            "dist": "dist/no_cmd_module.js",
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
        stream.on('end', function () {
            var args = fs.writeFileSync.args[0];
            expect(args[0]).toEqual(
                path.join(cwd, "gulp/resourceMap.json")
            );
            var json = JSON.parse(args[1].toString());

            expect(json[filePath]).toBeArray();
            expect(json[filePath][2]).toEqual(
                {
                    command: 'seajsMain',
                    dist: 'dist/cmd.js',
                    fileUrlArr: ['public/js/website/index/main.js'],
                    startLine: 1118,
                    endLine: 1261,
                    type: 'js'
                }
            );

            done();
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
    it("can build multi page's build map", function (done) {
        var fileContent2 = fake.multi.getFileContent2();
        var filePath2 = fake.multi.filePath2;

        stream.on('end', function () {
            var args = fs.writeFileSync.args[0];
            expect(args[0]).toEqual(
                path.join(cwd, "gulp/resourceMap.json")
            );
            var json = JSON.parse(args[1].toString());


            expect(json).toEqual(
                {
                    "/1.ejs": [{
                        command: 'replace',
                        dist: 'dist/a.css',
                        fileUrlArr: ['public/css/website/index/a.css', 'public/css/website/a.css'],
                        startLine: 0,
                        endLine: 240,
                        type: 'css'
                    }, {
                        command: 'replace',
                        dist: 'dist/no_cmd.js',
                        fileUrlArr: ['public/js/bower_components/jquery/dist/jquery.js', 'public/js/bower_components/bootstrap/dist/js/bootstrap.min.js', 'public/js/bower_components/seajs/dist/sea.js', 'public/js/bower_components/seajs-wrap/dist/seajs-wrap.js', 'public/js/website/global.js', 'public/js/website/animation.js', 'public/js/website/nav.js'],
                        startLine: 415,
                        endLine: 1003,
                        type: 'js'
                    }, {
                        command: 'seajsMain',
                        dist: 'dist/cmd.js',
                        fileUrlArr: ['public/js/website/index/main.js'],
                        startLine: 1118,
                        endLine: 1261,
                        type: 'js'
                    }],
                    "/2.ejs": [{
                        command: 'replace',
                        dist: 'dist/a2.css',
                        fileUrlArr: ['public/css/website/index/index.css', 'public/css/website/banner.css'],
                        startLine: 0,
                        endLine: 250,
                        type: 'css'
                    }, {
                        command: 'replace',
                        dist: 'dist/no_cmd2.js',
                        fileUrlArr: ['public/js/website/animation.js', 'public/js/website/nav.js'],
                        startLine: 253,
                        endLine: 451,
                        type: 'js'
                    }, {
                        command: 'seajsMain',
                        dist: 'dist/cmd2.js',
                        fileUrlArr: ['public/js/website/news/main.js'],
                        startLine: 565,
                        endLine: 708,
                        type: 'js'
                    }]
                }
            );

            done();
        });


        var testFile1 = new Vinyl({
            path: filePath,
            contents: new Buffer(
                fileContent
            )
        });
        var testFile2 = new Vinyl({
            path: filePath2,
            contents: new Buffer(
                fileContent2
            )
        });

        stream.write(testFile1);
        stream.write(testFile2);

        stream.end();
    });
});

