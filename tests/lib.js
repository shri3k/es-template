var path = require('path');
var fs = require('fs');
var debug = require('debug')('es-template');
var __ = require('../lib/utils');

var test = require('tape');

test('go up one dir', (t) => {
  t.equal(__.upDir('hello/world/index.html'), 'hello');
  t.equal(__.upDir('/test/me/index.html'), '/test');
  t.equal(__.upDir('/test/me/again/.index.html'), '/test/me');
  t.end();
});

test('given path exists', (t) => {
  //setup
  var _path = __dirname;
  try {
    fs.writeFileSync(path.resolve(_path, './file.html'));
    fs.mkdirSync(path.resolve(_path, 'tests'));
    fs.writeFileSync(path.resolve(_path, './tests/index.html'));
    fs.mkdirSync(path.resolve(_path, './tests/tests1'));
    fs.writeFileSync(path.resolve(_path, './tests/tests1/index.html'));
  } catch (e) {
    process.stderr.write(e.toString());
  }

  debug('Root path:- ', _path);
  t.equal(__.require('./file.html', _path), path.resolve(_path, './file.html'), 'given file exists inside /tests/ dir');
  t.equal(__.require('./tests/', _path), path.resolve(_path, './tests/index.html'), 'given path should find index file inside /tests/tests dir');
  t.throws(function() {
    return __.require('./tests/hey.html');
  }, /File not found/, 'no file exists and should throw error');

  //teardown
  fs.unlinkSync(path.resolve(_path, './tests/tests1/index.html'));
  fs.rmdirSync(path.resolve(_path, './tests/tests1'));
  fs.unlinkSync(path.resolve(_path, './tests/index.html'));
  fs.rmdirSync(path.resolve(_path, './tests/'));
  fs.unlinkSync(path.resolve(_path, './file.html'));
  t.end();
});
