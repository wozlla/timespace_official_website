#!/bin/sh

workpath=$(cd `dirname $0`; pwd)/
cd ${workpath}

rm -R dist
mkdir dist
cp -R ../images dist/
cp ../index.html dist/
cp ../qrcode.html dist/

uglifycss \
    ../bower_components/framework7/dist/css/framework7.min.css \
    ../style.css > dist/all.min.css

uglifyjs \
    ../bower_components/framework7/dist/js/framework7.min.js \
    ../snowfall.js \
    ../app.js -o dist/all.min.js

node replace.js

