var fs = require('fs');
var through2 = require('through2');
var debug = require('debug')('es-template');
var rstream = require('./rstream');
var __ = require('./utils');
var defaultOpts = require('../defaults');
'use strict';

var __require = __.memoize(__.require);

module.exports = {
  init: (rootDir, opts) => {
    this.dir = rootDir || defaultOpts.dir;
    defaultOpts.dir = this.dir;
    this.usrDefOpts = opts || defaultOpts;
  },
  /**
   * @param {String} _file - Name of file or string
   * @param {Object} obj - Object with values to replace in param1
   * @param {Object} options - option for file and stream
   * @return {Object} returns stream
   */
  streamIt: (_file, obj, options) => {
    var xStream, _filename;
    var doesNotExist;
    debug('_file:', _file);
    _file = _file || './index.html';
    options = options || this.usrDefOpts;
    /* first index is false as to keep the 
     * logic in loop simple
     */
    var _src = [false, _file, `${_file}${options.ext}`];
    var attempts = [false, trySource(_src[1], this.dir, options), trySource(_src[2], this.dir, options)];
    var srcIndex = attempts.map((attempt, index) => {
      return attempt ? index : attempt;
    }).filter(val => {
      return val;
    });
    srcIndex = srcIndex[0];
    doesNotExist = (attempts.every(attempt => {
      return !attempt;
    }));
    _filename = doesNotExist ? _file : __require(_src[srcIndex], this.dir, options);
    debug(`Serving ${_filename}`);
    xStream = doesNotExist ? rstream(_filename, options) : fs.createReadStream(_filename, options);
    return tStream(xStream, obj, options);
  }
};

/**
 * Core transform stream
 * @param {Stream} xStream - default readable stream or custom readable stream
 * @param {Object} obj - Key-value for the template
 * @param {Object} opts - optional features
 * @return {Stream} readable stream
 */
function tStream(xStream, obj, opts) {
  // xStream.on('data', function(fuck) {
  //   process.stdout.write(fuck.toString());
  // });
  return xStream.pipe(through2(opts, function(chunk) {
    var regx = /\$\{(.+?)}/gi;
    var data = chunk.toString();
    var _data = data.replace(regx, (match, prop) => {
      return obj[prop];
    });
    this.push(_data);
  }));
}

function trySource(_file, dir, options) {
  var doesExist;
  try {
    __require(_file, dir, options);
    doesExist = true;
  } catch (e) {
    doesExist = false;
  }
  return doesExist;
}
