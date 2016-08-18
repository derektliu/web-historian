var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var hh = require('./http-helpers');
var test = require('../workers/htmlfetcher.js');

exports.handleRequest = function (req, res) {
  if (hh.siteAssets[req.url]) {
    if (req.method === 'GET') {
      hh.serveAssets(res, hh.siteAssets[req.url].path, function(err, data) {
        if (err) { throw err; }
        hh.reply(res, 200, hh.siteAssets[req.url].contentType, data);
      });
    }
    if (req.method === 'POST') {
      var body = '';
      req.on('data', function(chunk) {
        body += chunk;
      });
      req.on('end', function() {
        body = body.slice(4);

        archive.isUrlInList(body, function(foundUrl) {
          if (foundUrl) {
            archive.isUrlArchived(body, function(foundArchive) {
              if (foundArchive) {
                // serving...
                hh.serveAssets(res, archive.paths.archivedSites + '/' + body, (err,data) => {
                  if (err){ console.log (err); }
                  hh.reply(res, 302, 'text/html', data);
                });
              } else {
                hh.serveLoadingPage(res);
              }
            });
          } else {
            archive.addUrlToList(body, err => err ? console.log(err) : console.log('ok'));
            hh.serveLoadingPage(res);
          }              
        });
      });
    }
  } else if (req.url === '/www.google.com') {
    var fixturePath = archive.paths.archivedSites + '/' + 'www.google.com';
    if (req.method === 'GET') {
      hh.serveAssets(res, fixturePath, function(err, data) {
        if (err) { throw err; }
        res.writeHeader(200, hh.headers);
        res.end(data);
      });
    }
  } else if (req.url === '/test') {
    archive.downloadUrls(['www.google.com']);
  } else {
    hh.reply(res, 404, 'text/html', '<h1>404 You Suck</h1>');
  }
};
