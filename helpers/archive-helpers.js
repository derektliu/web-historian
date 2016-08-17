var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = cb =>
  fs.readFile(exports.paths.list, 'utf8', (err, data)=> cb(data.split('\n')));

exports.isUrlInList = (url, cb)=> {
  return exports.readListOfUrls(arr=> 
    // var check = false;
    // arr.forEach(elem => { if (elem === url) { check = true; }});
    // return cb(check);
    cb(arr.some(elem => elem === url ? true : false))
  );
};

exports.addUrlToList = function(body, cb) {
  // var writing = fs.open(exports.paths.list, 'w', function(err, fd) {
  //   fs.write(fd, body, function(err, written) {
  //     fs.close(written, function(err) {
  //       if (err) { throw err; }
  //     });
  //   });
  // });
  var newUrl = body.slice(4) + '\n';
  exports.readListOfUrls(function(arr) {
    var str = arr.push(newUrl).join('\n');
    fs.writeFile(exports.paths.list, str, cb);
    
  });
};

exports.isUrlArchived = function() {
};

exports.downloadUrls = function() {
};
