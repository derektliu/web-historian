var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var httpHelpers = require('./http-helpers');


exports.handleRequest = function (req, res) {
  if (req.url === '/') {
    if (req.method === 'GET') {
      httpHelpers.serveAssets(res, './web/public/index.html', function(err, data) {
        if (err) { throw err; }
        res.writeHeader(200, httpHelpers.headers);
        res.end(data);
      });
    }
    if (req.method === 'POST') {
      var body = '';
      req.on('data', function(chunk) {
        body += chunk;
      });
      req.on('end', function() {
        body = body.slice(4);
        archive.addUrlToList(body, function(err, data) {
          if (err) {
            throw err;
          }
          res.writeHeader(302, httpHelpers.headers);
          res.end();
        });
      });
    }
  } else if (req.url === '/www.google.com') {
    var fixturePath = archive.paths.archivedSites + '/' + 'www.google.com';
    if (req.method === 'GET') {
      httpHelpers.serveAssets(res, fixturePath, function(err, data){
        if (err) { throw err; }
        res.writeHeader(200, httpHelpers.headers);
        res.end(data);
      });
    }
  } else {
    res.writeHeader(404, httpHelpers.headers);
    res.end(archive.paths.list);
  }
};
