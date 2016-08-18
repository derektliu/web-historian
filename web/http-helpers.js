var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
};

exports.serveAssets = function(res, path, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  fs.readFile(path, 'utf8', callback);
};

// As you progress, keep thinking about what helper functions you can put here!

exports.siteAssets = {
  '/': {
    path: archive.paths.siteAssets + '/index.html',
    contentType: 'text/html'
  },
  '/index.html': {
    path: archive.paths.siteAssets + '/index.html',
    contentType: 'text/html'
  },
  '/styles.css': {
    path: archive.paths.siteAssets + '/styles.css',
    contentType: 'text/css'
  },
  '/loading.html': {
    path: archive.paths.siteAssets + '/loading.html',
    contentType: 'text/html'
  }
};

exports.reply = function(res, status, contentType, data) {
  exports.headers['Content-Type'] = contentType;
  res.writeHeader(status, exports.headers);
  res.end(data);
};

exports.serveLoadingPage = function(res) {
  exports.serveAssets(res, archive.paths.siteAssets + '/loading.html', function(err, data) {
    if (err) { 
      console.log('ERROR IN SERVING ASSETS'); 
      throw err; 
    }
    exports.reply(res, 302, 'text/html', data);
  });
};


