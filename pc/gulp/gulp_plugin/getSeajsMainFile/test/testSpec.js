var fs = require("fs"),
    plugin = require("../index"),
    fake = require("../../testFake"),
    Vinyl = require("vinyl"),
    path = require("path"),
    through = require("through-gulp"),
    convertUtils = require("../../convertUtils"),
    sinon = require("sinon"),
    buildConfigOperator = require("../../lib/buildConfigOperator");

describe("getSeajsMainFile", function () {
    var sandbox = null;
    var stream = null;
    var fileContent = null;
    var cwd = null;
    var buildConfig = null;

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

    describe("single main file", function () {
        var seajsMainContent = null,
            resourceMap = null;

        beforeEach(function () {
            sandbox.stub(fs, "readFileSync");
            seajsMainContent = convertUtils.toString(function () {
                seajs.use('/pc/js/website/index/index.js', function (index) {
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
                        command: 'seajsMain',
                        dist: 'dist/cmd.js',
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
        it("convert main file src to absolute path", function (done) {
            stream.on('data', function (newFile) {
                var contents = newFile.contents.toString();

                expect(contents.trim()).toContain(
                    "seajs.use('" + cwd + "public/js/website/index/index.js'"
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
        it("file.dist is relative to cwd", function (done) {
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
        it("file.base is cwd, file.path is absolute path", function (done) {
            stream.on('data', function (newFile) {
                var contents = newFile.contents.toString();

                expect(newFile.base).toEqual(cwd);
                expect(newFile.path).toEqual(
                    cwd + "pc/js/main.js"
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

    describe("multi page has main file.", function () {
        var seajsMain1Content = null,
            seajsMainContent2 = null,
            resourceMap = null;

        beforeEach(function () {
            seajsMain1Content = "main1 content";
            seajsMainContent2 = "main2 content";

            sandbox.stub(fs, "readFileSync");

            fs.readFileSync.onCall(0).returns(
                seajsMain1Content
            );
            fs.readFileSync.onCall(1).returns(
                seajsMainContent2
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

        it("get multi seajs main file content.", function (done) {
            var index = 1;

            //order:getSeajsMainFile(file1) -> this -> getSeajsMainFile(file2) -> this

            stream.pipe(through(function (file, encoding, callback) {
                if (index === 1) {
                    expect(file.contents.toString()).toEqual(
                        seajsMain1Content
                    )
                }
                else {
                    expect(file.contents.toString()).toEqual(
                        seajsMainContent2
                    )
                }
                index = index + 1;

                callback();
            }, function (callback) {
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

   describe("multi main entrance", function(){
       //var seajsMainContent2 = null,
       //    seajsMainContent3 = null;

       beforeEach(function(){
           seajsMainContent = convertUtils.toString(function () {
               seajs.use(['/pc/js/website/index/a.js', '/pc/js/website/index/b.js'], function (index) {
                   index.init();
               });
           }).trim();
           sandbox.stub(fs, "readFileSync");
           fs.readFileSync.onCall(0).returns(
               seajsMainContent
           );
           //seajsMainContent2 = "a";
           //seajsMainContent3 = "b";
           //fs.readFileSync.onCall(1).returns(
           //    seajsMainContent2
           //);
           //fs.readFileSync.onCall(2).returns(
           //    seajsMainContent3
           //);

           resourceMap =
           {
               "/footer.ejs": [
                   {
                       command: 'seajsMain',
                       dist: 'dist/cmd.js',
                       "fileUrlArr": ["/pc/js/main.js"]
                   }
               ]
           };
           fileContent = JSON.stringify(
               resourceMap
           );
       });

       it("convert to absolute path", function(done){
           stream.on('data', function (newFile) {
               var contents = newFile.contents.toString();

               expect(contents.trim()).toContain(
                   "seajs.use(['"  + cwd + "public/js/website/index/a.js', '" + cwd + "public/js/website/index/b.js']"
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
       //it("split into separate main file which only contain one entrance", function(done){
       //    var index = 1;
       //
       //    stream.pipe(through(function (file, encoding, callback) {
       //        if (index === 1) {
       //            expect(file.contents.toString()).toEqual(
       //                seajsMainContent2
       //            )
       //        }
       //        else {
       //            expect(file.contents.toString()).toEqual(
       //                seajsMainContent3
       //            )
       //        }
       //        index = index + 1;
       //
       //        callback();
       //    }, function (callback) {
       //        expect(index - 1).toEqual(2);
       //
       //        callback();
       //
       //        done();
       //    }));
       //    var testFile1 = new Vinyl({
       //        contents: new Buffer(
       //            fileContent
       //        )
       //    });
       //
       //    stream.write(testFile1);
       //
       //    stream.end();
       //});
   });
});
