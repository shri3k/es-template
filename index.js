'use strict';
var app = require('./lib/app');

module.exports = CreateObj;

/**
 * Gives template string just like ES2015
 * @public
 * @param {String} _file- name of the filename or string to be interpolated
 * @param {Object} obj - Object associated with first param
 * @param {Object} opt - options
 * @return {Object} stream of objects
 *
 */
function CreateObj(rootDir, options) {
  var obj = Object.create(app);
  obj.init(rootDir, options);
  return obj.streamIt;
}
