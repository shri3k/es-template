'use strict';
var path = require('path');
var fs = require('fs');
var debug = require('debug')('es-template');
var defaults = require('../defaults');

var __ = module.exports = {};

__.upDir = _path => {
  let pathArray = _path.split(path.sep);
  (pathArray.pop() && pathArray.pop());
  _path = pathArray.join(path.sep);
  return _path;
};
__.require = (_path, rootDir, options) => {
  var normalizePath, orgPath;
  rootDir = rootDir || '';
  options = options || defaults;
  _path = _path || './';
  orgPath = path.resolve(rootDir, _path);
  debug('orgPath', orgPath);
  return (function recurse(_path) {
    normalizePath = _path ? path.resolve(rootDir, _path) : '/';
    debug('normalizePath:', normalizePath);
    try {
      _path = fs.lstatSync(normalizePath).isDirectory() ? path.resolve(normalizePath, `index${options.ext}`) : normalizePath;
    } catch (e) {
      _path = normalizePath;
    }
    if (__.exists(_path)) {
      return _path;
    } else {
      if (_path === `/index${options.ext}`) {
        var er = new Error('File not found!');
        er.code = 'ENOENT';
        throw er;
      } else {
        return recurse(__.upDir(_path));
      }
    }
  }(orgPath));
};

__.exists = filepath => {
  var result = false;
  try {
    fs.accessSync(filepath);
    result = true;
  } catch (e) {
    debug('Can\'t find file..returning false');
  }
  return result;
};

__.memoize = function(fn) {
  var _result;
  var _args = [];
  return function(args) {
    args = [].slice.call(arguments);
    var result = args.every((arg, index) => {
      return arg == _args[index];
    });
    _result = result ? _result : fn.apply(this, arguments);
    return _result;
  };
};
