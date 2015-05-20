#!/bin/sh

workpath=$(cd `dirname $0`; pwd)/
cd ${workpath}
rsync -rvt --exclude-from=./rsync_ignore.txt ./ root@119.29.72.23:/usr/share/nginx/html/pc/

