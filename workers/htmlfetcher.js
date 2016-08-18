// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var http = require('http');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!

archive.readListOfUrls(function(array) {
  archive.downloadUrls(array);
});

// crontab -e */1 * * * * node /Volumes/students/2016-07-web-historian/workers/htmlfetcher.js
