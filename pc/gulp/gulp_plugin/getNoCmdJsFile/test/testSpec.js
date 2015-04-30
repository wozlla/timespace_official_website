var fs = require('fs'),
    plugin = require('../index'),
    assert = require('stream-assert'),
    Vinyl = require('vinyl'),
    path = require('path'),
    through = require('through-gulp'),
    convertUtils = require('../../convertUtils'),
    sinon = require('sinon'),
buildConfigOperator = require('../../lib/buildConfigOperator');

describe("getNoCmdJsFile", function () {
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

    describe("multi file", function(){
        var content = {},
            resourceMap = null;

        beforeEach(function(){
            sandbox.stub(fs, "readFileSync");
            content.jsContent1 = "1";
            content.jsContent2 = "2";
            content.jsContent3 = "3";
            content.jsContent4 = "4";
            content.jsContent5 = "5";
            content.jsContent6 = "6";
            fs.readFileSync.onCall(0).returns(
                content.jsContent1
            );
            fs.readFileSync.onCall(1).returns(
                content.jsContent2
            );
            fs.readFileSync.onCall(2).returns(
                content.jsContent3
            );
            fs.readFileSync.onCall(3).returns(
                content.jsContent4
            );
            fs.readFileSync.onCall(4).returns(
                content.jsContent5
            );
            fs.readFileSync.onCall(5).returns(
                content.jsContent6
            );

            resourceMap =
            {
                "/a.ejs": [
                    {
                        command: 'replace',
                        dist: '/aaa/dist/no_cmd1.js',
                        "fileUrlArr": [
                            "public/a.js",
                            "public/b.js"
                        ]
                    },
                    {
                        command: 'replace',
                        dist: '/aaa/dist/no_cmd2.js',
                        "fileUrlArr": [
                            "public/c.js",
                            "public/d.js"
                        ]
                    }
                ],
                "/b.ejs": [
                    {
                        command: 'replace',
                        dist: '/aaa/dist/no_cmd3.js',
                        "fileUrlArr": [
                            "public/e.js",
                            "public/f.js"
                        ]
                    }
                ]
            };
            fileContent = JSON.stringify(
                resourceMap
            );
        });

        it("get file contents", function (done) {
            var index = 1;

            stream.pipe(through(function (file, encoding, callback) {
                expect(file.contents.toString()).toEqual(
                    content["jsContent"+index]
                );

                index = index + 1;

                callback();
            }, function(callback){
                callback();

                done();
            }));

            var testFile1 = new Vinyl({
                contents: new Buffer(
                    fileContent
                )
            });

            stream.write(testFile1);

            stream.end();
        });
    });
});
