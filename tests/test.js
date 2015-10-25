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
//tests for options--
//[x] test when third argument is given with options regarding extension which uses that extension to search for file
//--
//test for user behavior--
//[ ] test when an instance is created with new rather than just calling the funcgion
//--

test('for plain string text', function(t) {
  var _val = '<p> hello world </p>';
  var expected = '<p> hello world </p>';
  var actual = '';
  var template = tmpl(_val);
  template.on('readable', function() {
    var tmp;
    while (null !== (tmp = template.read())) {
      actual += tmp;
    }
    t.equal(actual, expected);
    t.notEqual(actual, new Buffer(1));
    t.end();
  });
});

test('for plain string test with one string interpolation', function(t) {
  var _val = '<p> ${salute} world </p>';
  var expected = '<p> Hello world </p>';
  var actual = '';
  var template = tmpl(_val, {
    salute: 'Hello'
  });
  template.on('readable', function() {
    var tmp;
    while (null !== (tmp = template.read())) {
      actual += tmp;
    }
    t.equal(actual, expected, 'should be equal');
    t.notEqual(actual, '<p> Hello world </p> ', 'shouldn\'t be equal');
    t.end();
  });
});

test('test for plain string with multiple string interpolation', function(t) {
  var _val = '<p> ${salute} ${user} </p>';
  var expected = '<p> Hello World </p>';
  var actual = '';
  var template = tmpl(_val, {
    salute: 'Hello',
    user: 'World'
  });
  template.on('readable', function() {
    var tmp;
    while (null !== (tmp = template.read())) {
      actual += tmp;
    }
    t.equal(actual, expected, 'should be equal');
    t.notEqual(actual, '<p> ${salute} ${user}', 'shouldn\'t be equal');
    t.end();
  });
});


test('when no argument is given', function(t) {
  var _filepath = path.resolve('index.html');
  debug('Filepath:- ', _filepath);
  fs.writeFile(_filepath, 'hello world', function(err) {
    if (err) {
      t.error(err, err.toString());
    }
    var expected = 'hello world';
    var actual = '';
    var template = tmpl();
    template.on('readable', function() {
      var tmp;
      while (null !== (tmp = template.read())) {
        actual += tmp;
      }
      t.equal(actual, expected, 'should default to index.html on the current working dir');
      t.notEqual(actual, 'hello world ', 'should not be equal');
      fs.unlink(_filepath, function(err) {
        if (err) {
          t.error(err, err.toString());
        }
      });
      t.end();
    });
  });
});

test('when first argument is passed as a filename', function(t) {
  var _filepath = path.resolve(testDir, 'myFile.html');
  var expected = 'Hello World';
  fs.writeFile(_filepath, 'Hello World', function(err) {
    if (err) {
      t.error(err, err.toString());
    }
    var template = tmpl(_filepath);
    var actual = '';
    template.on('readable', function() {
      var tmp;
      while (null !== (tmp = template.read())) {
        actual += tmp;
      }
      t.equal(actual, expected, 'should use given filename as a template');
      t.notEqual(actual, 'hello world', 'should not be equal');
      fs.unlink(_filepath, function(err) {
        if (err) {
          t.error(err, err.toString());
        }
      });
      t.end();
    });
  });
});

test('when first argument is passed as a filename with multi-template strings', function(t) {
  var _filepath = path.resolve(testDir, 'myFile.html');
  var expected = 'Hello World \n Welcome to the World';
  fs.writeFile(_filepath, '${salut} ${place} \n ${greet} to the ${place}', function(err) {
    if (err) {
      t.error(err, err.toString());
    }
    var template = tmpl(_filepath, {
      'salut': 'Hello',
      'place': 'World',
      'greet': 'Welcome'
    });
    var actual = '';
    template.on('readable', function() {
      var tmp;
      while (null !== (tmp = template.read())) {
        actual += tmp;
      }
      t.equal(actual, expected, 'should use given filename as a template and interpret all the variables properly');
      t.notEqual(actual, 'hello world', 'should not be equal');
    });
    fs.unlink(_filepath, function(err) {
      if (err) {
        t.error(err, err.toString());
      }
    });
    t.end();
  });
});

test('when first argument is passed as a filename without extension and second argument is passed with the string to interpolate', function(t) {
  var _filename = 'myFile.html';
  var _filepath = path.resolve(testDir, _filename);
  var expected = 'Hello World \n Welcome to the World';
  fs.writeFile(_filepath, '${salut} ${place} \n ${greet} to the ${place}', function(err) {
    if (err) {
      t.error(err, err.toString());
    }
    var template = tmpl('./tests/myFile', {
      'salut': 'Hello',
      'place': 'World',
      'greet': 'Welcome'
    });
    var actual = '';
    template.on('readable', function() {
      var tmp;
      while (null !== (tmp = template.read())) {
        actual += tmp;
      }
      t.equal(actual, expected, 'should use given filename and default to .html as per specified in defaults/index.js file');
      t.notEqual(actual, 'hello world', 'should not be equal');
    });
    fs.unlink(_filepath, function(err) {
      if (err) {
        t.error(err, err.toString());
      }
    });
    t.end();
  });
});

test('when all three arguments are passed with extension for filename in the first argument', function(t) {
  var _filename = 'myFile.html';
  var _filepath = path.resolve(testDir, _filename);
  var expected = 'Hello World \n Welcome to the World';
  fs.writeFile(_filepath, '${salut} ${place} \n ${greet} to the ${place}', function(err) {
    if (err) {
      t.error(err, err.toString());
    }
    var template = tmpl(path.resolve(testDir, 'myFile.html'), {
      'salut': 'Hello',
      'place': 'World',
      'greet': 'Welcome'
    }, {
      'ext': '.jade'
    });
    var actual = '';
    template.on('readable', function() {
      var tmp;
      while (null !== (tmp = template.read())) {
        actual += tmp;
      }
      t.equal(actual, expected, 'should be equal with first argument overwriting the option given in the third param');
      t.notEqual(actual, 'hello world', 'should not be equal');
    });
    fs.unlink(_filepath, function(err) {
      if (err) {
        t.error(err, err.toString());
      }
      t.end();
    });
  });
});

test('when all three arguments are passed without extension for filename in the first argument', function(t) {
  var _filename = 'myFile.jade';
  var _filepath = path.resolve(testDir, _filename);
  var expected = 'Hello World \n Welcome to the World';
  fs.writeFile(_filepath, '${salut} ${place} \n ${greet} to the ${place}', function(err) {
    if (err) {
      t.error(err, err.toString());
    }
    var template = tmpl(path.resolve(testDir, 'myFile'), {
      'salut': 'Hello',
      'place': 'World',
      'greet': 'Welcome'
    }, {
      'ext': '.jade'
    });
    var actual = '';
    template.on('readable', function() {
      var tmp;
      while (null !== (tmp = template.read())) {
        actual += tmp;
      }
      t.equal(actual, expected, 'should use given filename with the extension as given in the third argument');
      t.notEqual(actual, 'hello world', 'should not be equal');
    });
    fs.unlink(_filepath, function(err) {
      if (err) {
        t.error(err, err.toString());
      }
      t.end();
    });
  });
});

test('when third argument is given with extension options', function(t) {
  t.end();
});
