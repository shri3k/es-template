'use strict';
const Readable = require('stream').Readable;
const debug = require('debug')('rstream');
const util = require('util');

var X = Object.create(Readable.prototype);
X.init = function(src, opts) {
  Readable.call(this, opts);
  this.src = src;
};
X._read = function() {
  this.push(this.src);
  this.push(null);
};

module.exports = (src, opts) => {
  var m = Object.create(X);
  m.init(src);
  return m;
};
