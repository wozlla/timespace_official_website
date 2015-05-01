var fs = require("fs"),
    gulp = require("gulp"),
    plugin = require("../index"),
    Vinyl = require("vinyl"),
    path = require("path"),
    fake = require("../../testFake"),
    buildConfigOperator = require("../../lib/buildConfigOperator"),
    sinon = require("sinon");

describe("rewriteStaticResourceUrl", function () {
    var sandbox = null;
    var stream = null;
    var fileContent = null;
    var filePath = null,
        resourceMap = null,
        buildConfig = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        stream = plugin();
        fileContent = fake.single.getFileContent();
        filePath = fake.single.filePath;
        resourceMap = fake.single.getResourceMap();
        sandbox.stub(fs, "readFileSync").returns(
            JSON.stringify(
                resourceMap
            )
        );
        buildConfig =  fake.single.getBuildConfig();
        sandbox.stub(buildConfigOperator, "read").returns(buildConfig);
    });
    afterEach(function () {
        sandbox.restore();
    });

    it("rewrite js url based on resourceMap.json", function (done) {
        stream.on('data', function (newFile) {
            var contents = newFile.contents.toString();

            expect(contents.trim()).toContain(
            '<script src="/aaa/dist/no_cmd.js"></script>'
            );
            expect(contents.trim()).toContain(
                '<script src="/aaa/dist/cmd.js"></script>'
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
            path: filePath,
            contents: new Buffer(
                fileContent
            )
        });


        stream.write(testFile1);

        stream.end();
    });
    it("rewrite css url based on resourceMap.json", function (done) {
        stream.on('data', function (newFile) {
            var contents = newFile.contents.toString();

            expect(contents.trim()).toContain(
                '<link href="/aaa/dist/a.css" type="text/css" rel="stylesheet"/>'
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

            expect(contents.trim().indexOf("#build:css") > -1).toBeFalsy();
            expect(contents.trim().indexOf("#endbuild#") > -1).toBeFalsy();

            done();
        });

        //stream.on('end', function() {
        //});


        var testFile1 = new Vinyl({
            path: filePath,
            contents: new Buffer(
                fileContent
            )
        });


        stream.write(testFile1);

        stream.end();
    });
});

