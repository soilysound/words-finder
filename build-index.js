var fs = require('fs');
var compressor = require('node-minify');

var html = fs.readFileSync('index-dev.html').toString();

compressor.minify({
  compressor: 'uglifyjs',
  input: 'site.js',
  output: 'site-min.js',
  sync: true,
  callback: function (err, min) {
    html = html.replace('<script type="text/javascript" src="site.js"></script>', '<script>' + min + '</script>')

    compressor.minify({
      compressor: 'clean-css',
      input: 'site.css',
      output: 'site-min.css',
      sync: true,
      callback: function (err, min) {
        html = html.replace('<link rel="stylesheet" href="site.css">', '<style>' + min + '</style>');
        fs.writeFileSync('index.html', html, 'utf8');
      }
    });
  }

});
