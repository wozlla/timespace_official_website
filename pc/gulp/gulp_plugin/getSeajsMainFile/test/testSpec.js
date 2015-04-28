var fs = require('fs'),
    plugin = require('../index'),
    assert = require('stream-assert'),
    Vinyl = require('vinyl'),
    path = require('path'),
    through = require('through-gulp'),
    convertUtils = require('../../convertUtils'),
    sinon = require('sinon');

describe("getSeajsMainFile", function () {
    var sandbox = null;
    var stream = null;
    var fileContent = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        stream = plugin();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("single main file", function(){
        var seajsMainContent = null,
            buildConfig = null;

        beforeEach(function(){
            seajsMainContent = convertUtils.toString(function(){
                seajs.config({
                    "base": "/pc"
                });

                seajs.use('js/website/index/index.js',function(index){
                    index.init();
                });
            }).trim();

            sandbox.stub(fs, "readFileSync");
            fs.readFileSync.onCall(0).returns(
                seajsMainContent
            );

            buildConfig = {
                "seajsMainUrlMap":[
                    {
                        "staticResourcePrefix": "js",
                        "relativePrefix": "../public/js"
                    }
                ]
            };
            fs.readFileSync.onCall(1).returns(
                JSON.stringify(buildConfig)
            );
        });

        it("get seajs main file content", function (done) {
            //var filePath = "/footer.ejs";
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
                        "fileUrlArr": ["./main.js"]
                    }
                ]
            };

            //var seajsMainContent = "main content";
            //
            //sandbox.stub(fs, "readFileSync").returns(
            //    seajsMainContent
            //);

            stream.on('data', function (newFile) {
                var contents = newFile.contents.toString();

                expect(contents.trim()).toContain(
                    "seajs.use"
                );

                done();
            });

            //stream.on('end', function() {
            //});

            fileContent = JSON.stringify(
                resourceMap
            );



            var testFile1 = new Vinyl({
                //cwd: "./",
                //base: "./file",
                //path: filePath,
                contents: new Buffer(
                    fileContent
                )
            });


            stream.write(testFile1);

            stream.end();
        });
        it("convert main file src to gulpCanReadPath", function(done){
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
                        "fileUrlArr": ["./main.js"]
                    }
                ]
            };



            stream.on('data', function (newFile) {
                var contents = newFile.contents.toString();

                expect(contents.trim()).toContain(
                    "seajs.use('../public/js/website/index/index.js',function(index){"
                );

                done();
            });

            //stream.on('end', function() {
            //});

            fileContent = JSON.stringify(
                resourceMap
            );



            var testFile1 = new Vinyl({
                //cwd: "./",
                //base: "./file",
                //path: filePath,
                contents: new Buffer(
                    fileContent
                )
            });


            stream.write(testFile1);

            stream.end();

        });
    });

    describe("multi main file", function(){
        var seajsMain1Content = null,
            seajsMain2Content = null,
            buildConfig = null;

        beforeEach(function(){
            seajsMain1Content = "main1 content";
            seajsMain2Content = "main2 content";

            sandbox.stub(fs, "readFileSync");

            fs.readFileSync.onCall(0).returns(
                seajsMain1Content
            );
            fs.readFileSync.onCall(2).returns(
                seajsMain2Content
            );

            buildConfig = {
                "seajsMainUrlMap":[
                    {
                        "staticResourcePrefix": "js",
                        "relativePrefix": "../public/js"
                    }
                ]
            };
            fs.readFileSync.onCall(1).returns(
                JSON.stringify(buildConfig)
            );
            fs.readFileSync.onCall(3).returns(
                JSON.stringify(buildConfig)
            );
        });

        it("get multi seajs main file content", function(done){
            var resourceMap =
            {
                "./1.ejs": [
                    {
                        command: 'replace',
                        dist: '../dist/no_cmd.js',
                        startLine: 203,
                        endLine: 893
                    },
                    {
                        command: 'seajsMain',
                        dist: '../dist/cmd.js ',
                        "fileUrlArr": ["./main.js"]
                    }
                ],
                "./2.ejs": [
                    {
                        command: 'replace',
                        dist: '../dist/no_cmd.js',
                        startLine: 203,
                        endLine: 893
                    },
                    {
                        command: 'seajsMain',
                        dist: '../dist/cmd2.js ',
                        "fileUrlArr": ["./main2.js"]
                    }
                ]
            };


            fileContent = JSON.stringify(
                resourceMap
            );

            var index = 1;


            //order:getSeajsMainFile(file1) -> this -> getSeajsMainFile(file2) -> this

            stream.pipe(through(function (file, encoding, callback) {
                if(index === 1){
                    expect(file.contents.toString()).toEqual(
                        seajsMain1Content
                    )
                }
                else{
                    expect(file.contents.toString()).toEqual(
                        seajsMain2Content
                    )
                }
                index = index + 1;

                callback();
            }, function(callback){
                expect(index - 1).toEqual(2);

                callback();

                done();
            }));



            var testFile1 = new Vinyl({
                //cwd: "./",
                //base: "./file",
                //path: filePath,
                contents: new Buffer(
                    fileContent
                )
            });


            stream.write(testFile1);

            stream.end();

        });
    });
});
