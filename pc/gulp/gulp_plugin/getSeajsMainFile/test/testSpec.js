var fs = require('fs'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
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

        var seajsMainContent = "main content";

        sandbox.stub(fs, "readFileSync").returns(
            seajsMainContent
        );


        stream.on('data', function (newFile) {
            var contents = newFile.contents.toString();

            expect(contents.trim()).toEqual(
                seajsMainContent
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

        var seajsMain1Content = "main1 content";
        var seajsMain2Content = "main2 content";


        sandbox.stub(fs, "readFileSync")
        fs.readFileSync.onCall(0).returns(
            seajsMain1Content
        );
        fs.readFileSync.onCall(1).returns(
            seajsMain2Content
        );


        fileContent = JSON.stringify(
            resourceMap
        );

        var index = 1;

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
