var fs = require("fs"),
    plugin = require("../index"),
    convertUtils = require("../../convertUtils"),
    Vinyl = require("vinyl"),
    path = require("path"),
    through = require("through-gulp"),
    sinon = require("sinon");

describe("concat", function () {
    var sandbox = null;
    var stream = null;
    var fileContent = null;
    var filePath = null;
    var buildConfig = null;
    var cwd = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        stream = plugin();

        buildConfig =
        {
            "urlMap": [{
                "staticResourcePrefix": "/pc/js",
                "relativePrefix": "public/js"
            }]
        };

        sandbox.stub(fs, "readFileSync").returns(
            JSON.stringify(
                buildConfig
            )
        );
        sandbox.stub(fs, "writeFileSync");

        cwd = "/";
        sandbox.stub(process, "cwd").returns(cwd);

        filePath = "./file/footer.ejs";
        fileContent = convertUtils.toString(function () {/*
         <script type="text/javascript" >
         var jiathis_config={
         summary:"",
         shortUrl:false,
         hideMore:false
         }
         </script>

         <!--no-cmd-module-->
         <!--#build:js:replace dist/no_cmd.js#-->
         <script src="/pc/js/bower_components/jquery/dist/jquery.js"></script>
         <script src="/pc/js/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
         <script src="/pc/js/bower_components/seajs/dist/sea.js"></script>
         <script src='/pc/js/bower_components/seajs-wrap/dist/seajs-wrap.js'></script>
         <script src="/pc/js/website/global.js"></script>
         <script src="/pc/js/website/animation.js"></script>
         <script src="/pc/js/website/nav.js"></script>
         <!--bower_components-->
         <!--global init-->
         <!--custom module with no cmd-->
         <!--#endbuild#-->
         <script type="text/javascript" src="http://v3.jiathis.com/code_mini/jia.js" charset="utf-8"></script>


         <!--#build:js:seajsMain dist/cmd.js #-->
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
        var DELIMITER = "\n\r";
        var fileContent1 = "aaa",
            fileContent2 = "bbb",
            fileContent3 = "ccc";
        var testFile1 = new Vinyl({
            contents: new Buffer(
                fileContent1
            )
        });
        testFile1.dist = "./a.js";
        var testFile2 = new Vinyl({
            contents: new Buffer(
                fileContent2
            )
        });
        testFile2.dist = "./b.js";
        var testFile3 = new Vinyl({
            contents: new Buffer(
                fileContent3
            )
        });
        testFile3.dist = "./b.js";

        stream.write(testFile1);
        stream.write(testFile2);
        stream.write(testFile3);

        var index = 1;
        //order:getSeajsMainFile(file1) -> this -> getSeajsMainFile(file2) -> this
        stream.pipe(through(function (file, encoding, callback) {
            if(index === 1){
                expect(file.contents.toString()).toEqual(
                    fileContent1
                )
            }
            else{
                expect(file.contents.toString()).toEqual(
                    fileContent2 + DELIMITER + fileContent3
                )
            }
            index = index + 1;

            callback();
        }, function(callback){
            expect(index - 1).toEqual(2);

            callback();

            done();
        }));


        stream.end();
    });
});

