var fs = require("fs"),
    plugin = require("../index"),
    fake = require("../../testFake"),
    Vinyl = require("vinyl"),
    path = require("path"),
    through = require("through-gulp"),
    sinon = require("sinon"),
buildConfigOperator = require("../../lib/buildConfigOperator");

describe("getCssFile", function () {
    var sandbox = null;
    var stream = null;
    var fileContent = null;
    var cwd = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        stream = plugin();

        buildConfig = fake.single.getBuildConfig();
        sandbox.stub(buildConfigOperator, "read").returns(buildConfig);

        cwd = fake.cwd;
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
            content.cssContent1 = "1";
            content.cssContent2 = "2";
            content.cssContent3 = "3";
            content.cssContent4 = "4";
            fs.readFileSync.onCall(0).returns(
                content.cssContent1
            );
            fs.readFileSync.onCall(1).returns(
                content.cssContent2
            );
            fs.readFileSync.onCall(2).returns(
                content.cssContent3
            );
            fs.readFileSync.onCall(3).returns(
                content.cssContent4
            );

            resourceMap = fake.multi.getResourceMap();
            fileContent = JSON.stringify(
                resourceMap
            );
        });

        it("get file contents", function (done) {
            var index = 1;

            stream.pipe(through(function (file, encoding, callback) {
                expect(file.contents.toString()).toEqual(
                    content["cssContent"+index]
                );

                index = index + 1;

                callback();
            }, function(callback){
                expect(index - 1).toEqual(4);

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
