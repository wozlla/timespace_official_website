var fs = require('fs'),
    plugin = require('../index'),
    assert = require('stream-assert'),
    Vinyl = require('vinyl'),
    path = require('path'),
    through = require('through-gulp'),
    convertUtils = require('../../convertUtils'),
    sinon = require('sinon'),
buildConfigOperator = require('../../lib/buildConfigOperator');

describe("getSeajsMainFile", function () {
    var sandbox = null;
    var stream = null;
    var fileContent = null;
    var cwd = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        stream = plugin();

        buildConfig = {
            "urlMap": [{
                "staticResourcePrefix": "/pc/js",
                "relativePrefix": "public/js"
            },
                {
                    "staticResourcePrefix": "/aaa/dist",
                    "relativePrefix": "dist"
                }]
        };
        sandbox.stub(buildConfigOperator, "read").returns(buildConfig);

        cwd = "/User/";
        sandbox.stub(process, "cwd").returns(cwd);
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("single main file", function(){
        var seajsMainContent = null,
            buildConfig = null,
            resourceMap = null;

        beforeEach(function(){
            sandbox.stub(fs, "readFileSync");
            seajsMainContent = convertUtils.toString(function(){
                seajs.config({
                    "base": "/pc"
                });

                seajs.use('js/website/index/index.js',function(index){
                    index.init();
                });
            }).trim();
            fs.readFileSync.onCall(0).returns(
                seajsMainContent
            );
            resourceMap =
            {
                "/footer.ejs": [
                    {
                        command: 'replace',
                        dist: '/aaa/dist/no_cmd.js',
                        startLine: 203,
                        endLine: 893
                    },
                    {
                        command: 'seajsMain',
                        dist: '/aaa/dist/cmd.js',
                        "fileUrlArr": ["/pc/js/main.js"]
                    }
                ]
            };
            fileContent = JSON.stringify(
                resourceMap
            );
        });

        it("get seajs main file content", function (done) {
            stream.on('data', function (newFile) {
                var contents = newFile.contents.toString();

                expect(contents.trim()).toContain(
                    "seajs.use"
                );

                done();
            });
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
        it("convert main file src to absolute path", function(done){
            stream.on('data', function (newFile) {
                var contents = newFile.contents.toString();

                expect(contents.trim()).toContain(
                    "seajs.use('" + cwd + "'/public/js/website/index/index.js',function(index){"
                );

                done();
            });

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
        it("file.dist is relative to cwd", function(done){
            stream.on('data', function (newFile) {
                var contents = newFile.contents.toString();

                expect(newFile.dist).toEqual(
                    "dist/cmd.js"
                );

                done();
            });

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

    describe("multi main file.", function(){
        var seajsMain1Content = null,
            seajsMain2Content = null,
            resourceMap = null;

        beforeEach(function(){
            seajsMain1Content = "main1 content";
            seajsMain2Content = "main2 content";

            sandbox.stub(fs, "readFileSync");

            fs.readFileSync.onCall(0).returns(
                seajsMain1Content
            );
            fs.readFileSync.onCall(1).returns(
                seajsMain2Content
            );
            resourceMap =
            {
                "./1.ejs": [
                    {
                        command: 'replace',
                        dist: '/aaa/dist/no_cmd.js',
                        startLine: 203,
                        endLine: 893
                    },
                    {
                        command: 'seajsMain',
                        dist: '/aaa/dist/cmd.js ',
                        "fileUrlArr": ["/pc/js/main.js"]
                    }
                ],
                "./2.ejs": [
                    {
                        command: 'replace',
                        dist: '/aaa/dist/no_cmd.js',
                        startLine: 203,
                        endLine: 893
                    },
                    {
                        command: 'seajsMain',
                        dist: '/aaa/dist/cmd2.js ',
                        "fileUrlArr": ["/pc/js/main2.js"]
                    }
                ]
            };
            fileContent = JSON.stringify(
                resourceMap
            );
        });

        it("get multi seajs main file content.", function(done){
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
