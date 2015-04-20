var fs = require('fs');

var content = fs.readFileSync(__dirname + '/dist/index.html', 'utf8');
content = content.replace(/<\!-- JS START -->[\s\S]*?<\!-- JS END -->/ig, '<script src="all.min.js"></script>');
content = content.replace(/<\!-- CSS START -->[\s\S]*?<\!-- CSS END -->/ig, '<link rel="stylesheet" href="all.min.css">');

fs.writeFileSync(__dirname + '/dist/index.html', content, 'utf8');