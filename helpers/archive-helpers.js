var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

exports.grabWebsite = function(url, cb) {
  var options = {
    host: url,
    port: 80,
    path: '/',
    method: 'GET'
  };

  http.get(options, res=> {
    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      cb(body);
    });
  });
};

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

exports.readListOfUrls = cb =>{
  fs.readFile(exports.paths.list, 'utf8', (err, data)=> 
    data ? cb(data.split('\n')) : cb([])
  );
};

exports.isUrlInList = (url, cb)=> exports.readListOfUrls(arr=> cb(arr.some(elem => elem === url ? true : false)));

exports.addUrlToList = (body, cb) => {
  exports.readListOfUrls(arr=> {
    arr.pop();
    arr.push(body + '\n');
    fs.writeFile(exports.paths.list, arr.join('\n'), cb);  
  });
};

exports.isUrlArchived = (file, cb)=> fs.readFile(exports.paths.archivedSites + '/' + file, err => cb(!err));

exports.downloadUrls = function(arr) {
  if (arr[arr.length-1] === '') { arr.pop(); }
  arr.forEach(function(file) {
    exports.isUrlArchived(file, function(exists) {
      if (!exists) {
        exports.grabWebsite(file, function(body) {
          fs.writeFile(exports.paths.archivedSites + '/' + file, body, err => { if (err) { throw err; } });
        });
      } else {
        console.log(' IT EXISTS! - archive-helpers.js - line 75');
      }
    });
  });
};

