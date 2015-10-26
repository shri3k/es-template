var tmpl = require('../')();
var fs = require('fs');
var path = require('path');
var test = require('tape');
var debug = require('debug')('es-template');
var testDir = __dirname;
'use strict';
//tests for plain string--
//[x] tests for plain string--
//[x] test for plain string with one string interpolation
//[x] test for plain string with multiple string interpolation
//--
//tests for file argument--
//[x] test when no argument is given defaults to index.html
//[x] test when first argument is passed use it to search for file
//[x] test for file with many string interpolation
//[x] test when argument is given without extension which searches file in current path for defaulted extension
//--
//tests for root directory--
//[ ] test when root directory is provided on simple string
//[ ] test when root directoyr is provided on multiple string
//--
//test for user behavior--
//[ ] test when an instance is created with new rather than just calling the funcgion
//--

test('for plain string text', function(t) {
  var _val = '<p> hello world </p>';
  var expected = '<p> hello world </p>';
  var template = tmpl(_val);
  templateRender(template)
    .then(function(actual) {
      t.equal(actual, expected);
      t.notEqual(actual, new Buffer(1));
      t.end();
    });
});

test('for plain string test with one string interpolation', function(t) {
  var _val = '<p> ${salute} world </p>';
  var expected = '<p> Hello world </p>';
  var template = tmpl(_val, {
    salute: 'Hello'
  });
  templateRender(template)
    .then(function(actual) {
      t.equal(actual, expected, 'should be equal');
      t.notEqual(actual, '<p> Hello world </p> ', 'shouldn\'t be equal');
      t.end();
    });
});

test('test for plain string with multiple string interpolation', function(t) {
  var _val = '<p> ${salute} ${user} </p>';
  var expected = '<p> Hello World </p>';
  var template = tmpl(_val, {
    salute: 'Hello',
    user: 'World'
  });
  templateRender(template)
    .then(function(actual) {
      t.equal(actual, expected, 'should be equal');
      t.notEqual(actual, '<p> ${salute} ${user}', 'shouldn\'t be equal');
      t.end();
    });
});


test('when no argument is given', function(t) {
  var _filepath = path.resolve('index.html');
  debug('Filepath:- ', _filepath);
  var expected = 'hello world';
  setupDummyFile(_filepath, 'hello world')
    .then(function() {
      var template = tmpl();
      return templateRender(template);
    })
    .then(function(actual) {
      t.equal(actual, expected, 'should default to index.html on the current working dir');
      t.notEqual(actual, 'hello world ', 'should not be equal');
      return cleanUpDummyFile(_filepath);
    })
    .then(function() {
      t.end();
    });
});

test('when first argument is passed as a filename', function(t) {
  var _filepath = path.resolve(testDir, 'myFile.html');
  var expected = 'Hello World';
  setupDummyFile(_filepath, 'Hello World')
    .then(function() {
      var template = tmpl(_filepath);
      return templateRender(template);
    })
    .then(function(actual) {
      t.equal(actual, expected, 'should use given filename as a template');
      t.notEqual(actual, 'hello world', 'should not be equal');
      return cleanUpDummyFile(_filepath);
    })
    .then(function() {
      t.end();
    });
});

test('when first argument is passed as a filename with multi-template strings', function(t) {
  var _filepath = path.resolve(testDir, 'myFile.html');
  var expected = 'Hello World \n Welcome to the World';
  setupDummyFile(_filepath, '${salut} ${place} \n ${greet} to the ${place}')
    .then(function() {
      var template = tmpl(_filepath, {
        'salut': 'Hello',
        'place': 'World',
        'greet': 'Welcome'
      });
      return templateRender(template);
    })
    .then(function(actual) {

      t.equal(actual, expected, 'should use given filename as a template and interpret all the variables properly');
      t.notEqual(actual, 'hello world', 'should not be equal');
      return cleanUpDummyFile(_filepath);
    })
    .then(function() {
      t.end();
    });
});

test('when first argument is passed as a filename without extension and second argument is passed with the string to interpolate', function(t) {
  var _filename = 'myFile.html';
  var _filepath = path.resolve(testDir, _filename);
  var expected = 'Hello World \n Welcome to the World';
  setupDummyFile(_filepath, '${salut} ${place} \n ${greet} to the ${place}')
    .then(function() {
      var template = tmpl('./tests/myFile', {
        'salut': 'Hello',
        'place': 'World',
        'greet': 'Welcome'
      });
      return templateRender(template);
    })
    .then(function(actual) {
      t.equal(actual, expected, 'should use given filename and default to .html as per specified in defaults/index.js file');
      t.notEqual(actual, 'hello world', 'should not be equal');
      return cleanUpDummyFile(_filepath);
    })
    .then(function() {
      t.end();
    });
});

test('when all three arguments are passed with extension for filename in the first argument', function(t) {
  var _filename = 'myFile.html';
  var _filepath = path.resolve(testDir, _filename);
  var expected = 'Hello World \n Welcome to the World';
  setupDummyFile(_filepath, '${salut} ${place} \n ${greet} to the ${place}')
    .then(function() {
      var template = tmpl(path.resolve(testDir, 'myFile.html'), {
        'salut': 'Hello',
        'place': 'World',
        'greet': 'Welcome'
      }, {
        'ext': '.jade'
      });
      return templateRender(template);
    }).then(function(actual) {
      t.equal(actual, expected, 'should be equal with first argument overwriting the option given in the third param');
      t.notEqual(actual, 'hello world', 'should not be equal');
      return cleanUpDummyFile(_filepath);
    })
    .then(function() {
      t.end();
    });
});

test('when all three arguments are passed without extension for filename in the first argument', function(t) {
  var _filename = 'myFile.jade';
  var _filepath = path.resolve(testDir, _filename);
  var expected = 'Hello World \n Welcome to the World';
  setupDummyFile(_filepath, '${salut} ${place} \n ${greet} to the ${place}')
    .then(function() {
      var template = tmpl(path.resolve(testDir, 'myFile'), {
        'salut': 'Hello',
        'place': 'World',
        'greet': 'Welcome'
      }, {
        'ext': '.jade'
      });
      return templateRender(template);
    })
    .then(function(actual) {
      t.equal(actual, expected, 'should use given filename with the extension as given in the third argument');
      t.notEqual(actual, 'hello world', 'should not be equal');
      return cleanUpDummyFile(_filepath);
    }).then(function() {
      t.end();
    });
});

function setupDummyFile(filepath, content) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(filepath, content, function(err) {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function cleanUpDummyFile(filepath) {
  new Promise(function(resolve, reject) {
    fs.unlink(filepath, function(err) {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function templateRender(templateStream) {
  return new Promise(function(resolve) {
    templateStream.on('readable', function() {
      var tmp;
      var actual = '';
      while (null !== (tmp = templateStream.read())) {
        actual += tmp;
      }
      resolve(actual);
    });
  });
}
