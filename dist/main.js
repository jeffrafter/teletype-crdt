define("telepath-crdt", [], function() { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var assert = __webpack_require__(2);

exports.ZERO_POINT = Object.freeze({
  row: 0,
  column: 0
});

exports.compare = function (a, b) {
  return primitiveCompare(a.row, a.column, b.row, b.column);
};

function primitiveCompare(rowA, columnA, rowB, columnB) {
  if (rowA === rowB) {
    return columnA - columnB;
  } else {
    return rowA - rowB;
  }
}

exports.traverse = function (start, distance) {
  if (distance.row === 0) return {
    row: start.row,
    column: start.column + distance.column
  };else {
    return {
      row: start.row + distance.row,
      column: distance.column
    };
  }
};

exports.traversal = function (end, start) {
  if (end.row === start.row) {
    return {
      row: 0,
      column: end.column - start.column
    };
  } else {
    return {
      row: end.row - start.row,
      column: end.column
    };
  }
};

exports.extentForText = function (text) {
  var row = 0;
  var column = 0;
  var index = 0;

  while (index < text.length) {
    var char = text[index];

    if (char === '\n') {
      column = 0;
      row++;
    } else {
      column++;
    }

    index++;
  }

  return {
    row: row,
    column: column
  };
};

exports.characterIndexForPosition = function (text, target) {
  // Previously we instantiated a point object here and mutated its fields, so
  // that we could use the `compare` function we already export. However, this
  // seems to trigger a weird optimization bug on v8 5.6.326.50 which causes
  // this function to return unpredictable results, so we use primitive-valued
  // variables instead.
  var row = 0;
  var column = 0;
  var index = 0;

  while (primitiveCompare(row, column, target.row, target.column) < 0 && index <= text.length) {
    if (text[index] === '\n') {
      row++;
      column = 0;
    } else {
      column++;
    }

    index++;
  }

  assert(primitiveCompare(row, column, target.row, target.column) <= 0, 'Target position should not exceed the extent of the given text');
  return index;
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = __webpack_require__(6);
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

module.exports =
/*#__PURE__*/
function () {
  function SplayTree() {
    _classCallCheck(this, SplayTree);
  }

  _createClass(SplayTree, [{
    key: "splayNode",
    value: function splayNode(node) {
      if (!node) return;

      while (true) {
        if (this.isNodeLeftChild(this.getParent(node)) && this.isNodeRightChild(node)) {
          // zig-zag
          this.rotateNodeLeft(node);
          this.rotateNodeRight(node);
        } else if (this.isNodeRightChild(this.getParent(node)) && this.isNodeLeftChild(node)) {
          // zig-zag
          this.rotateNodeRight(node);
          this.rotateNodeLeft(node);
        } else if (this.isNodeLeftChild(this.getParent(node)) && this.isNodeLeftChild(node)) {
          // zig-zig
          this.rotateNodeRight(this.getParent(node));
          this.rotateNodeRight(node);
        } else if (this.isNodeRightChild(this.getParent(node)) && this.isNodeRightChild(node)) {
          // zig-zig
          this.rotateNodeLeft(this.getParent(node));
          this.rotateNodeLeft(node);
        } else {
          // zig
          if (this.isNodeLeftChild(node)) {
            this.rotateNodeRight(node);
          } else if (this.isNodeRightChild(node)) {
            this.rotateNodeLeft(node);
          }

          return;
        }
      }
    }
  }, {
    key: "rotateNodeLeft",
    value: function rotateNodeLeft(pivot) {
      var root = this.getParent(pivot);

      if (this.getParent(root)) {
        if (root === this.getLeft(this.getParent(root))) {
          this.setLeft(this.getParent(root), pivot);
        } else {
          this.setRight(this.getParent(root), pivot);
        }
      } else {
        this.root = pivot;
      }

      this.setParent(pivot, this.getParent(root));
      this.setRight(root, this.getLeft(pivot));
      if (this.getRight(root)) this.setParent(this.getRight(root), root);
      this.setLeft(pivot, root);
      this.setParent(this.getLeft(pivot), pivot);
      this.updateSubtreeExtent(root);
      this.updateSubtreeExtent(pivot);
    }
  }, {
    key: "rotateNodeRight",
    value: function rotateNodeRight(pivot) {
      var root = this.getParent(pivot);

      if (this.getParent(root)) {
        if (root === this.getLeft(this.getParent(root))) {
          this.setLeft(this.getParent(root), pivot);
        } else {
          this.setRight(this.getParent(root), pivot);
        }
      } else {
        this.root = pivot;
      }

      this.setParent(pivot, this.getParent(root));
      this.setLeft(root, this.getRight(pivot));
      if (this.getLeft(root)) this.setParent(this.getLeft(root), root);
      this.setRight(pivot, root);
      this.setParent(this.getRight(pivot), pivot);
      this.updateSubtreeExtent(root);
      this.updateSubtreeExtent(pivot);
    }
  }, {
    key: "isNodeLeftChild",
    value: function isNodeLeftChild(node) {
      return node != null && this.getParent(node) != null && this.getLeft(this.getParent(node)) === node;
    }
  }, {
    key: "isNodeRightChild",
    value: function isNodeRightChild(node) {
      return node != null && this.getParent(node) != null && this.getRight(this.getParent(node)) === node;
    }
  }, {
    key: "getSuccessor",
    value: function getSuccessor(node) {
      if (this.getRight(node)) {
        node = this.getRight(node);

        while (this.getLeft(node)) {
          node = this.getLeft(node);
        }
      } else {
        while (this.getParent(node) && this.getRight(this.getParent(node)) === node) {
          node = this.getParent(node);
        }

        node = this.getParent(node);
      }

      return node;
    }
  }]);

  return SplayTree;
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var Document = __webpack_require__(5);

var _require = __webpack_require__(12),
    serializeOperation = _require.serializeOperation,
    deserializeOperation = _require.deserializeOperation,
    serializeRemotePosition = _require.serializeRemotePosition,
    deserializeRemotePosition = _require.deserializeRemotePosition;

module.exports = {
  Document: Document,
  serializeOperation: serializeOperation,
  deserializeOperation: deserializeOperation,
  serializeRemotePosition: serializeRemotePosition,
  deserializeRemotePosition: deserializeRemotePosition
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

function _sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return _sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var assert = __webpack_require__(2);

var DocumentTree = __webpack_require__(10);

var SplitTree = __webpack_require__(11);

var _require = __webpack_require__(1),
    ZERO_POINT = _require.ZERO_POINT,
    compare = _require.compare,
    traverse = _require.traverse,
    traversal = _require.traversal,
    characterIndexForPosition = _require.characterIndexForPosition,
    extentForText = _require.extentForText;

module.exports =
/*#__PURE__*/
function () {
  function Document(_ref) {
    var siteId = _ref.siteId,
        text = _ref.text,
        history = _ref.history;

    _classCallCheck(this, Document);

    assert(siteId !== 0, 'siteId 0 is reserved');
    this.siteId = siteId;
    this.nextSequenceNumber = 1;
    this.splitTreesBySpliceId = new Map();
    this.deletionsBySpliceId = new Map();
    this.undoCountsBySpliceId = new Map();
    this.markerLayersBySiteId = new Map([[this.siteId, new Map()]]);
    this.deferredOperationsByDependencyId = new Map();
    this.deferredResolutionsByDependencyId = new Map();
    this.deferredMarkerUpdates = new Map();
    this.deferredMarkerUpdatesByDependencyId = new Map();
    this.maxSeqsBySite = {};
    this.operations = [];
    this.undoStack = [];
    this.redoStack = [];
    this.nextCheckpointId = 1;
    var firstSegment = {
      spliceId: {
        site: 0,
        seq: 0
      },
      offset: ZERO_POINT,
      text: '',
      extent: ZERO_POINT,
      nextSplit: null,
      deletions: new Set()
    };
    this.splitTreesBySpliceId.set(spliceIdToString(firstSegment.spliceId), new SplitTree(firstSegment));
    var lastSegment = {
      spliceId: {
        site: 0,
        seq: 1
      },
      offset: ZERO_POINT,
      text: '',
      extent: ZERO_POINT,
      nextSplit: null,
      deletions: new Set()
    };
    this.splitTreesBySpliceId.set(spliceIdToString(lastSegment.spliceId), new SplitTree(lastSegment));
    this.documentTree = new DocumentTree(firstSegment, lastSegment, this.isSegmentVisible.bind(this));

    if (text) {
      this.setTextInRange(ZERO_POINT, ZERO_POINT, text);
      this.undoStack.length = 0;
    } else if (history) {
      this.populateHistory(history);
    }
  }

  _createClass(Document, [{
    key: "populateHistory",
    value: function populateHistory(_ref2) {
      var baseText = _ref2.baseText,
          nextCheckpointId = _ref2.nextCheckpointId,
          undoStack = _ref2.undoStack,
          redoStack = _ref2.redoStack;
      this.setTextInRange(ZERO_POINT, ZERO_POINT, baseText);
      this.nextCheckpointId = nextCheckpointId;
      var newUndoStack = [];
      var allEntries = undoStack.concat(redoStack.slice().reverse());

      for (var i = 0; i < allEntries.length; i++) {
        var _allEntries$i = allEntries[i],
            type = _allEntries$i.type,
            changes = _allEntries$i.changes,
            markersBefore = _allEntries$i.markersBefore,
            markersAfter = _allEntries$i.markersAfter,
            id = _allEntries$i.id,
            markers = _allEntries$i.markers;

        if (type === 'transaction') {
          var operations = [];
          var markersSnapshotBefore = this.snapshotFromMarkers(markersBefore);

          for (var j = changes.length - 1; j >= 0; j--) {
            var _changes$j = changes[j],
                oldStart = _changes$j.oldStart,
                oldEnd = _changes$j.oldEnd,
                newText = _changes$j.newText;
            operations.push.apply(operations, _toConsumableArray(this.setTextInRange(oldStart, oldEnd, newText)));
          }

          var markersSnapshotAfter = this.snapshotFromMarkers(markersAfter);
          newUndoStack.push(new Transaction(0, operations, markersSnapshotBefore, markersSnapshotAfter));
        } else if (type === 'checkpoint') {
          newUndoStack.push(new Checkpoint(id, false, this.snapshotFromMarkers(markers)));
        } else {
          throw new Error("Unknown entry type '".concat(type, "'"));
        }
      }

      this.undoStack = newUndoStack;

      for (var _i = 0; _i < redoStack.length; _i++) {
        if (redoStack[_i].type === 'transaction') this.undo();
      }
    }
  }, {
    key: "replicate",
    value: function replicate(siteId) {
      var replica = new Document({
        siteId: siteId
      });
      replica.integrateOperations(this.getOperations());
      return replica;
    }
  }, {
    key: "getOperations",
    value: function getOperations() {
      var markerOperations = [];
      this.markerLayersBySiteId.forEach(function (layersById, siteId) {
        var siteMarkerLayers = {};
        layersById.forEach(function (markersById, layerId) {
          var layer = {};
          markersById.forEach(function (marker, markerId) {
            layer[markerId] = marker;
          });
          siteMarkerLayers[layerId] = layer;
        });
        markerOperations.push({
          type: 'markers-update',
          updates: siteMarkerLayers,
          siteId: siteId
        });
      });
      return this.operations.concat(markerOperations);
    }
  }, {
    key: "setTextInRange",
    value: function setTextInRange(start, end, text, options) {
      var spliceId = {
        site: this.siteId,
        seq: this.nextSequenceNumber
      };
      var operation = {
        type: 'splice',
        spliceId: spliceId
      };

      if (compare(end, start) > 0) {
        operation.deletion = this.delete(spliceId, start, end);
      }

      if (text && text.length > 0) {
        operation.insertion = this.insert(spliceId, start, text);
      }

      this.updateMaxSeqsBySite(spliceId);
      this.undoStack.push(new Transaction(this.getNow(), [operation]));
      this.clearRedoStack();
      this.operations.push(operation);
      return [operation];
    }
  }, {
    key: "getMarkers",
    value: function getMarkers() {
      var _this = this;

      var result = {};
      this.markerLayersBySiteId.forEach(function (layersById, siteId) {
        if (layersById.size > 0) {
          result[siteId] = {};
          layersById.forEach(function (markersById, layerId) {
            result[siteId][layerId] = {};
            markersById.forEach(function (marker, markerId) {
              var resultMarker = Object.assign({}, marker);
              resultMarker.range = _this.resolveLogicalRange(marker.range, marker.exclusive);
              result[siteId][layerId][markerId] = resultMarker;
            });
          });
        }
      });
      return result;
    }
  }, {
    key: "updateMarkers",
    value: function updateMarkers(layerUpdatesById) {
      var operation = {
        type: 'markers-update',
        siteId: this.siteId,
        updates: {}
      };
      var layers = this.markerLayersBySiteId.get(this.siteId);

      for (var layerId in layerUpdatesById) {
        var layerUpdate = layerUpdatesById[layerId];
        layerId = parseInt(layerId);
        var layer = layers.get(layerId);

        if (layerUpdate === null) {
          if (layer) {
            layers.delete(layerId);
            operation.updates[layerId] = null;
          }
        } else {
          if (!layer) {
            layer = new Map();
            layers.set(layerId, layer);
          }

          operation.updates[layerId] = {};

          for (var markerId in layerUpdate) {
            var markerUpdate = layerUpdate[markerId];
            markerId = parseInt(markerId);
            var marker = layer.get(markerId);

            if (markerUpdate) {
              if (marker) {
                marker = Object.assign({}, marker);
              } else {
                marker = {
                  exclusive: false,
                  reversed: false,
                  tailed: true
                };
              }

              var updatingExclusive = marker.exclusive !== markerUpdate.exclusive;
              Object.assign(marker, markerUpdate);

              if (markerUpdate.range || updatingExclusive) {
                marker.range = this.getLogicalRange(markerUpdate.range || marker.range, marker.exclusive);
              }

              Object.freeze(marker);
              layer.set(markerId, marker);
              operation.updates[layerId][markerId] = marker;
            } else {
              layer.delete(markerId);
              operation.updates[layerId][markerId] = null;
            }
          }
        }
      }

      return [operation];
    }
  }, {
    key: "undo",
    value: function undo() {
      var spliceIndex = null;
      var operationsToUndo = [];
      var markersSnapshot;

      for (var i = this.undoStack.length - 1; i >= 0; i--) {
        var stackEntry = this.undoStack[i];

        if (stackEntry instanceof Transaction) {
          operationsToUndo = stackEntry.operations;
          markersSnapshot = stackEntry.markersSnapshotBefore;
          spliceIndex = i;
          break;
        } else if (stackEntry instanceof Checkpoint && stackEntry.isBarrier) {
          return null;
        }
      }

      if (spliceIndex != null) {
        var _redoStack;

        (_redoStack = this.redoStack).push.apply(_redoStack, _toConsumableArray(this.undoStack.splice(spliceIndex).reverse()));

        var _undoOrRedoOperations = this.undoOrRedoOperations(operationsToUndo),
            operations = _undoOrRedoOperations.operations,
            textUpdates = _undoOrRedoOperations.textUpdates;

        var markers = this.markersFromSnapshot(markersSnapshot);
        return {
          operations: operations,
          textUpdates: textUpdates,
          markers: markers
        };
      } else {
        return null;
      }
    }
  }, {
    key: "redo",
    value: function redo() {
      var spliceIndex = null;
      var operationsToRedo = [];
      var markersSnapshot;

      for (var i = this.redoStack.length - 1; i >= 0; i--) {
        var stackEntry = this.redoStack[i];

        if (stackEntry instanceof Transaction) {
          operationsToRedo = stackEntry.operations;
          markersSnapshot = stackEntry.markersSnapshotAfter;
          spliceIndex = i;
          break;
        }
      }

      while (this.redoStack[spliceIndex - 1] instanceof Checkpoint) {
        spliceIndex--;
      }

      if (spliceIndex != null) {
        var _undoStack;

        (_undoStack = this.undoStack).push.apply(_undoStack, _toConsumableArray(this.redoStack.splice(spliceIndex).reverse()));

        var _undoOrRedoOperations2 = this.undoOrRedoOperations(operationsToRedo),
            operations = _undoOrRedoOperations2.operations,
            textUpdates = _undoOrRedoOperations2.textUpdates;

        var markers = markersSnapshot ? this.markersFromSnapshot(markersSnapshot) : null;
        return {
          operations: operations,
          textUpdates: textUpdates,
          markers: markers
        };
      } else {
        return null;
      }
    }
  }, {
    key: "clearUndoStack",
    value: function clearUndoStack() {
      this.undoStack.length = 0;
    }
  }, {
    key: "clearRedoStack",
    value: function clearRedoStack() {
      this.redoStack.length = 0;
    }
  }, {
    key: "applyGroupingInterval",
    value: function applyGroupingInterval(groupingInterval) {
      var topEntry = this.undoStack[this.undoStack.length - 1];
      var previousEntry = this.undoStack[this.undoStack.length - 2];

      if (topEntry instanceof Transaction) {
        topEntry.groupingInterval = groupingInterval;
      } else {
        return;
      }

      if (previousEntry instanceof Transaction) {
        var timeBetweenEntries = topEntry.timestamp - previousEntry.timestamp;
        var minGroupingInterval = Math.min(groupingInterval, previousEntry.groupingInterval || Infinity);

        if (timeBetweenEntries < minGroupingInterval) {
          var _previousEntry$operat;

          this.undoStack.pop();
          previousEntry.timestamp = topEntry.timestamp;
          previousEntry.groupingInterval = groupingInterval;

          (_previousEntry$operat = previousEntry.operations).push.apply(_previousEntry$operat, _toConsumableArray(topEntry.operations));

          previousEntry.markersSnapshotAfter = topEntry.markersSnapshotAfter;
        }
      }
    }
  }, {
    key: "getNow",
    value: function getNow() {
      return Date.now();
    }
  }, {
    key: "createCheckpoint",
    value: function createCheckpoint(options) {
      var checkpoint = new Checkpoint(this.nextCheckpointId++, options && options.isBarrier, options && this.snapshotFromMarkers(options.markers));
      this.undoStack.push(checkpoint);
      return checkpoint.id;
    }
  }, {
    key: "isBarrierPresentBeforeCheckpoint",
    value: function isBarrierPresentBeforeCheckpoint(checkpointId) {
      for (var i = this.undoStack.length - 1; i >= 0; i--) {
        var stackEntry = this.undoStack[i];

        if (stackEntry instanceof Checkpoint) {
          if (stackEntry.id == checkpointId) return false;
          if (stackEntry.isBarrier) return true;
        }
      }

      return false;
    }
  }, {
    key: "groupChangesSinceCheckpoint",
    value: function groupChangesSinceCheckpoint(checkpointId, options) {
      if (this.isBarrierPresentBeforeCheckpoint(checkpointId)) return false;
      var result = this.collectOperationsSinceCheckpoint(checkpointId, true, options && options.deleteCheckpoint);

      if (result) {
        var operations = result.operations,
            markersSnapshot = result.markersSnapshot;

        if (operations.length > 0) {
          this.undoStack.push(new Transaction(this.getNow(), operations, markersSnapshot, options && this.snapshotFromMarkers(options.markers)));
          return this.textUpdatesForOperations(operations);
        } else {
          return [];
        }
      } else {
        return false;
      }
    }
  }, {
    key: "revertToCheckpoint",
    value: function revertToCheckpoint(checkpointId, options) {
      if (this.isBarrierPresentBeforeCheckpoint(checkpointId)) return false;
      var collectResult = this.collectOperationsSinceCheckpoint(checkpointId, true, options && options.deleteCheckpoint);

      if (collectResult) {
        var _undoOrRedoOperations3 = this.undoOrRedoOperations(collectResult.operations),
            operations = _undoOrRedoOperations3.operations,
            textUpdates = _undoOrRedoOperations3.textUpdates;

        var markers = this.markersFromSnapshot(collectResult.markersSnapshot);
        return {
          operations: operations,
          textUpdates: textUpdates,
          markers: markers
        };
      } else {
        return false;
      }
    }
  }, {
    key: "getChangesSinceCheckpoint",
    value: function getChangesSinceCheckpoint(checkpointId) {
      var result = this.collectOperationsSinceCheckpoint(checkpointId, false, false);

      if (result) {
        return this.textUpdatesForOperations(result.operations);
      } else {
        return false;
      }
    }
  }, {
    key: "collectOperationsSinceCheckpoint",
    value: function collectOperationsSinceCheckpoint(checkpointId, deleteOperations, deleteCheckpoint) {
      var checkpointIndex = -1;
      var operations = [];

      for (var i = this.undoStack.length - 1; i >= 0; i--) {
        var stackEntry = this.undoStack[i];

        if (stackEntry instanceof Checkpoint) {
          if (stackEntry.id === checkpointId) {
            checkpointIndex = i;
            break;
          }
        } else if (stackEntry instanceof Transaction) {
          operations.push.apply(operations, _toConsumableArray(stackEntry.operations));
        } else {
          throw new Error('Unknown stack entry ' + stackEntry.constructor.name);
        }
      }

      if (checkpointIndex === -1) {
        return null;
      } else {
        var markersSnapshot = this.undoStack[checkpointIndex].markersSnapshot;

        if (deleteOperations) {
          if (!deleteCheckpoint) checkpointIndex++;
          this.undoStack.splice(checkpointIndex);
        }

        return {
          operations: operations,
          markersSnapshot: markersSnapshot
        };
      }
    }
  }, {
    key: "groupLastChanges",
    value: function groupLastChanges() {
      var lastTransaction;

      for (var i = this.undoStack.length - 1; i >= 0; i--) {
        var stackEntry = this.undoStack[i];

        if (stackEntry instanceof Checkpoint) {
          if (stackEntry.isBarrier) return false;
        } else {
          if (lastTransaction) {
            this.undoStack.splice(i);
            this.undoStack.push(new Transaction(this.getNow(), stackEntry.operations.concat(lastTransaction.operations), stackEntry.markersSnapshotBefore, lastTransaction.markersSnapshotAfter));
            return true;
          } else {
            lastTransaction = stackEntry;
          }
        }
      }

      return false;
    }
  }, {
    key: "getHistory",
    value: function getHistory(maxEntries) {
      var originalUndoCounts = new Map(this.undoCountsBySpliceId);
      var redoStack = [];

      for (var i = this.redoStack.length - 1; i >= 0; i--) {
        var entry = this.redoStack[i];

        if (entry instanceof Transaction) {
          var markersBefore = this.markersFromSnapshot(entry.markersSnapshotBefore);
          var changes = this.undoOrRedoOperations(entry.operations).textUpdates;
          var markersAfter = this.markersFromSnapshot(entry.markersSnapshotAfter);
          redoStack.push({
            type: 'transaction',
            changes: changes,
            markersBefore: markersBefore,
            markersAfter: markersAfter
          });
        } else {
          redoStack.push({
            type: 'checkpoint',
            id: entry.id,
            markers: this.markersFromSnapshot(entry.markersSnapshot)
          });
        }

        if (redoStack.length === maxEntries) break;
      }

      redoStack.reverse(); // Undo operations we redid above while computing changes

      for (var _i2 = this.redoStack.length - 1; _i2 >= this.redoStack.length - redoStack.length; _i2--) {
        var _entry = this.redoStack[_i2];

        if (_entry instanceof Transaction) {
          this.undoOrRedoOperations(_entry.operations);
        }
      }

      var undoStack = [];

      for (var _i3 = this.undoStack.length - 1; _i3 >= 0; _i3--) {
        var _entry2 = this.undoStack[_i3];

        if (_entry2 instanceof Transaction) {
          var _markersAfter = this.markersFromSnapshot(_entry2.markersSnapshotAfter);

          var _changes = invertTextUpdates(this.undoOrRedoOperations(_entry2.operations).textUpdates);

          var _markersBefore = this.markersFromSnapshot(_entry2.markersSnapshotBefore);

          undoStack.push({
            type: 'transaction',
            changes: _changes,
            markersBefore: _markersBefore,
            markersAfter: _markersAfter
          });
        } else {
          undoStack.push({
            type: 'checkpoint',
            id: _entry2.id,
            markers: this.markersFromSnapshot(_entry2.markersSnapshot)
          });
        }

        if (undoStack.length === maxEntries) break;
      }

      undoStack.reverse(); // Redo operations we undid above while computing changes

      for (var _i4 = this.undoStack.length - 1; _i4 >= this.undoStack.length - undoStack.length; _i4--) {
        var _entry3 = this.undoStack[_i4];

        if (_entry3 instanceof Transaction) {
          this.undoOrRedoOperations(_entry3.operations);
        }
      }

      this.undoCountsBySpliceId = originalUndoCounts;
      return {
        nextCheckpointId: this.nextCheckpointId,
        undoStack: undoStack,
        redoStack: redoStack
      };
    }
  }, {
    key: "delete",
    value: function _delete(spliceId, start, end) {
      var spliceIdString = spliceIdToString(spliceId);
      var left = this.findLocalSegmentBoundary(start)[1];
      var right = this.findLocalSegmentBoundary(end)[0];
      var maxSeqsBySite = {};
      var segment = left;

      while (true) {
        var maxSeq = maxSeqsBySite[segment.spliceId.site];

        if (maxSeq == null || segment.spliceId.seq > maxSeq) {
          maxSeqsBySite[segment.spliceId.site] = segment.spliceId.seq;
        }

        segment.deletions.add(spliceIdString);
        this.documentTree.splayNode(segment);
        this.documentTree.updateSubtreeExtent(segment);
        if (segment === right) break;
        segment = this.documentTree.getSuccessor(segment);
      }

      var deletion = {
        spliceId: spliceId,
        leftDependencyId: left.spliceId,
        offsetInLeftDependency: left.offset,
        rightDependencyId: right.spliceId,
        offsetInRightDependency: traverse(right.offset, right.extent),
        maxSeqsBySite: maxSeqsBySite
      };
      this.deletionsBySpliceId.set(spliceIdString, deletion);
      return deletion;
    }
  }, {
    key: "insert",
    value: function insert(spliceId, position, text) {
      var _findLocalSegmentBoun = this.findLocalSegmentBoundary(position),
          _findLocalSegmentBoun2 = _slicedToArray(_findLocalSegmentBoun, 2),
          left = _findLocalSegmentBoun2[0],
          right = _findLocalSegmentBoun2[1];

      var newSegment = {
        spliceId: spliceId,
        text: text,
        extent: extentForText(text),
        offset: ZERO_POINT,
        leftDependency: left,
        rightDependency: right,
        nextSplit: null,
        deletions: new Set()
      };
      this.documentTree.insertBetween(left, right, newSegment);
      this.splitTreesBySpliceId.set(spliceIdToString(spliceId), new SplitTree(newSegment));
      return {
        text: text,
        leftDependencyId: left.spliceId,
        offsetInLeftDependency: traverse(left.offset, left.extent),
        rightDependencyId: right.spliceId,
        offsetInRightDependency: right.offset
      };
    }
  }, {
    key: "undoOrRedoOperations",
    value: function undoOrRedoOperations(operationsToUndo) {
      var undoOperations = [];
      var oldUndoCounts = new Map();

      for (var i = 0; i < operationsToUndo.length; i++) {
        var spliceId = operationsToUndo[i].spliceId;
        var newUndoCount = (this.undoCountsBySpliceId.get(spliceIdToString(spliceId)) || 0) + 1;
        this.updateUndoCount(spliceId, newUndoCount, oldUndoCounts);
        var operation = {
          type: 'undo',
          spliceId: spliceId,
          undoCount: newUndoCount
        };
        undoOperations.push(operation);
        this.operations.push(operation);
      }

      return {
        operations: undoOperations,
        textUpdates: this.textUpdatesForOperations(undoOperations, oldUndoCounts)
      };
    }
  }, {
    key: "isSpliceUndone",
    value: function isSpliceUndone(_ref3) {
      var spliceId = _ref3.spliceId;
      var undoCount = this.undoCountsBySpliceId.get(spliceIdToString(spliceId));
      return undoCount != null && undoCount & 1 === 1;
    }
  }, {
    key: "canIntegrateOperation",
    value: function canIntegrateOperation(op) {
      switch (op.type) {
        case 'splice':
          {
            var spliceId = op.spliceId,
                deletion = op.deletion,
                insertion = op.insertion;

            if ((this.maxSeqsBySite[spliceId.site] || 0) !== spliceId.seq - 1) {
              return false;
            }

            if (deletion) {
              var hasLeftAndRightDependencies = this.splitTreesBySpliceId.has(spliceIdToString(deletion.leftDependencyId)) && this.splitTreesBySpliceId.has(spliceIdToString(deletion.rightDependencyId));
              if (!hasLeftAndRightDependencies) return false;

              for (var site in deletion.maxSeqsBySite) {
                if (deletion.maxSeqsBySite[site] > (this.maxSeqsBySite[site] || 0)) {
                  return false;
                }
              }
            }

            if (insertion) {
              var _hasLeftAndRightDependencies = this.splitTreesBySpliceId.has(spliceIdToString(insertion.leftDependencyId)) && this.splitTreesBySpliceId.has(spliceIdToString(insertion.rightDependencyId));

              if (!_hasLeftAndRightDependencies) return false;
            }

            return true;
          }

        case 'undo':
          {
            var spliceIdString = spliceIdToString(op.spliceId);
            return this.splitTreesBySpliceId.has(spliceIdString) || this.deletionsBySpliceId.has(spliceIdString);
          }

        case 'markers-update':
          return true;

        default:
          throw new Error('Unknown operation type');
      }
    }
  }, {
    key: "integrateOperations",
    value: function integrateOperations(operations) {
      var integratedOperations = [];
      var oldUndoCounts;
      var i = 0;

      while (i < operations.length) {
        var operation = operations[i++];
        if (operation.type !== 'markers-update') this.operations.push(operation);

        if (this.canIntegrateOperation(operation)) {
          integratedOperations.push(operation);

          switch (operation.type) {
            case 'splice':
              if (operation.deletion) this.integrateDeletion(operation.spliceId, operation.deletion);
              if (operation.insertion) this.integrateInsertion(operation.spliceId, operation.insertion);
              this.updateMaxSeqsBySite(operation.spliceId);
              break;

            case 'undo':
              if (!oldUndoCounts) oldUndoCounts = new Map();
              this.integrateUndo(operation, oldUndoCounts);
              break;
          }

          this.collectDeferredOperations(operation, operations);
        } else {
          this.deferOperation(operation);
        }
      }

      var textUpdates = this.textUpdatesForOperations(integratedOperations, oldUndoCounts);
      var markerUpdates = this.updateMarkersForOperations(integratedOperations);
      return {
        textUpdates: textUpdates,
        markerUpdates: markerUpdates
      };
    }
  }, {
    key: "collectDeferredOperations",
    value: function collectDeferredOperations(_ref4, operations) {
      var _this2 = this;

      var spliceId = _ref4.spliceId;

      if (spliceId) {
        var spliceIdString = spliceIdToString(spliceId);
        var dependentOps = this.deferredOperationsByDependencyId.get(spliceIdString);

        if (dependentOps) {
          dependentOps.forEach(function (dependentOp) {
            if (_this2.canIntegrateOperation(dependentOp)) {
              operations.push(dependentOp);
            }
          });
          this.deferredOperationsByDependencyId.delete(spliceIdString);
        }
      }
    }
  }, {
    key: "deferOperation",
    value: function deferOperation(op) {
      if (op.type === 'splice') {
        var spliceId = op.spliceId,
            deletion = op.deletion,
            insertion = op.insertion;
        this.addOperationDependency(this.deferredOperationsByDependencyId, {
          site: spliceId.site,
          seq: spliceId.seq - 1
        }, op);

        if (deletion) {
          this.addOperationDependency(this.deferredOperationsByDependencyId, deletion.leftDependencyId, op);
          this.addOperationDependency(this.deferredOperationsByDependencyId, deletion.rightDependencyId, op);

          for (var site in deletion.maxSeqsBySite) {
            var seq = deletion.maxSeqsBySite[site];
            this.addOperationDependency(this.deferredOperationsByDependencyId, {
              site: site,
              seq: seq
            }, op);
          }
        }

        if (insertion) {
          this.addOperationDependency(this.deferredOperationsByDependencyId, insertion.leftDependencyId, op);
          this.addOperationDependency(this.deferredOperationsByDependencyId, insertion.rightDependencyId, op);
        }
      } else if (op.type === 'undo') {
        this.addOperationDependency(this.deferredOperationsByDependencyId, op.spliceId, op);
      } else {
        throw new Error('Unknown operation type: ' + op.type);
      }
    }
  }, {
    key: "addOperationDependency",
    value: function addOperationDependency(map, dependencyId, op) {
      var dependencyIdString = spliceIdToString(dependencyId);

      if (!this.hasAppliedSplice(dependencyId)) {
        var deferredOps = map.get(dependencyIdString);

        if (!deferredOps) {
          deferredOps = new Set();
          map.set(dependencyIdString, deferredOps);
        }

        deferredOps.add(op);
      }
    }
  }, {
    key: "hasAppliedSplice",
    value: function hasAppliedSplice(spliceId) {
      var spliceIdString = spliceIdToString(spliceId);
      return this.splitTreesBySpliceId.has(spliceIdString) || this.deletionsBySpliceId.has(spliceIdString);
    }
  }, {
    key: "integrateInsertion",
    value: function integrateInsertion(spliceId, operation) {
      var text = operation.text,
          leftDependencyId = operation.leftDependencyId,
          offsetInLeftDependency = operation.offsetInLeftDependency,
          rightDependencyId = operation.rightDependencyId,
          offsetInRightDependency = operation.offsetInRightDependency;
      var originalRightDependency = this.findSegmentStart(rightDependencyId, offsetInRightDependency);
      var originalLeftDependency = this.findSegmentEnd(leftDependencyId, offsetInLeftDependency);
      this.documentTree.splayNode(originalLeftDependency);
      this.documentTree.splayNode(originalRightDependency);
      var currentSegment = this.documentTree.getSuccessor(originalLeftDependency);
      var leftDependency = originalLeftDependency;
      var rightDependency = originalRightDependency;

      while (currentSegment !== rightDependency) {
        var leftDependencyIndex = this.documentTree.getSegmentIndex(leftDependency);
        var rightDependencyIndex = this.documentTree.getSegmentIndex(rightDependency);
        var currentSegmentLeftDependencyIndex = this.documentTree.getSegmentIndex(currentSegment.leftDependency);
        var currentSegmentRightDependencyIndex = this.documentTree.getSegmentIndex(currentSegment.rightDependency);

        if (currentSegmentLeftDependencyIndex <= leftDependencyIndex && currentSegmentRightDependencyIndex >= rightDependencyIndex) {
          if (spliceId.site < currentSegment.spliceId.site) {
            rightDependency = currentSegment;
          } else {
            leftDependency = currentSegment;
          }

          currentSegment = this.documentTree.getSuccessor(leftDependency);
        } else {
          currentSegment = this.documentTree.getSuccessor(currentSegment);
        }
      }

      var newSegment = {
        spliceId: spliceId,
        offset: ZERO_POINT,
        text: text,
        extent: extentForText(text),
        leftDependency: originalLeftDependency,
        rightDependency: originalRightDependency,
        nextSplit: null,
        deletions: new Set()
      };
      this.documentTree.insertBetween(leftDependency, rightDependency, newSegment);
      this.splitTreesBySpliceId.set(spliceIdToString(spliceId), new SplitTree(newSegment));
    }
  }, {
    key: "integrateDeletion",
    value: function integrateDeletion(spliceId, deletion) {
      var leftDependencyId = deletion.leftDependencyId,
          offsetInLeftDependency = deletion.offsetInLeftDependency,
          rightDependencyId = deletion.rightDependencyId,
          offsetInRightDependency = deletion.offsetInRightDependency,
          maxSeqsBySite = deletion.maxSeqsBySite;
      var spliceIdString = spliceIdToString(spliceId);
      this.deletionsBySpliceId.set(spliceIdString, deletion);
      var left = this.findSegmentStart(leftDependencyId, offsetInLeftDependency);
      var right = this.findSegmentEnd(rightDependencyId, offsetInRightDependency);
      var segment = left;

      while (true) {
        var maxSeq = maxSeqsBySite[segment.spliceId.site] || 0;

        if (segment.spliceId.seq <= maxSeq) {
          this.documentTree.splayNode(segment);
          segment.deletions.add(spliceIdString);
          this.documentTree.updateSubtreeExtent(segment);
        }

        if (segment === right) break;
        segment = this.documentTree.getSuccessor(segment);
      }
    }
  }, {
    key: "integrateUndo",
    value: function integrateUndo(_ref5, oldUndoCounts) {
      var spliceId = _ref5.spliceId,
          undoCount = _ref5.undoCount;
      return this.updateUndoCount(spliceId, undoCount, oldUndoCounts);
    }
  }, {
    key: "getMarkerLayersForSiteId",
    value: function getMarkerLayersForSiteId(siteId) {
      var layers = this.markerLayersBySiteId.get(siteId);

      if (!layers) {
        layers = new Map();
        this.markerLayersBySiteId.set(siteId, layers);
      }

      return layers;
    }
  }, {
    key: "deferMarkerUpdate",
    value: function deferMarkerUpdate(siteId, layerId, markerId, markerUpdate) {
      var range = markerUpdate.range;
      var deferredMarkerUpdate = {
        siteId: siteId,
        layerId: layerId,
        markerId: markerId
      };
      this.addOperationDependency(this.deferredMarkerUpdatesByDependencyId, range.startDependencyId, deferredMarkerUpdate);
      this.addOperationDependency(this.deferredMarkerUpdatesByDependencyId, range.endDependencyId, deferredMarkerUpdate);
      var deferredUpdatesByLayerId = this.deferredMarkerUpdates.get(siteId);

      if (!deferredUpdatesByLayerId) {
        deferredUpdatesByLayerId = new Map();
        this.deferredMarkerUpdates.set(siteId, deferredUpdatesByLayerId);
      }

      var deferredUpdatesByMarkerId = deferredUpdatesByLayerId.get(layerId);

      if (!deferredUpdatesByMarkerId) {
        deferredUpdatesByMarkerId = new Map();
        deferredUpdatesByLayerId.set(layerId, deferredUpdatesByMarkerId);
      }

      deferredUpdatesByMarkerId.set(markerId, markerUpdate);
    }
  }, {
    key: "updateMarkersForOperations",
    value: function updateMarkersForOperations(operations) {
      var markerUpdates = {};

      for (var i = 0; i < operations.length; i++) {
        var operation = operations[i];

        if (operation.type === 'markers-update') {
          this.integrateMarkerUpdates(markerUpdates, operation);
        } else if (operation.type === 'splice') {
          this.integrateDeferredMarkerUpdates(markerUpdates, operation);
        }
      }

      return markerUpdates;
    }
  }, {
    key: "integrateMarkerUpdates",
    value: function integrateMarkerUpdates(markerUpdates, _ref6) {
      var siteId = _ref6.siteId,
          updates = _ref6.updates;
      var layers = this.getMarkerLayersForSiteId(siteId);
      if (!markerUpdates[siteId]) markerUpdates[siteId] = {};

      for (var layerId in updates) {
        var updatesByMarkerId = updates[layerId];
        layerId = parseInt(layerId);
        var layer = layers.get(layerId);

        if (updatesByMarkerId) {
          if (!layer) {
            layer = new Map();
            layers.set(layerId, layer);
          }

          if (!markerUpdates[siteId][layerId]) markerUpdates[siteId][layerId] = {};

          for (var markerId in updatesByMarkerId) {
            var markerUpdate = updatesByMarkerId[markerId];
            markerId = parseInt(markerId);

            if (markerUpdate) {
              if (markerUpdate.range && !this.canResolveLogicalRange(markerUpdate.range)) {
                this.deferMarkerUpdate(siteId, layerId, markerId, markerUpdate);
              } else {
                this.integrateMarkerUpdate(markerUpdates, siteId, layerId, markerId, markerUpdate);
              }
            } else {
              if (layer.has(markerId)) {
                layer.delete(markerId);
                markerUpdates[siteId][layerId][markerId] = null;
              }

              var deferredUpdatesByLayerId = this.deferredMarkerUpdates.get(siteId);

              if (deferredUpdatesByLayerId) {
                var deferredUpdatesByMarkerId = deferredUpdatesByLayerId.get(layerId);

                if (deferredUpdatesByMarkerId) {
                  deferredUpdatesByMarkerId.delete(markerId);
                }
              }
            }
          }
        } else {
          if (layer) {
            markerUpdates[siteId][layerId] = null;
            layers.delete(layerId);
          }

          var _deferredUpdatesByLayerId = this.deferredMarkerUpdates.get(siteId);

          if (_deferredUpdatesByLayerId) {
            _deferredUpdatesByLayerId.delete(layerId);
          }
        }
      }
    }
  }, {
    key: "integrateDeferredMarkerUpdates",
    value: function integrateDeferredMarkerUpdates(markerUpdates, _ref7) {
      var _this3 = this;

      var spliceId = _ref7.spliceId;
      var spliceIdString = spliceIdToString(spliceId);
      var dependentMarkerUpdates = this.deferredMarkerUpdatesByDependencyId.get(spliceIdString);

      if (dependentMarkerUpdates) {
        dependentMarkerUpdates.forEach(function (_ref8) {
          var siteId = _ref8.siteId,
              layerId = _ref8.layerId,
              markerId = _ref8.markerId;

          var deferredUpdatesByLayerId = _this3.deferredMarkerUpdates.get(siteId);

          if (deferredUpdatesByLayerId) {
            var deferredUpdatesByMarkerId = deferredUpdatesByLayerId.get(layerId);

            if (deferredUpdatesByMarkerId) {
              var deferredUpdate = deferredUpdatesByMarkerId.get(markerId);

              if (deferredUpdate && _this3.canResolveLogicalRange(deferredUpdate.range)) {
                _this3.integrateMarkerUpdate(markerUpdates, siteId, layerId, markerId, deferredUpdate);
              }
            }
          }
        });
        this.deferredMarkerUpdatesByDependencyId.delete(spliceIdString);
      }
    }
  }, {
    key: "integrateMarkerUpdate",
    value: function integrateMarkerUpdate(markerUpdates, siteId, layerId, markerId, update) {
      var layer = this.markerLayersBySiteId.get(siteId).get(layerId);

      if (!layer) {
        layer = new Map();
        this.markerLayersBySiteId.get(siteId).set(layerId, layer);
      }

      var marker = layer.get(markerId);
      marker = marker ? Object.assign({}, marker) : {};
      Object.assign(marker, update);
      Object.freeze(marker);
      layer.set(markerId, marker);
      if (!markerUpdates[siteId]) markerUpdates[siteId] = {};
      if (!markerUpdates[siteId][layerId]) markerUpdates[siteId][layerId] = {};
      markerUpdates[siteId][layerId][markerId] = Object.assign({}, marker);
      markerUpdates[siteId][layerId][markerId].range = this.resolveLogicalRange(marker.range, marker.exclusive);
      var deferredUpdatesByLayerId = this.deferredMarkerUpdates.get(siteId);

      if (deferredUpdatesByLayerId) {
        var deferredUpdatesByMarkerId = deferredUpdatesByLayerId.get(layerId);

        if (deferredUpdatesByMarkerId) {
          if (deferredUpdatesByMarkerId.has(markerId)) {
            deferredUpdatesByMarkerId.delete(markerId);

            if (deferredUpdatesByMarkerId.size === 0) {
              deferredUpdatesByLayerId.delete(layerId);

              if (deferredUpdatesByLayerId.size === 0) {
                this.deferredMarkerUpdates.delete(siteId);
              }
            }
          }
        }
      }
    }
  }, {
    key: "snapshotFromMarkers",
    value: function snapshotFromMarkers(layersById) {
      if (!layersById) return layersById;
      var snapshot = {};

      for (var layerId in layersById) {
        var layerSnapshot = {};
        var markersById = layersById[layerId];

        for (var markerId in markersById) {
          var markerSnapshot = Object.assign({}, markersById[markerId]);
          markerSnapshot.range = this.getLogicalRange(markerSnapshot.range, markerSnapshot.exclusive);
          layerSnapshot[markerId] = markerSnapshot;
        }

        snapshot[layerId] = layerSnapshot;
      }

      return snapshot;
    }
  }, {
    key: "markersFromSnapshot",
    value: function markersFromSnapshot(snapshot) {
      if (!snapshot) return snapshot;
      var layersById = {};

      for (var layerId in snapshot) {
        var markersById = {};
        var layerSnapshot = snapshot[layerId];

        for (var markerId in layerSnapshot) {
          var marker = Object.assign({}, layerSnapshot[markerId]);
          marker.range = this.resolveLogicalRange(marker.range);
          markersById[markerId] = marker;
        }

        layersById[layerId] = markersById;
      }

      return layersById;
    }
  }, {
    key: "updateUndoCount",
    value: function updateUndoCount(spliceId, newUndoCount, oldUndoCounts) {
      var _this4 = this;

      var spliceIdString = spliceIdToString(spliceId);
      var previousUndoCount = this.undoCountsBySpliceId.get(spliceIdString) || 0;
      if (newUndoCount <= previousUndoCount) return;
      oldUndoCounts.set(spliceIdString, previousUndoCount);
      this.undoCountsBySpliceId.set(spliceIdString, newUndoCount);
      var segmentsToUpdate = new Set();
      this.collectSegments(spliceIdString, segmentsToUpdate);
      segmentsToUpdate.forEach(function (segment) {
        var wasVisible = _this4.isSegmentVisible(segment, oldUndoCounts);

        var isVisible = _this4.isSegmentVisible(segment);

        if (isVisible !== wasVisible) {
          _this4.documentTree.splayNode(segment, oldUndoCounts);

          _this4.documentTree.updateSubtreeExtent(segment);
        }
      });
    }
  }, {
    key: "textUpdatesForOperations",
    value: function textUpdatesForOperations(operations, oldUndoCounts) {
      var newSpliceIds = new Set();
      var segmentStartPositions = new Map();
      var segmentIndices = new Map();

      for (var i = 0; i < operations.length; i++) {
        var operation = operations[i];
        var type = operation.type,
            spliceId = operation.spliceId,
            deletion = operation.deletion,
            insertion = operation.insertion;

        if (spliceId) {
          var spliceIdString = spliceIdToString(spliceId);
          if (type === 'splice') newSpliceIds.add(spliceIdString);
          this.collectSegments(spliceIdString, null, segmentIndices, segmentStartPositions);
        }
      }

      return this.computeChangesForSegments(segmentIndices, segmentStartPositions, oldUndoCounts, newSpliceIds);
    }
  }, {
    key: "canResolveLogicalRange",
    value: function canResolveLogicalRange(_ref9) {
      var startDependencyId = _ref9.startDependencyId,
          endDependencyId = _ref9.endDependencyId;
      return this.hasAppliedSplice(startDependencyId) && this.hasAppliedSplice(endDependencyId);
    }
  }, {
    key: "getLogicalRange",
    value: function getLogicalRange(_ref10, exclusive) {
      var start = _ref10.start,
          end = _ref10.end;

      var _findSegment = this.findSegment(start, exclusive),
          startDependency = _findSegment.segment,
          offsetInStartDependency = _findSegment.offset;

      var _findSegment2 = this.findSegment(end, !exclusive || compare(start, end) === 0),
          endDependency = _findSegment2.segment,
          offsetInEndDependency = _findSegment2.offset;

      return {
        startDependencyId: startDependency.spliceId,
        offsetInStartDependency: offsetInStartDependency,
        endDependencyId: endDependency.spliceId,
        offsetInEndDependency: offsetInEndDependency
      };
    }
  }, {
    key: "resolveLogicalRange",
    value: function resolveLogicalRange(logicalRange, exclusive) {
      var startDependencyId = logicalRange.startDependencyId,
          offsetInStartDependency = logicalRange.offsetInStartDependency,
          endDependencyId = logicalRange.endDependencyId,
          offsetInEndDependency = logicalRange.offsetInEndDependency;
      return {
        start: this.resolveLogicalPosition(startDependencyId, offsetInStartDependency, exclusive),
        end: this.resolveLogicalPosition(endDependencyId, offsetInEndDependency, !exclusive || isEmptyLogicalRange(logicalRange))
      };
    }
  }, {
    key: "resolveLogicalPosition",
    value: function resolveLogicalPosition(spliceId, offset, preferStart) {
      var splitTree = this.splitTreesBySpliceId.get(spliceIdToString(spliceId));
      var segment = splitTree.findSegmentContainingOffset(offset);
      var nextSegmentOffset = traverse(segment.offset, segment.extent);

      if (preferStart && compare(offset, nextSegmentOffset) === 0) {
        segment = splitTree.getSuccessor(segment) || segment;
      }

      var segmentStart = this.documentTree.getSegmentPosition(segment);

      if (this.isSegmentVisible(segment)) {
        return traverse(segmentStart, traversal(offset, segment.offset));
      } else {
        return segmentStart;
      }
    }
  }, {
    key: "findLocalSegmentBoundary",
    value: function findLocalSegmentBoundary(position) {
      var _documentTree$findSeg = this.documentTree.findSegmentContainingPosition(position),
          segment = _documentTree$findSeg.segment,
          start = _documentTree$findSeg.start,
          end = _documentTree$findSeg.end;

      if (compare(position, end) < 0) {
        var splitTree = this.splitTreesBySpliceId.get(spliceIdToString(segment.spliceId));
        return this.splitSegment(splitTree, segment, traversal(position, start));
      } else {
        return [segment, this.documentTree.getSuccessor(segment)];
      }
    }
  }, {
    key: "splitSegment",
    value: function splitSegment(splitTree, segment, offset) {
      var suffix = splitTree.splitSegment(segment, offset);
      this.documentTree.splitSegment(segment, suffix);
      return [segment, suffix];
    }
  }, {
    key: "findSegment",
    value: function findSegment(position, preferStart) {
      var _documentTree$findSeg2 = this.documentTree.findSegmentContainingPosition(position),
          segment = _documentTree$findSeg2.segment,
          start = _documentTree$findSeg2.start,
          end = _documentTree$findSeg2.end;

      var offset = traverse(segment.offset, traversal(position, start));

      if (preferStart && compare(position, end) === 0) {
        segment = this.documentTree.getSuccessor(segment);
        offset = segment.offset;
      }

      return {
        segment: segment,
        offset: offset
      };
    }
  }, {
    key: "findSegmentStart",
    value: function findSegmentStart(spliceId, offset) {
      var splitTree = this.splitTreesBySpliceId.get(spliceIdToString(spliceId));
      var segment = splitTree.findSegmentContainingOffset(offset);
      var segmentEndOffset = traverse(segment.offset, segment.extent);

      if (compare(segment.offset, offset) === 0) {
        return segment;
      } else if (compare(segmentEndOffset, offset) === 0) {
        return segment.nextSplit;
      } else {
        var _splitSegment = this.splitSegment(splitTree, segment, traversal(offset, segment.offset)),
            _splitSegment2 = _slicedToArray(_splitSegment, 2),
            prefix = _splitSegment2[0],
            suffix = _splitSegment2[1];

        return suffix;
      }
    }
  }, {
    key: "findSegmentEnd",
    value: function findSegmentEnd(spliceId, offset) {
      var splitTree = this.splitTreesBySpliceId.get(spliceIdToString(spliceId));
      var segment = splitTree.findSegmentContainingOffset(offset);
      var segmentEndOffset = traverse(segment.offset, segment.extent);

      if (compare(segmentEndOffset, offset) === 0) {
        return segment;
      } else {
        var _splitSegment3 = this.splitSegment(splitTree, segment, traversal(offset, segment.offset)),
            _splitSegment4 = _slicedToArray(_splitSegment3, 2),
            prefix = _splitSegment4[0],
            suffix = _splitSegment4[1];

        return prefix;
      }
    }
  }, {
    key: "getText",
    value: function getText() {
      var text = '';
      var segments = this.documentTree.getSegments();

      for (var i = 0; i < segments.length; i++) {
        var segment = segments[i];
        if (this.isSegmentVisible(segment)) text += segment.text;
      }

      return text;
    }
  }, {
    key: "collectSegments",
    value: function collectSegments(spliceIdString, segments, segmentIndices, segmentStartPositions) {
      var insertionSplitTree = this.splitTreesBySpliceId.get(spliceIdString);

      if (insertionSplitTree) {
        var segment = insertionSplitTree.getStart();

        while (segment) {
          if (segments) {
            segments.add(segment);
          } else {
            segmentStartPositions.set(segment, this.documentTree.getSegmentPosition(segment));
            segmentIndices.set(segment, this.documentTree.getSegmentIndex(segment));
          }

          segment = insertionSplitTree.getSuccessor(segment);
        }
      }

      var deletion = this.deletionsBySpliceId.get(spliceIdString);

      if (deletion) {
        var leftDependencyId = deletion.leftDependencyId,
            offsetInLeftDependency = deletion.offsetInLeftDependency,
            rightDependencyId = deletion.rightDependencyId,
            offsetInRightDependency = deletion.offsetInRightDependency,
            maxSeqsBySite = deletion.maxSeqsBySite;
        var left = this.findSegmentStart(leftDependencyId, offsetInLeftDependency);
        var right = this.findSegmentEnd(rightDependencyId, offsetInRightDependency);
        var _segment = left;

        while (true) {
          var maxSeq = maxSeqsBySite[_segment.spliceId.site] || 0;

          if (_segment.spliceId.seq <= maxSeq) {
            if (segments) {
              segments.add(_segment);
            } else {
              segmentStartPositions.set(_segment, this.documentTree.getSegmentPosition(_segment));
              segmentIndices.set(_segment, this.documentTree.getSegmentIndex(_segment));
            }
          }

          if (_segment === right) break;
          _segment = this.documentTree.getSuccessor(_segment);
        }
      }
    }
  }, {
    key: "computeChangesForSegments",
    value: function computeChangesForSegments(segmentIndices, segmentStartPositions, oldUndoCounts, newOperations) {
      var orderedSegments = Array.from(segmentIndices.keys()).sort(function (s1, s2) {
        return segmentIndices.get(s1) - segmentIndices.get(s2);
      });
      var changes = [];
      var lastChange;

      for (var i = 0; i < orderedSegments.length; i++) {
        var segment = orderedSegments[i];
        var visibleBefore = this.isSegmentVisible(segment, oldUndoCounts, newOperations);
        var visibleAfter = this.isSegmentVisible(segment);

        if (visibleBefore !== visibleAfter) {
          var segmentNewStart = segmentStartPositions.get(segment);
          var segmentOldStart = lastChange ? traverse(lastChange.oldEnd, traversal(segmentNewStart, lastChange.newEnd)) : segmentNewStart;

          if (visibleBefore) {
            if (changes.length > 0 && compare(lastChange.newEnd, segmentNewStart) === 0) {
              lastChange.oldEnd = traverse(lastChange.oldEnd, segment.extent);
              lastChange.oldText += segment.text;
            } else {
              lastChange = {
                oldStart: segmentOldStart,
                oldEnd: traverse(segmentOldStart, segment.extent),
                oldText: segment.text,
                newStart: segmentNewStart,
                newEnd: segmentNewStart,
                newText: ''
              };
              changes.push(lastChange);
            }
          } else {
            if (lastChange && compare(lastChange.newEnd, segmentNewStart) === 0) {
              lastChange.newEnd = traverse(lastChange.newEnd, segment.extent);
              lastChange.newText += segment.text;
            } else {
              lastChange = {
                oldStart: segmentOldStart,
                oldEnd: segmentOldStart,
                oldText: '',
                newStart: segmentNewStart,
                newEnd: traverse(segmentNewStart, segment.extent),
                newText: segment.text
              };
              changes.push(lastChange);
            }
          }
        }
      }

      return changes;
    }
  }, {
    key: "isSegmentVisible",
    value: function isSegmentVisible(segment, undoCountOverrides, operationsToIgnore) {
      var spliceIdString = spliceIdToString(segment.spliceId);

      if (operationsToIgnore && operationsToIgnore.has(spliceIdString)) {
        return false;
      }

      var undoCount;

      if (undoCountOverrides) {
        undoCount = undoCountOverrides.get(spliceIdString);
      }

      if (undoCount == null) {
        undoCount = this.undoCountsBySpliceId.get(spliceIdString) || 0;
      }

      return (undoCount & 1) === 0 && !this.isSegmentDeleted(segment, undoCountOverrides, operationsToIgnore);
    }
  }, {
    key: "isSegmentDeleted",
    value: function isSegmentDeleted(segment, undoCountOverrides, operationsToIgnore) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = segment.deletions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _deletionSpliceIdString = _step.value;

          if (operationsToIgnore && operationsToIgnore.has(_deletionSpliceIdString)) {
            continue;
          }

          var deletionUndoCount = void 0;

          if (undoCountOverrides) {
            deletionUndoCount = undoCountOverrides.get(_deletionSpliceIdString);
          }

          if (deletionUndoCount == null) {
            deletionUndoCount = this.undoCountsBySpliceId.get(_deletionSpliceIdString) || 0;
          }

          if ((deletionUndoCount & 1) === 0) return true;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return false;
    }
  }, {
    key: "updateMaxSeqsBySite",
    value: function updateMaxSeqsBySite(_ref11) {
      var site = _ref11.site,
          seq = _ref11.seq;
      var previousSeq = this.maxSeqsBySite[site] || 0;
      assert.equal(previousSeq, seq - 1, 'Operations from a given site must be applied in order.');
      this.maxSeqsBySite[site] = seq;
      if (this.siteId === site) this.nextSequenceNumber = seq + 1;
    }
  }]);

  return Document;
}();

function spliceIdToString(_ref12) {
  var site = _ref12.site,
      seq = _ref12.seq;
  return site + '.' + seq;
}

function isEmptyLogicalRange(_ref13) {
  var startDependencyId = _ref13.startDependencyId,
      offsetInStartDependency = _ref13.offsetInStartDependency,
      endDependencyId = _ref13.endDependencyId,
      offsetInEndDependency = _ref13.offsetInEndDependency;
  return spliceIdsEqual(startDependencyId, endDependencyId) && compare(offsetInStartDependency, offsetInEndDependency) === 0;
}

function markersEqual(a, b) {
  return logicalRangesEqual(a.range, b.range) && a.exclusive === b.exclusive && a.reversed === b.reversed && a.tailed === b.tailed;
}

function logicalRangesEqual(a, b) {
  return spliceIdsEqual(a.startDependencyId, b.startDependencyId) && compare(a.offsetInStartDependency, b.offsetInStartDependency) === 0 && spliceIdsEqual(a.endDependencyId, b.endDependencyId) && compare(a.offsetInEndDependency, b.offsetInEndDependency) === 0;
}

function spliceIdsEqual(a, b) {
  return a.site === b.site && a.seq === b.seq;
}

function invertTextUpdates(textUpdates) {
  var invertedTextUpdates = [];

  for (var i = 0; i < textUpdates.length; i++) {
    var _textUpdates$i = textUpdates[i],
        oldStart = _textUpdates$i.oldStart,
        oldEnd = _textUpdates$i.oldEnd,
        oldText = _textUpdates$i.oldText,
        newStart = _textUpdates$i.newStart,
        newEnd = _textUpdates$i.newEnd,
        newText = _textUpdates$i.newText;
    invertedTextUpdates.push({
      oldStart: newStart,
      oldEnd: newEnd,
      oldText: newText,
      newStart: oldStart,
      newEnd: oldEnd,
      newText: oldText
    });
  }

  return invertedTextUpdates;
}

var Checkpoint = function Checkpoint(id, isBarrier, markersSnapshot) {
  _classCallCheck(this, Checkpoint);

  this.id = id;
  this.isBarrier = isBarrier;
  this.markersSnapshot = markersSnapshot;
};

var Transaction = function Transaction(timestamp, operations, markersSnapshotBefore, markersSnapshotAfter) {
  _classCallCheck(this, Transaction);

  this.timestamp = timestamp;
  this.operations = operations;
  this.markersSnapshotBefore = markersSnapshotBefore;
  this.markersSnapshotAfter = markersSnapshotAfter;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(8);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(9);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(7)))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),
/* 9 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SplayTree = __webpack_require__(3);

var _require = __webpack_require__(1),
    ZERO_POINT = _require.ZERO_POINT,
    compare = _require.compare,
    traverse = _require.traverse;

module.exports =
/*#__PURE__*/
function (_SplayTree) {
  _inherits(DocumentTree, _SplayTree);

  function DocumentTree(firstSegment, lastSegment, isSegmentVisible) {
    var _this;

    _classCallCheck(this, DocumentTree);

    _this = _possibleConstructorReturn(this, (DocumentTree.__proto__ || Object.getPrototypeOf(DocumentTree)).call(this));
    _this.firstSegment = firstSegment;
    _this.firstSegment.documentRight = lastSegment;
    _this.firstSegment.documentRight.documentParent = _this.firstSegment;
    _this.firstSegment.documentLeft = null;
    _this.firstSegment.documentSubtreeExtent = ZERO_POINT;
    lastSegment.documentSubtreeExtent = ZERO_POINT;
    _this.root = _this.firstSegment;
    _this.isSegmentVisible = isSegmentVisible;
    return _this;
  }

  _createClass(DocumentTree, [{
    key: "getSegmentIndex",
    value: function getSegmentIndex(segment) {
      var index = segment.documentLeft ? segment.documentLeft.documentSubtreeSize : 0;

      while (segment.documentParent) {
        if (segment.documentParent.documentRight === segment) {
          index++;

          if (segment.documentParent.documentLeft) {
            index += segment.documentParent.documentLeft.documentSubtreeSize;
          }
        }

        segment = segment.documentParent;
      }

      return index;
    }
  }, {
    key: "getParent",
    value: function getParent(node) {
      return node.documentParent;
    }
  }, {
    key: "setParent",
    value: function setParent(node, value) {
      node.documentParent = value;
    }
  }, {
    key: "getLeft",
    value: function getLeft(node) {
      return node.documentLeft;
    }
  }, {
    key: "setLeft",
    value: function setLeft(node, value) {
      node.documentLeft = value;
    }
  }, {
    key: "getRight",
    value: function getRight(node) {
      return node.documentRight;
    }
  }, {
    key: "setRight",
    value: function setRight(node, value) {
      node.documentRight = value;
    }
  }, {
    key: "findSegmentContainingPosition",
    value: function findSegmentContainingPosition(position) {
      var segment = this.root;
      var leftAncestorEnd = ZERO_POINT;

      while (segment) {
        var start = leftAncestorEnd;
        if (segment.documentLeft) start = traverse(start, segment.documentLeft.documentSubtreeExtent);
        var end = start;
        if (this.isSegmentVisible(segment)) end = traverse(end, segment.extent);

        if (compare(position, start) <= 0 && segment !== this.firstSegment) {
          segment = segment.documentLeft;
        } else if (compare(position, end) > 0) {
          leftAncestorEnd = end;
          segment = segment.documentRight;
        } else {
          return {
            segment: segment,
            start: start,
            end: end
          };
        }
      }

      throw new Error('No segment found');
    }
  }, {
    key: "insertBetween",
    value: function insertBetween(prev, next, newSegment) {
      this.splayNode(prev);
      this.splayNode(next);
      this.root = newSegment;
      newSegment.documentLeft = prev;
      prev.documentParent = newSegment;
      newSegment.documentRight = next;
      next.documentParent = newSegment;
      next.documentLeft = null;
      this.updateSubtreeExtent(next);
      this.updateSubtreeExtent(newSegment);
    }
  }, {
    key: "splitSegment",
    value: function splitSegment(prefix, suffix) {
      this.splayNode(prefix);
      this.root = suffix;
      suffix.documentParent = null;
      suffix.documentLeft = prefix;
      prefix.documentParent = suffix;
      suffix.documentRight = prefix.documentRight;
      if (suffix.documentRight) suffix.documentRight.documentParent = suffix;
      prefix.documentRight = null;
      this.updateSubtreeExtent(prefix);
      this.updateSubtreeExtent(suffix);
    }
  }, {
    key: "updateSubtreeExtent",
    value: function updateSubtreeExtent(node, undoCountOverrides) {
      node.documentSubtreeExtent = ZERO_POINT;
      node.documentSubtreeSize = 1;

      if (node.documentLeft) {
        node.documentSubtreeExtent = traverse(node.documentSubtreeExtent, node.documentLeft.documentSubtreeExtent);
        node.documentSubtreeSize += node.documentLeft.documentSubtreeSize;
      }

      if (this.isSegmentVisible(node, undoCountOverrides)) {
        node.documentSubtreeExtent = traverse(node.documentSubtreeExtent, node.extent);
      }

      if (node.documentRight) {
        node.documentSubtreeExtent = traverse(node.documentSubtreeExtent, node.documentRight.documentSubtreeExtent);
        node.documentSubtreeSize += node.documentRight.documentSubtreeSize;
      }
    }
  }, {
    key: "getSegmentPosition",
    value: function getSegmentPosition(segment) {
      this.splayNode(segment);

      if (segment.documentLeft) {
        return segment.documentLeft.documentSubtreeExtent;
      } else {
        return ZERO_POINT;
      }
    }
  }, {
    key: "getSegments",
    value: function getSegments() {
      var treeSegments = [];

      function visitTreeInOrder(node) {
        if (node.documentLeft) visitTreeInOrder(node.documentLeft);
        treeSegments.push(node);
        if (node.documentRight) visitTreeInOrder(node.documentRight);
      }

      visitTreeInOrder(this.root);
      return treeSegments;
    }
  }]);

  return DocumentTree;
}(SplayTree);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SplayTree = __webpack_require__(3);

var _require = __webpack_require__(1),
    ZERO_POINT = _require.ZERO_POINT,
    compare = _require.compare,
    traverse = _require.traverse,
    traversal = _require.traversal,
    characterIndexForPosition = _require.characterIndexForPosition,
    extentForText = _require.extentForText;

module.exports =
/*#__PURE__*/
function (_SplayTree) {
  _inherits(SplitTree, _SplayTree);

  function SplitTree(segment) {
    var _this;

    _classCallCheck(this, SplitTree);

    _this = _possibleConstructorReturn(this, (SplitTree.__proto__ || Object.getPrototypeOf(SplitTree)).call(this));
    _this.startSegment = segment;
    _this.startSegment.splitLeft = null;
    _this.startSegment.splitRight = null;
    _this.startSegment.splitParent = null;
    _this.startSegment.splitSubtreeExtent = _this.startSegment.extent;
    _this.root = _this.startSegment;
    return _this;
  }

  _createClass(SplitTree, [{
    key: "getStart",
    value: function getStart() {
      return this.startSegment;
    }
  }, {
    key: "getParent",
    value: function getParent(node) {
      return node.splitParent;
    }
  }, {
    key: "setParent",
    value: function setParent(node, value) {
      node.splitParent = value;
    }
  }, {
    key: "getLeft",
    value: function getLeft(node) {
      return node.splitLeft;
    }
  }, {
    key: "setLeft",
    value: function setLeft(node, value) {
      node.splitLeft = value;
    }
  }, {
    key: "getRight",
    value: function getRight(node) {
      return node.splitRight;
    }
  }, {
    key: "setRight",
    value: function setRight(node, value) {
      node.splitRight = value;
    }
  }, {
    key: "updateSubtreeExtent",
    value: function updateSubtreeExtent(node) {
      node.splitSubtreeExtent = ZERO_POINT;
      if (node.splitLeft) node.splitSubtreeExtent = traverse(node.splitSubtreeExtent, node.splitLeft.splitSubtreeExtent);
      node.splitSubtreeExtent = traverse(node.splitSubtreeExtent, node.extent);
      if (node.splitRight) node.splitSubtreeExtent = traverse(node.splitSubtreeExtent, node.splitRight.splitSubtreeExtent);
    }
  }, {
    key: "findSegmentContainingOffset",
    value: function findSegmentContainingOffset(offset) {
      var segment = this.root;
      var leftAncestorEnd = ZERO_POINT;

      while (segment) {
        var start = leftAncestorEnd;
        if (segment.splitLeft) start = traverse(start, segment.splitLeft.splitSubtreeExtent);
        var end = traverse(start, segment.extent);

        if (compare(offset, start) <= 0 && segment.splitLeft) {
          segment = segment.splitLeft;
        } else if (compare(offset, end) > 0) {
          leftAncestorEnd = end;
          segment = segment.splitRight;
        } else {
          this.splayNode(segment);
          return segment;
        }
      }

      throw new Error('No segment found');
    }
  }, {
    key: "splitSegment",
    value: function splitSegment(segment, offset) {
      var splitIndex = characterIndexForPosition(segment.text, offset);
      this.splayNode(segment);
      var suffix = Object.assign({}, segment);
      suffix.text = segment.text.slice(splitIndex);
      suffix.extent = traversal(segment.extent, offset);
      suffix.spliceId = Object.assign({}, segment.spliceId);
      suffix.offset = traverse(suffix.offset, offset);
      suffix.deletions = new Set(suffix.deletions);
      segment.text = segment.text.slice(0, splitIndex);
      segment.extent = offset;
      segment.nextSplit = suffix;
      this.root = suffix;
      suffix.splitParent = null;
      suffix.splitLeft = segment;
      segment.splitParent = suffix;
      suffix.splitRight = segment.splitRight;
      if (suffix.splitRight) suffix.splitRight.splitParent = suffix;
      segment.splitRight = null;
      this.updateSubtreeExtent(segment);
      this.updateSubtreeExtent(suffix);
      return suffix;
    }
  }, {
    key: "getSuccessor",
    value: function getSuccessor(segment) {
      return segment.nextSplit;
    }
  }, {
    key: "getSegments",
    value: function getSegments() {
      var segments = [];
      var segment = this.getStart();

      while (segment) {
        segments.push(segment);
        segment = segment.nextSplit;
      }

      return segments;
    }
  }]);

  return SplitTree;
}(SplayTree);

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(13),
    Operation = _require.Operation;

function serializeOperation(op) {
  var operationMessage = new Operation();

  switch (op.type) {
    case 'splice':
      operationMessage.setSplice(serializeSplice(op));
      break;

    case 'undo':
      operationMessage.setUndo(serializeUndo(op));
      break;

    case 'markers-update':
      operationMessage.setMarkersUpdate(serializeMarkersUpdate(op));
      break;

    default:
      throw new Error('Unknown operation type: ' + op.type);
  }

  return operationMessage;
}

function serializeOperationBinary(op) {
  return serializeOperation(op).serializeBinary();
}

function serializeSplice(splice) {
  var spliceMessage = new Operation.Splice();
  spliceMessage.setSpliceId(serializeSpliceId(splice.spliceId));

  if (splice.insertion) {
    spliceMessage.setInsertion(serializeInsertion(splice.insertion));
  }

  if (splice.deletion) {
    spliceMessage.setDeletion(serializeDeletion(splice.deletion));
  }

  return spliceMessage;
}

function serializeInsertion(insertion) {
  var insertionMessage = new Operation.Splice.Insertion();
  insertionMessage.setText(insertion.text);
  insertionMessage.setLeftDependencyId(serializeSpliceId(insertion.leftDependencyId));
  insertionMessage.setOffsetInLeftDependency(serializePoint(insertion.offsetInLeftDependency));
  insertionMessage.setRightDependencyId(serializeSpliceId(insertion.rightDependencyId));
  insertionMessage.setOffsetInRightDependency(serializePoint(insertion.offsetInRightDependency));
  return insertionMessage;
}

function serializeDeletion(deletion) {
  var deletionMessage = new Operation.Splice.Deletion();
  deletionMessage.setLeftDependencyId(serializeSpliceId(deletion.leftDependencyId));
  deletionMessage.setOffsetInLeftDependency(serializePoint(deletion.offsetInLeftDependency));
  deletionMessage.setRightDependencyId(serializeSpliceId(deletion.rightDependencyId));
  deletionMessage.setOffsetInRightDependency(serializePoint(deletion.offsetInRightDependency));
  var maxSeqsBySiteMessage = deletionMessage.getMaxSeqsBySiteMap();

  for (var site in deletion.maxSeqsBySite) {
    maxSeqsBySiteMessage.set(site, deletion.maxSeqsBySite[site]);
  }

  return deletionMessage;
}

function serializeUndo(undo) {
  var undoMessage = new Operation.Undo();
  undoMessage.setSpliceId(serializeSpliceId(undo.spliceId));
  undoMessage.setUndoCount(undo.undoCount);
  return undoMessage;
}

function serializeMarkersUpdate(_ref) {
  var siteId = _ref.siteId,
      updates = _ref.updates;
  var markersUpdateMessage = new Operation.MarkersUpdate();
  markersUpdateMessage.setSiteId(siteId);
  var layerOperationsMessage = markersUpdateMessage.getLayerOperationsMap();

  for (var layerId in updates) {
    var markerUpdates = updates[layerId];
    var layerOperationMessage = new Operation.MarkersUpdate.LayerOperation();

    if (markerUpdates) {
      layerOperationMessage.setIsDeletion(false);
      var markerOperationsMessage = layerOperationMessage.getMarkerOperationsMap();

      for (var markerId in markerUpdates) {
        var markerUpdate = markerUpdates[markerId];
        var markerOperationMessage = new Operation.MarkersUpdate.MarkerOperation();

        if (markerUpdate) {
          markerOperationMessage.setIsDeletion(false);
          var range = markerUpdate.range,
              exclusive = markerUpdate.exclusive,
              reversed = markerUpdate.reversed,
              tailed = markerUpdate.tailed;
          var markerUpdateMessage = new Operation.MarkersUpdate.MarkerUpdate();
          var logicalRangeMessage = new Operation.MarkersUpdate.LogicalRange();
          logicalRangeMessage.setStartDependencyId(serializeSpliceId(range.startDependencyId));
          logicalRangeMessage.setOffsetInStartDependency(serializePoint(range.offsetInStartDependency));
          logicalRangeMessage.setEndDependencyId(serializeSpliceId(range.endDependencyId));
          logicalRangeMessage.setOffsetInEndDependency(serializePoint(range.offsetInEndDependency));
          markerUpdateMessage.setRange(logicalRangeMessage);
          markerUpdateMessage.setExclusive(exclusive);
          markerUpdateMessage.setReversed(reversed);
          markerUpdateMessage.setTailed(tailed);
          markerOperationMessage.setMarkerUpdate(markerUpdateMessage);
        } else {
          markerOperationMessage.setIsDeletion(true);
        }

        markerOperationsMessage.set(markerId, markerOperationMessage);
      }
    } else {
      layerOperationMessage.setIsDeletion(true);
    }

    layerOperationsMessage.set(layerId, layerOperationMessage);
  }

  return markersUpdateMessage;
}

function serializeSpliceId(_ref2) {
  var site = _ref2.site,
      seq = _ref2.seq;
  var spliceIdMessage = new Operation.SpliceId();
  spliceIdMessage.setSite(site);
  spliceIdMessage.setSeq(seq);
  return spliceIdMessage;
}

function serializePoint(_ref3) {
  var row = _ref3.row,
      column = _ref3.column;
  var pointMessage = new Operation.Point();
  pointMessage.setRow(row);
  pointMessage.setColumn(column);
  return pointMessage;
}

function deserializeOperation(operationMessage) {
  if (operationMessage.hasSplice()) {
    return deserializeSplice(operationMessage.getSplice());
  } else if (operationMessage.hasUndo()) {
    return deserializeUndo(operationMessage.getUndo());
  } else if (operationMessage.hasMarkersUpdate()) {
    return deserializeMarkersUpdate(operationMessage.getMarkersUpdate());
  } else {
    throw new Error('Unknown operation type');
  }
}

function deserializeOperationBinary(data) {
  return deserializeOperation(Operation.deserializeBinary(data));
}

function deserializeSplice(spliceMessage) {
  var insertionMessage = spliceMessage.getInsertion();
  var deletionMessage = spliceMessage.getDeletion();
  return {
    type: 'splice',
    spliceId: deserializeSpliceId(spliceMessage.getSpliceId()),
    insertion: insertionMessage ? deserializeInsertion(insertionMessage) : null,
    deletion: deletionMessage ? deserializeDeletion(deletionMessage) : null
  };
}

function deserializeInsertion(insertionMessage) {
  return {
    text: insertionMessage.getText(),
    leftDependencyId: deserializeSpliceId(insertionMessage.getLeftDependencyId()),
    offsetInLeftDependency: deserializePoint(insertionMessage.getOffsetInLeftDependency()),
    rightDependencyId: deserializeSpliceId(insertionMessage.getRightDependencyId()),
    offsetInRightDependency: deserializePoint(insertionMessage.getOffsetInRightDependency())
  };
}

function deserializeDeletion(deletionMessage) {
  var maxSeqsBySite = {};
  deletionMessage.getMaxSeqsBySiteMap().forEach(function (seq, site) {
    maxSeqsBySite[site] = seq;
  });
  return {
    leftDependencyId: deserializeSpliceId(deletionMessage.getLeftDependencyId()),
    offsetInLeftDependency: deserializePoint(deletionMessage.getOffsetInLeftDependency()),
    rightDependencyId: deserializeSpliceId(deletionMessage.getRightDependencyId()),
    offsetInRightDependency: deserializePoint(deletionMessage.getOffsetInRightDependency()),
    maxSeqsBySite: maxSeqsBySite
  };
}

function deserializeUndo(undoMessage) {
  return {
    type: 'undo',
    spliceId: deserializeSpliceId(undoMessage.getSpliceId()),
    undoCount: undoMessage.getUndoCount()
  };
}

function deserializeMarkersUpdate(markersUpdateMessage) {
  var updates = {};
  markersUpdateMessage.getLayerOperationsMap().forEach(function (layerOperation, layerId) {
    if (layerOperation.getIsDeletion()) {
      updates[layerId] = null;
    } else {
      var markerUpdates = {};
      layerOperation.getMarkerOperationsMap().forEach(function (markerOperation, markerId) {
        if (markerOperation.getIsDeletion()) {
          markerUpdates[markerId] = null;
        } else {
          var markerUpdateMessage = markerOperation.getMarkerUpdate();
          var rangeMessage = markerUpdateMessage.getRange();
          var range = {
            startDependencyId: deserializeSpliceId(rangeMessage.getStartDependencyId()),
            offsetInStartDependency: deserializePoint(rangeMessage.getOffsetInStartDependency()),
            endDependencyId: deserializeSpliceId(rangeMessage.getEndDependencyId()),
            offsetInEndDependency: deserializePoint(rangeMessage.getOffsetInEndDependency())
          };
          markerUpdates[markerId] = {
            range: range,
            exclusive: markerUpdateMessage.getExclusive(),
            reversed: markerUpdateMessage.getReversed(),
            tailed: markerUpdateMessage.getTailed()
          };
        }
      });
      updates[layerId] = markerUpdates;
    }
  });
  return {
    type: 'markers-update',
    siteId: markersUpdateMessage.getSiteId(),
    updates: updates
  };
}

function deserializeSpliceId(spliceIdMessage) {
  return {
    site: spliceIdMessage.getSite(),
    seq: spliceIdMessage.getSeq()
  };
}

function deserializePoint(pointMessage) {
  return {
    row: pointMessage.getRow(),
    column: pointMessage.getColumn()
  };
}

module.exports = {
  serializeOperation: serializeOperation,
  deserializeOperation: deserializeOperation,
  serializeOperationBinary: serializeOperationBinary,
  deserializeOperationBinary: deserializeOperationBinary
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
var jspb = __webpack_require__(14);

var goog = jspb;
var global = Function('return this')();
goog.exportSymbol('proto.Operation', null, global);
goog.exportSymbol('proto.Operation.MarkersUpdate', null, global);
goog.exportSymbol('proto.Operation.MarkersUpdate.LayerOperation', null, global);
goog.exportSymbol('proto.Operation.MarkersUpdate.LogicalRange', null, global);
goog.exportSymbol('proto.Operation.MarkersUpdate.MarkerOperation', null, global);
goog.exportSymbol('proto.Operation.MarkersUpdate.MarkerUpdate', null, global);
goog.exportSymbol('proto.Operation.Point', null, global);
goog.exportSymbol('proto.Operation.Splice', null, global);
goog.exportSymbol('proto.Operation.Splice.Deletion', null, global);
goog.exportSymbol('proto.Operation.Splice.Insertion', null, global);
goog.exportSymbol('proto.Operation.SpliceId', null, global);
goog.exportSymbol('proto.Operation.Undo', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */

proto.Operation = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.Operation.oneofGroups_);
};

goog.inherits(proto.Operation, jspb.Message);

if (goog.DEBUG && !COMPILED) {
  proto.Operation.displayName = 'proto.Operation';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */


proto.Operation.oneofGroups_ = [[1, 2, 3]];
/**
 * @enum {number}
 */

proto.Operation.VariantCase = {
  VARIANT_NOT_SET: 0,
  SPLICE: 1,
  UNDO: 2,
  MARKERS_UPDATE: 3
};
/**
 * @return {proto.Operation.VariantCase}
 */

proto.Operation.prototype.getVariantCase = function () {
  return (
    /** @type {proto.Operation.VariantCase} */
    jspb.Message.computeOneofCase(this, proto.Operation.oneofGroups_[0])
  );
};

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto suitable for use in Soy templates.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
   * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
   *     for transitional soy proto support: http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.Operation.prototype.toObject = function (opt_includeInstance) {
    return proto.Operation.toObject(opt_includeInstance, this);
  };
  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Whether to include the JSPB
   *     instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.Operation} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.Operation.toObject = function (includeInstance, msg) {
    var f,
        obj = {
      splice: (f = msg.getSplice()) && proto.Operation.Splice.toObject(includeInstance, f),
      undo: (f = msg.getUndo()) && proto.Operation.Undo.toObject(includeInstance, f),
      markersUpdate: (f = msg.getMarkersUpdate()) && proto.Operation.MarkersUpdate.toObject(includeInstance, f)
    };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }

    return obj;
  };
}
/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation}
 */


proto.Operation.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation();
  return proto.Operation.deserializeBinaryFromReader(msg, reader);
};
/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation}
 */


proto.Operation.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }

    var field = reader.getFieldNumber();

    switch (field) {
      case 1:
        var value = new proto.Operation.Splice();
        reader.readMessage(value, proto.Operation.Splice.deserializeBinaryFromReader);
        msg.setSplice(value);
        break;

      case 2:
        var value = new proto.Operation.Undo();
        reader.readMessage(value, proto.Operation.Undo.deserializeBinaryFromReader);
        msg.setUndo(value);
        break;

      case 3:
        var value = new proto.Operation.MarkersUpdate();
        reader.readMessage(value, proto.Operation.MarkersUpdate.deserializeBinaryFromReader);
        msg.setMarkersUpdate(value);
        break;

      default:
        reader.skipField();
        break;
    }
  }

  return msg;
};
/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */


proto.Operation.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.Operation.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */


proto.Operation.serializeBinaryToWriter = function (message, writer) {
  var f = undefined;
  f = message.getSplice();

  if (f != null) {
    writer.writeMessage(1, f, proto.Operation.Splice.serializeBinaryToWriter);
  }

  f = message.getUndo();

  if (f != null) {
    writer.writeMessage(2, f, proto.Operation.Undo.serializeBinaryToWriter);
  }

  f = message.getMarkersUpdate();

  if (f != null) {
    writer.writeMessage(3, f, proto.Operation.MarkersUpdate.serializeBinaryToWriter);
  }
};
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */


proto.Operation.Splice = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};

goog.inherits(proto.Operation.Splice, jspb.Message);

if (goog.DEBUG && !COMPILED) {
  proto.Operation.Splice.displayName = 'proto.Operation.Splice';
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto suitable for use in Soy templates.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
   * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
   *     for transitional soy proto support: http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.Operation.Splice.prototype.toObject = function (opt_includeInstance) {
    return proto.Operation.Splice.toObject(opt_includeInstance, this);
  };
  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Whether to include the JSPB
   *     instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.Operation.Splice} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.Operation.Splice.toObject = function (includeInstance, msg) {
    var f,
        obj = {
      spliceId: (f = msg.getSpliceId()) && proto.Operation.SpliceId.toObject(includeInstance, f),
      insertion: (f = msg.getInsertion()) && proto.Operation.Splice.Insertion.toObject(includeInstance, f),
      deletion: (f = msg.getDeletion()) && proto.Operation.Splice.Deletion.toObject(includeInstance, f)
    };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }

    return obj;
  };
}
/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.Splice}
 */


proto.Operation.Splice.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.Splice();
  return proto.Operation.Splice.deserializeBinaryFromReader(msg, reader);
};
/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.Splice} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.Splice}
 */


proto.Operation.Splice.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }

    var field = reader.getFieldNumber();

    switch (field) {
      case 1:
        var value = new proto.Operation.SpliceId();
        reader.readMessage(value, proto.Operation.SpliceId.deserializeBinaryFromReader);
        msg.setSpliceId(value);
        break;

      case 2:
        var value = new proto.Operation.Splice.Insertion();
        reader.readMessage(value, proto.Operation.Splice.Insertion.deserializeBinaryFromReader);
        msg.setInsertion(value);
        break;

      case 3:
        var value = new proto.Operation.Splice.Deletion();
        reader.readMessage(value, proto.Operation.Splice.Deletion.deserializeBinaryFromReader);
        msg.setDeletion(value);
        break;

      default:
        reader.skipField();
        break;
    }
  }

  return msg;
};
/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */


proto.Operation.Splice.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.Operation.Splice.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.Splice} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */


proto.Operation.Splice.serializeBinaryToWriter = function (message, writer) {
  var f = undefined;
  f = message.getSpliceId();

  if (f != null) {
    writer.writeMessage(1, f, proto.Operation.SpliceId.serializeBinaryToWriter);
  }

  f = message.getInsertion();

  if (f != null) {
    writer.writeMessage(2, f, proto.Operation.Splice.Insertion.serializeBinaryToWriter);
  }

  f = message.getDeletion();

  if (f != null) {
    writer.writeMessage(3, f, proto.Operation.Splice.Deletion.serializeBinaryToWriter);
  }
};
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */


proto.Operation.Splice.Insertion = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};

goog.inherits(proto.Operation.Splice.Insertion, jspb.Message);

if (goog.DEBUG && !COMPILED) {
  proto.Operation.Splice.Insertion.displayName = 'proto.Operation.Splice.Insertion';
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto suitable for use in Soy templates.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
   * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
   *     for transitional soy proto support: http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.Operation.Splice.Insertion.prototype.toObject = function (opt_includeInstance) {
    return proto.Operation.Splice.Insertion.toObject(opt_includeInstance, this);
  };
  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Whether to include the JSPB
   *     instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.Operation.Splice.Insertion} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.Operation.Splice.Insertion.toObject = function (includeInstance, msg) {
    var f,
        obj = {
      text: jspb.Message.getFieldWithDefault(msg, 2, ""),
      leftDependencyId: (f = msg.getLeftDependencyId()) && proto.Operation.SpliceId.toObject(includeInstance, f),
      offsetInLeftDependency: (f = msg.getOffsetInLeftDependency()) && proto.Operation.Point.toObject(includeInstance, f),
      rightDependencyId: (f = msg.getRightDependencyId()) && proto.Operation.SpliceId.toObject(includeInstance, f),
      offsetInRightDependency: (f = msg.getOffsetInRightDependency()) && proto.Operation.Point.toObject(includeInstance, f)
    };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }

    return obj;
  };
}
/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.Splice.Insertion}
 */


proto.Operation.Splice.Insertion.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.Splice.Insertion();
  return proto.Operation.Splice.Insertion.deserializeBinaryFromReader(msg, reader);
};
/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.Splice.Insertion} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.Splice.Insertion}
 */


proto.Operation.Splice.Insertion.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }

    var field = reader.getFieldNumber();

    switch (field) {
      case 2:
        var value =
        /** @type {string} */
        reader.readString();
        msg.setText(value);
        break;

      case 3:
        var value = new proto.Operation.SpliceId();
        reader.readMessage(value, proto.Operation.SpliceId.deserializeBinaryFromReader);
        msg.setLeftDependencyId(value);
        break;

      case 4:
        var value = new proto.Operation.Point();
        reader.readMessage(value, proto.Operation.Point.deserializeBinaryFromReader);
        msg.setOffsetInLeftDependency(value);
        break;

      case 5:
        var value = new proto.Operation.SpliceId();
        reader.readMessage(value, proto.Operation.SpliceId.deserializeBinaryFromReader);
        msg.setRightDependencyId(value);
        break;

      case 6:
        var value = new proto.Operation.Point();
        reader.readMessage(value, proto.Operation.Point.deserializeBinaryFromReader);
        msg.setOffsetInRightDependency(value);
        break;

      default:
        reader.skipField();
        break;
    }
  }

  return msg;
};
/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */


proto.Operation.Splice.Insertion.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.Operation.Splice.Insertion.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.Splice.Insertion} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */


proto.Operation.Splice.Insertion.serializeBinaryToWriter = function (message, writer) {
  var f = undefined;
  f = message.getText();

  if (f.length > 0) {
    writer.writeString(2, f);
  }

  f = message.getLeftDependencyId();

  if (f != null) {
    writer.writeMessage(3, f, proto.Operation.SpliceId.serializeBinaryToWriter);
  }

  f = message.getOffsetInLeftDependency();

  if (f != null) {
    writer.writeMessage(4, f, proto.Operation.Point.serializeBinaryToWriter);
  }

  f = message.getRightDependencyId();

  if (f != null) {
    writer.writeMessage(5, f, proto.Operation.SpliceId.serializeBinaryToWriter);
  }

  f = message.getOffsetInRightDependency();

  if (f != null) {
    writer.writeMessage(6, f, proto.Operation.Point.serializeBinaryToWriter);
  }
};
/**
 * optional string text = 2;
 * @return {string}
 */


proto.Operation.Splice.Insertion.prototype.getText = function () {
  return (
    /** @type {string} */
    jspb.Message.getFieldWithDefault(this, 2, "")
  );
};
/** @param {string} value */


proto.Operation.Splice.Insertion.prototype.setText = function (value) {
  jspb.Message.setField(this, 2, value);
};
/**
 * optional SpliceId left_dependency_id = 3;
 * @return {?proto.Operation.SpliceId}
 */


proto.Operation.Splice.Insertion.prototype.getLeftDependencyId = function () {
  return (
    /** @type{?proto.Operation.SpliceId} */
    jspb.Message.getWrapperField(this, proto.Operation.SpliceId, 3)
  );
};
/** @param {?proto.Operation.SpliceId|undefined} value */


proto.Operation.Splice.Insertion.prototype.setLeftDependencyId = function (value) {
  jspb.Message.setWrapperField(this, 3, value);
};

proto.Operation.Splice.Insertion.prototype.clearLeftDependencyId = function () {
  this.setLeftDependencyId(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.Splice.Insertion.prototype.hasLeftDependencyId = function () {
  return jspb.Message.getField(this, 3) != null;
};
/**
 * optional Point offset_in_left_dependency = 4;
 * @return {?proto.Operation.Point}
 */


proto.Operation.Splice.Insertion.prototype.getOffsetInLeftDependency = function () {
  return (
    /** @type{?proto.Operation.Point} */
    jspb.Message.getWrapperField(this, proto.Operation.Point, 4)
  );
};
/** @param {?proto.Operation.Point|undefined} value */


proto.Operation.Splice.Insertion.prototype.setOffsetInLeftDependency = function (value) {
  jspb.Message.setWrapperField(this, 4, value);
};

proto.Operation.Splice.Insertion.prototype.clearOffsetInLeftDependency = function () {
  this.setOffsetInLeftDependency(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.Splice.Insertion.prototype.hasOffsetInLeftDependency = function () {
  return jspb.Message.getField(this, 4) != null;
};
/**
 * optional SpliceId right_dependency_id = 5;
 * @return {?proto.Operation.SpliceId}
 */


proto.Operation.Splice.Insertion.prototype.getRightDependencyId = function () {
  return (
    /** @type{?proto.Operation.SpliceId} */
    jspb.Message.getWrapperField(this, proto.Operation.SpliceId, 5)
  );
};
/** @param {?proto.Operation.SpliceId|undefined} value */


proto.Operation.Splice.Insertion.prototype.setRightDependencyId = function (value) {
  jspb.Message.setWrapperField(this, 5, value);
};

proto.Operation.Splice.Insertion.prototype.clearRightDependencyId = function () {
  this.setRightDependencyId(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.Splice.Insertion.prototype.hasRightDependencyId = function () {
  return jspb.Message.getField(this, 5) != null;
};
/**
 * optional Point offset_in_right_dependency = 6;
 * @return {?proto.Operation.Point}
 */


proto.Operation.Splice.Insertion.prototype.getOffsetInRightDependency = function () {
  return (
    /** @type{?proto.Operation.Point} */
    jspb.Message.getWrapperField(this, proto.Operation.Point, 6)
  );
};
/** @param {?proto.Operation.Point|undefined} value */


proto.Operation.Splice.Insertion.prototype.setOffsetInRightDependency = function (value) {
  jspb.Message.setWrapperField(this, 6, value);
};

proto.Operation.Splice.Insertion.prototype.clearOffsetInRightDependency = function () {
  this.setOffsetInRightDependency(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.Splice.Insertion.prototype.hasOffsetInRightDependency = function () {
  return jspb.Message.getField(this, 6) != null;
};
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */


proto.Operation.Splice.Deletion = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};

goog.inherits(proto.Operation.Splice.Deletion, jspb.Message);

if (goog.DEBUG && !COMPILED) {
  proto.Operation.Splice.Deletion.displayName = 'proto.Operation.Splice.Deletion';
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto suitable for use in Soy templates.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
   * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
   *     for transitional soy proto support: http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.Operation.Splice.Deletion.prototype.toObject = function (opt_includeInstance) {
    return proto.Operation.Splice.Deletion.toObject(opt_includeInstance, this);
  };
  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Whether to include the JSPB
   *     instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.Operation.Splice.Deletion} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.Operation.Splice.Deletion.toObject = function (includeInstance, msg) {
    var f,
        obj = {
      leftDependencyId: (f = msg.getLeftDependencyId()) && proto.Operation.SpliceId.toObject(includeInstance, f),
      offsetInLeftDependency: (f = msg.getOffsetInLeftDependency()) && proto.Operation.Point.toObject(includeInstance, f),
      rightDependencyId: (f = msg.getRightDependencyId()) && proto.Operation.SpliceId.toObject(includeInstance, f),
      offsetInRightDependency: (f = msg.getOffsetInRightDependency()) && proto.Operation.Point.toObject(includeInstance, f),
      maxSeqsBySiteMap: (f = msg.getMaxSeqsBySiteMap()) ? f.toObject(includeInstance, undefined) : []
    };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }

    return obj;
  };
}
/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.Splice.Deletion}
 */


proto.Operation.Splice.Deletion.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.Splice.Deletion();
  return proto.Operation.Splice.Deletion.deserializeBinaryFromReader(msg, reader);
};
/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.Splice.Deletion} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.Splice.Deletion}
 */


proto.Operation.Splice.Deletion.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }

    var field = reader.getFieldNumber();

    switch (field) {
      case 2:
        var value = new proto.Operation.SpliceId();
        reader.readMessage(value, proto.Operation.SpliceId.deserializeBinaryFromReader);
        msg.setLeftDependencyId(value);
        break;

      case 3:
        var value = new proto.Operation.Point();
        reader.readMessage(value, proto.Operation.Point.deserializeBinaryFromReader);
        msg.setOffsetInLeftDependency(value);
        break;

      case 4:
        var value = new proto.Operation.SpliceId();
        reader.readMessage(value, proto.Operation.SpliceId.deserializeBinaryFromReader);
        msg.setRightDependencyId(value);
        break;

      case 5:
        var value = new proto.Operation.Point();
        reader.readMessage(value, proto.Operation.Point.deserializeBinaryFromReader);
        msg.setOffsetInRightDependency(value);
        break;

      case 6:
        var value = msg.getMaxSeqsBySiteMap();
        reader.readMessage(value, function (message, reader) {
          jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readUint32, jspb.BinaryReader.prototype.readUint32);
        });
        break;

      default:
        reader.skipField();
        break;
    }
  }

  return msg;
};
/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */


proto.Operation.Splice.Deletion.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.Operation.Splice.Deletion.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.Splice.Deletion} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */


proto.Operation.Splice.Deletion.serializeBinaryToWriter = function (message, writer) {
  var f = undefined;
  f = message.getLeftDependencyId();

  if (f != null) {
    writer.writeMessage(2, f, proto.Operation.SpliceId.serializeBinaryToWriter);
  }

  f = message.getOffsetInLeftDependency();

  if (f != null) {
    writer.writeMessage(3, f, proto.Operation.Point.serializeBinaryToWriter);
  }

  f = message.getRightDependencyId();

  if (f != null) {
    writer.writeMessage(4, f, proto.Operation.SpliceId.serializeBinaryToWriter);
  }

  f = message.getOffsetInRightDependency();

  if (f != null) {
    writer.writeMessage(5, f, proto.Operation.Point.serializeBinaryToWriter);
  }

  f = message.getMaxSeqsBySiteMap(true);

  if (f && f.getLength() > 0) {
    f.serializeBinary(6, writer, jspb.BinaryWriter.prototype.writeUint32, jspb.BinaryWriter.prototype.writeUint32);
  }
};
/**
 * optional SpliceId left_dependency_id = 2;
 * @return {?proto.Operation.SpliceId}
 */


proto.Operation.Splice.Deletion.prototype.getLeftDependencyId = function () {
  return (
    /** @type{?proto.Operation.SpliceId} */
    jspb.Message.getWrapperField(this, proto.Operation.SpliceId, 2)
  );
};
/** @param {?proto.Operation.SpliceId|undefined} value */


proto.Operation.Splice.Deletion.prototype.setLeftDependencyId = function (value) {
  jspb.Message.setWrapperField(this, 2, value);
};

proto.Operation.Splice.Deletion.prototype.clearLeftDependencyId = function () {
  this.setLeftDependencyId(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.Splice.Deletion.prototype.hasLeftDependencyId = function () {
  return jspb.Message.getField(this, 2) != null;
};
/**
 * optional Point offset_in_left_dependency = 3;
 * @return {?proto.Operation.Point}
 */


proto.Operation.Splice.Deletion.prototype.getOffsetInLeftDependency = function () {
  return (
    /** @type{?proto.Operation.Point} */
    jspb.Message.getWrapperField(this, proto.Operation.Point, 3)
  );
};
/** @param {?proto.Operation.Point|undefined} value */


proto.Operation.Splice.Deletion.prototype.setOffsetInLeftDependency = function (value) {
  jspb.Message.setWrapperField(this, 3, value);
};

proto.Operation.Splice.Deletion.prototype.clearOffsetInLeftDependency = function () {
  this.setOffsetInLeftDependency(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.Splice.Deletion.prototype.hasOffsetInLeftDependency = function () {
  return jspb.Message.getField(this, 3) != null;
};
/**
 * optional SpliceId right_dependency_id = 4;
 * @return {?proto.Operation.SpliceId}
 */


proto.Operation.Splice.Deletion.prototype.getRightDependencyId = function () {
  return (
    /** @type{?proto.Operation.SpliceId} */
    jspb.Message.getWrapperField(this, proto.Operation.SpliceId, 4)
  );
};
/** @param {?proto.Operation.SpliceId|undefined} value */


proto.Operation.Splice.Deletion.prototype.setRightDependencyId = function (value) {
  jspb.Message.setWrapperField(this, 4, value);
};

proto.Operation.Splice.Deletion.prototype.clearRightDependencyId = function () {
  this.setRightDependencyId(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.Splice.Deletion.prototype.hasRightDependencyId = function () {
  return jspb.Message.getField(this, 4) != null;
};
/**
 * optional Point offset_in_right_dependency = 5;
 * @return {?proto.Operation.Point}
 */


proto.Operation.Splice.Deletion.prototype.getOffsetInRightDependency = function () {
  return (
    /** @type{?proto.Operation.Point} */
    jspb.Message.getWrapperField(this, proto.Operation.Point, 5)
  );
};
/** @param {?proto.Operation.Point|undefined} value */


proto.Operation.Splice.Deletion.prototype.setOffsetInRightDependency = function (value) {
  jspb.Message.setWrapperField(this, 5, value);
};

proto.Operation.Splice.Deletion.prototype.clearOffsetInRightDependency = function () {
  this.setOffsetInRightDependency(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.Splice.Deletion.prototype.hasOffsetInRightDependency = function () {
  return jspb.Message.getField(this, 5) != null;
};
/**
 * map<uint32, uint32> max_seqs_by_site = 6;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<number,number>}
 */


proto.Operation.Splice.Deletion.prototype.getMaxSeqsBySiteMap = function (opt_noLazyCreate) {
  return (
    /** @type {!jspb.Map<number,number>} */
    jspb.Message.getMapField(this, 6, opt_noLazyCreate, null)
  );
};

proto.Operation.Splice.Deletion.prototype.clearMaxSeqsBySiteMap = function () {
  this.getMaxSeqsBySiteMap().clear();
};
/**
 * optional SpliceId splice_id = 1;
 * @return {?proto.Operation.SpliceId}
 */


proto.Operation.Splice.prototype.getSpliceId = function () {
  return (
    /** @type{?proto.Operation.SpliceId} */
    jspb.Message.getWrapperField(this, proto.Operation.SpliceId, 1)
  );
};
/** @param {?proto.Operation.SpliceId|undefined} value */


proto.Operation.Splice.prototype.setSpliceId = function (value) {
  jspb.Message.setWrapperField(this, 1, value);
};

proto.Operation.Splice.prototype.clearSpliceId = function () {
  this.setSpliceId(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.Splice.prototype.hasSpliceId = function () {
  return jspb.Message.getField(this, 1) != null;
};
/**
 * optional Insertion insertion = 2;
 * @return {?proto.Operation.Splice.Insertion}
 */


proto.Operation.Splice.prototype.getInsertion = function () {
  return (
    /** @type{?proto.Operation.Splice.Insertion} */
    jspb.Message.getWrapperField(this, proto.Operation.Splice.Insertion, 2)
  );
};
/** @param {?proto.Operation.Splice.Insertion|undefined} value */


proto.Operation.Splice.prototype.setInsertion = function (value) {
  jspb.Message.setWrapperField(this, 2, value);
};

proto.Operation.Splice.prototype.clearInsertion = function () {
  this.setInsertion(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.Splice.prototype.hasInsertion = function () {
  return jspb.Message.getField(this, 2) != null;
};
/**
 * optional Deletion deletion = 3;
 * @return {?proto.Operation.Splice.Deletion}
 */


proto.Operation.Splice.prototype.getDeletion = function () {
  return (
    /** @type{?proto.Operation.Splice.Deletion} */
    jspb.Message.getWrapperField(this, proto.Operation.Splice.Deletion, 3)
  );
};
/** @param {?proto.Operation.Splice.Deletion|undefined} value */


proto.Operation.Splice.prototype.setDeletion = function (value) {
  jspb.Message.setWrapperField(this, 3, value);
};

proto.Operation.Splice.prototype.clearDeletion = function () {
  this.setDeletion(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.Splice.prototype.hasDeletion = function () {
  return jspb.Message.getField(this, 3) != null;
};
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */


proto.Operation.Undo = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};

goog.inherits(proto.Operation.Undo, jspb.Message);

if (goog.DEBUG && !COMPILED) {
  proto.Operation.Undo.displayName = 'proto.Operation.Undo';
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto suitable for use in Soy templates.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
   * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
   *     for transitional soy proto support: http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.Operation.Undo.prototype.toObject = function (opt_includeInstance) {
    return proto.Operation.Undo.toObject(opt_includeInstance, this);
  };
  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Whether to include the JSPB
   *     instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.Operation.Undo} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.Operation.Undo.toObject = function (includeInstance, msg) {
    var f,
        obj = {
      spliceId: (f = msg.getSpliceId()) && proto.Operation.SpliceId.toObject(includeInstance, f),
      undoCount: jspb.Message.getFieldWithDefault(msg, 2, 0)
    };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }

    return obj;
  };
}
/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.Undo}
 */


proto.Operation.Undo.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.Undo();
  return proto.Operation.Undo.deserializeBinaryFromReader(msg, reader);
};
/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.Undo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.Undo}
 */


proto.Operation.Undo.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }

    var field = reader.getFieldNumber();

    switch (field) {
      case 1:
        var value = new proto.Operation.SpliceId();
        reader.readMessage(value, proto.Operation.SpliceId.deserializeBinaryFromReader);
        msg.setSpliceId(value);
        break;

      case 2:
        var value =
        /** @type {number} */
        reader.readUint32();
        msg.setUndoCount(value);
        break;

      default:
        reader.skipField();
        break;
    }
  }

  return msg;
};
/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */


proto.Operation.Undo.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.Operation.Undo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.Undo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */


proto.Operation.Undo.serializeBinaryToWriter = function (message, writer) {
  var f = undefined;
  f = message.getSpliceId();

  if (f != null) {
    writer.writeMessage(1, f, proto.Operation.SpliceId.serializeBinaryToWriter);
  }

  f = message.getUndoCount();

  if (f !== 0) {
    writer.writeUint32(2, f);
  }
};
/**
 * optional SpliceId splice_id = 1;
 * @return {?proto.Operation.SpliceId}
 */


proto.Operation.Undo.prototype.getSpliceId = function () {
  return (
    /** @type{?proto.Operation.SpliceId} */
    jspb.Message.getWrapperField(this, proto.Operation.SpliceId, 1)
  );
};
/** @param {?proto.Operation.SpliceId|undefined} value */


proto.Operation.Undo.prototype.setSpliceId = function (value) {
  jspb.Message.setWrapperField(this, 1, value);
};

proto.Operation.Undo.prototype.clearSpliceId = function () {
  this.setSpliceId(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.Undo.prototype.hasSpliceId = function () {
  return jspb.Message.getField(this, 1) != null;
};
/**
 * optional uint32 undo_count = 2;
 * @return {number}
 */


proto.Operation.Undo.prototype.getUndoCount = function () {
  return (
    /** @type {number} */
    jspb.Message.getFieldWithDefault(this, 2, 0)
  );
};
/** @param {number} value */


proto.Operation.Undo.prototype.setUndoCount = function (value) {
  jspb.Message.setField(this, 2, value);
};
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */


proto.Operation.MarkersUpdate = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};

goog.inherits(proto.Operation.MarkersUpdate, jspb.Message);

if (goog.DEBUG && !COMPILED) {
  proto.Operation.MarkersUpdate.displayName = 'proto.Operation.MarkersUpdate';
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto suitable for use in Soy templates.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
   * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
   *     for transitional soy proto support: http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.Operation.MarkersUpdate.prototype.toObject = function (opt_includeInstance) {
    return proto.Operation.MarkersUpdate.toObject(opt_includeInstance, this);
  };
  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Whether to include the JSPB
   *     instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.Operation.MarkersUpdate} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.Operation.MarkersUpdate.toObject = function (includeInstance, msg) {
    var f,
        obj = {
      siteId: jspb.Message.getFieldWithDefault(msg, 1, 0),
      layerOperationsMap: (f = msg.getLayerOperationsMap()) ? f.toObject(includeInstance, proto.Operation.MarkersUpdate.LayerOperation.toObject) : []
    };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }

    return obj;
  };
}
/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.MarkersUpdate}
 */


proto.Operation.MarkersUpdate.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.MarkersUpdate();
  return proto.Operation.MarkersUpdate.deserializeBinaryFromReader(msg, reader);
};
/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.MarkersUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.MarkersUpdate}
 */


proto.Operation.MarkersUpdate.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }

    var field = reader.getFieldNumber();

    switch (field) {
      case 1:
        var value =
        /** @type {number} */
        reader.readUint32();
        msg.setSiteId(value);
        break;

      case 2:
        var value = msg.getLayerOperationsMap();
        reader.readMessage(value, function (message, reader) {
          jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readUint32, jspb.BinaryReader.prototype.readMessage, proto.Operation.MarkersUpdate.LayerOperation.deserializeBinaryFromReader);
        });
        break;

      default:
        reader.skipField();
        break;
    }
  }

  return msg;
};
/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */


proto.Operation.MarkersUpdate.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.Operation.MarkersUpdate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.MarkersUpdate} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */


proto.Operation.MarkersUpdate.serializeBinaryToWriter = function (message, writer) {
  var f = undefined;
  f = message.getSiteId();

  if (f !== 0) {
    writer.writeUint32(1, f);
  }

  f = message.getLayerOperationsMap(true);

  if (f && f.getLength() > 0) {
    f.serializeBinary(2, writer, jspb.BinaryWriter.prototype.writeUint32, jspb.BinaryWriter.prototype.writeMessage, proto.Operation.MarkersUpdate.LayerOperation.serializeBinaryToWriter);
  }
};
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */


proto.Operation.MarkersUpdate.LayerOperation = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};

goog.inherits(proto.Operation.MarkersUpdate.LayerOperation, jspb.Message);

if (goog.DEBUG && !COMPILED) {
  proto.Operation.MarkersUpdate.LayerOperation.displayName = 'proto.Operation.MarkersUpdate.LayerOperation';
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto suitable for use in Soy templates.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
   * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
   *     for transitional soy proto support: http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.Operation.MarkersUpdate.LayerOperation.prototype.toObject = function (opt_includeInstance) {
    return proto.Operation.MarkersUpdate.LayerOperation.toObject(opt_includeInstance, this);
  };
  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Whether to include the JSPB
   *     instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.Operation.MarkersUpdate.LayerOperation} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.Operation.MarkersUpdate.LayerOperation.toObject = function (includeInstance, msg) {
    var f,
        obj = {
      isDeletion: jspb.Message.getFieldWithDefault(msg, 1, false),
      markerOperationsMap: (f = msg.getMarkerOperationsMap()) ? f.toObject(includeInstance, proto.Operation.MarkersUpdate.MarkerOperation.toObject) : []
    };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }

    return obj;
  };
}
/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.MarkersUpdate.LayerOperation}
 */


proto.Operation.MarkersUpdate.LayerOperation.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.MarkersUpdate.LayerOperation();
  return proto.Operation.MarkersUpdate.LayerOperation.deserializeBinaryFromReader(msg, reader);
};
/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.MarkersUpdate.LayerOperation} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.MarkersUpdate.LayerOperation}
 */


proto.Operation.MarkersUpdate.LayerOperation.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }

    var field = reader.getFieldNumber();

    switch (field) {
      case 1:
        var value =
        /** @type {boolean} */
        reader.readBool();
        msg.setIsDeletion(value);
        break;

      case 2:
        var value = msg.getMarkerOperationsMap();
        reader.readMessage(value, function (message, reader) {
          jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readUint32, jspb.BinaryReader.prototype.readMessage, proto.Operation.MarkersUpdate.MarkerOperation.deserializeBinaryFromReader);
        });
        break;

      default:
        reader.skipField();
        break;
    }
  }

  return msg;
};
/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */


proto.Operation.MarkersUpdate.LayerOperation.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.Operation.MarkersUpdate.LayerOperation.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.MarkersUpdate.LayerOperation} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */


proto.Operation.MarkersUpdate.LayerOperation.serializeBinaryToWriter = function (message, writer) {
  var f = undefined;
  f = message.getIsDeletion();

  if (f) {
    writer.writeBool(1, f);
  }

  f = message.getMarkerOperationsMap(true);

  if (f && f.getLength() > 0) {
    f.serializeBinary(2, writer, jspb.BinaryWriter.prototype.writeUint32, jspb.BinaryWriter.prototype.writeMessage, proto.Operation.MarkersUpdate.MarkerOperation.serializeBinaryToWriter);
  }
};
/**
 * optional bool is_deletion = 1;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */


proto.Operation.MarkersUpdate.LayerOperation.prototype.getIsDeletion = function () {
  return (
    /** @type {boolean} */
    jspb.Message.getFieldWithDefault(this, 1, false)
  );
};
/** @param {boolean} value */


proto.Operation.MarkersUpdate.LayerOperation.prototype.setIsDeletion = function (value) {
  jspb.Message.setField(this, 1, value);
};
/**
 * map<uint32, MarkerOperation> marker_operations = 2;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<number,!proto.Operation.MarkersUpdate.MarkerOperation>}
 */


proto.Operation.MarkersUpdate.LayerOperation.prototype.getMarkerOperationsMap = function (opt_noLazyCreate) {
  return (
    /** @type {!jspb.Map<number,!proto.Operation.MarkersUpdate.MarkerOperation>} */
    jspb.Message.getMapField(this, 2, opt_noLazyCreate, proto.Operation.MarkersUpdate.MarkerOperation)
  );
};

proto.Operation.MarkersUpdate.LayerOperation.prototype.clearMarkerOperationsMap = function () {
  this.getMarkerOperationsMap().clear();
};
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */


proto.Operation.MarkersUpdate.MarkerOperation = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};

goog.inherits(proto.Operation.MarkersUpdate.MarkerOperation, jspb.Message);

if (goog.DEBUG && !COMPILED) {
  proto.Operation.MarkersUpdate.MarkerOperation.displayName = 'proto.Operation.MarkersUpdate.MarkerOperation';
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto suitable for use in Soy templates.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
   * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
   *     for transitional soy proto support: http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.Operation.MarkersUpdate.MarkerOperation.prototype.toObject = function (opt_includeInstance) {
    return proto.Operation.MarkersUpdate.MarkerOperation.toObject(opt_includeInstance, this);
  };
  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Whether to include the JSPB
   *     instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.Operation.MarkersUpdate.MarkerOperation} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.Operation.MarkersUpdate.MarkerOperation.toObject = function (includeInstance, msg) {
    var f,
        obj = {
      isDeletion: jspb.Message.getFieldWithDefault(msg, 1, false),
      markerUpdate: (f = msg.getMarkerUpdate()) && proto.Operation.MarkersUpdate.MarkerUpdate.toObject(includeInstance, f)
    };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }

    return obj;
  };
}
/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.MarkersUpdate.MarkerOperation}
 */


proto.Operation.MarkersUpdate.MarkerOperation.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.MarkersUpdate.MarkerOperation();
  return proto.Operation.MarkersUpdate.MarkerOperation.deserializeBinaryFromReader(msg, reader);
};
/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.MarkersUpdate.MarkerOperation} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.MarkersUpdate.MarkerOperation}
 */


proto.Operation.MarkersUpdate.MarkerOperation.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }

    var field = reader.getFieldNumber();

    switch (field) {
      case 1:
        var value =
        /** @type {boolean} */
        reader.readBool();
        msg.setIsDeletion(value);
        break;

      case 2:
        var value = new proto.Operation.MarkersUpdate.MarkerUpdate();
        reader.readMessage(value, proto.Operation.MarkersUpdate.MarkerUpdate.deserializeBinaryFromReader);
        msg.setMarkerUpdate(value);
        break;

      default:
        reader.skipField();
        break;
    }
  }

  return msg;
};
/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */


proto.Operation.MarkersUpdate.MarkerOperation.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.Operation.MarkersUpdate.MarkerOperation.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.MarkersUpdate.MarkerOperation} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */


proto.Operation.MarkersUpdate.MarkerOperation.serializeBinaryToWriter = function (message, writer) {
  var f = undefined;
  f = message.getIsDeletion();

  if (f) {
    writer.writeBool(1, f);
  }

  f = message.getMarkerUpdate();

  if (f != null) {
    writer.writeMessage(2, f, proto.Operation.MarkersUpdate.MarkerUpdate.serializeBinaryToWriter);
  }
};
/**
 * optional bool is_deletion = 1;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */


proto.Operation.MarkersUpdate.MarkerOperation.prototype.getIsDeletion = function () {
  return (
    /** @type {boolean} */
    jspb.Message.getFieldWithDefault(this, 1, false)
  );
};
/** @param {boolean} value */


proto.Operation.MarkersUpdate.MarkerOperation.prototype.setIsDeletion = function (value) {
  jspb.Message.setField(this, 1, value);
};
/**
 * optional MarkerUpdate marker_update = 2;
 * @return {?proto.Operation.MarkersUpdate.MarkerUpdate}
 */


proto.Operation.MarkersUpdate.MarkerOperation.prototype.getMarkerUpdate = function () {
  return (
    /** @type{?proto.Operation.MarkersUpdate.MarkerUpdate} */
    jspb.Message.getWrapperField(this, proto.Operation.MarkersUpdate.MarkerUpdate, 2)
  );
};
/** @param {?proto.Operation.MarkersUpdate.MarkerUpdate|undefined} value */


proto.Operation.MarkersUpdate.MarkerOperation.prototype.setMarkerUpdate = function (value) {
  jspb.Message.setWrapperField(this, 2, value);
};

proto.Operation.MarkersUpdate.MarkerOperation.prototype.clearMarkerUpdate = function () {
  this.setMarkerUpdate(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.MarkersUpdate.MarkerOperation.prototype.hasMarkerUpdate = function () {
  return jspb.Message.getField(this, 2) != null;
};
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */


proto.Operation.MarkersUpdate.MarkerUpdate = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};

goog.inherits(proto.Operation.MarkersUpdate.MarkerUpdate, jspb.Message);

if (goog.DEBUG && !COMPILED) {
  proto.Operation.MarkersUpdate.MarkerUpdate.displayName = 'proto.Operation.MarkersUpdate.MarkerUpdate';
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto suitable for use in Soy templates.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
   * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
   *     for transitional soy proto support: http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.Operation.MarkersUpdate.MarkerUpdate.prototype.toObject = function (opt_includeInstance) {
    return proto.Operation.MarkersUpdate.MarkerUpdate.toObject(opt_includeInstance, this);
  };
  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Whether to include the JSPB
   *     instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.Operation.MarkersUpdate.MarkerUpdate} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.Operation.MarkersUpdate.MarkerUpdate.toObject = function (includeInstance, msg) {
    var f,
        obj = {
      range: (f = msg.getRange()) && proto.Operation.MarkersUpdate.LogicalRange.toObject(includeInstance, f),
      exclusive: jspb.Message.getFieldWithDefault(msg, 2, false),
      reversed: jspb.Message.getFieldWithDefault(msg, 3, false),
      tailed: jspb.Message.getFieldWithDefault(msg, 4, false)
    };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }

    return obj;
  };
}
/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.MarkersUpdate.MarkerUpdate}
 */


proto.Operation.MarkersUpdate.MarkerUpdate.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.MarkersUpdate.MarkerUpdate();
  return proto.Operation.MarkersUpdate.MarkerUpdate.deserializeBinaryFromReader(msg, reader);
};
/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.MarkersUpdate.MarkerUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.MarkersUpdate.MarkerUpdate}
 */


proto.Operation.MarkersUpdate.MarkerUpdate.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }

    var field = reader.getFieldNumber();

    switch (field) {
      case 1:
        var value = new proto.Operation.MarkersUpdate.LogicalRange();
        reader.readMessage(value, proto.Operation.MarkersUpdate.LogicalRange.deserializeBinaryFromReader);
        msg.setRange(value);
        break;

      case 2:
        var value =
        /** @type {boolean} */
        reader.readBool();
        msg.setExclusive(value);
        break;

      case 3:
        var value =
        /** @type {boolean} */
        reader.readBool();
        msg.setReversed(value);
        break;

      case 4:
        var value =
        /** @type {boolean} */
        reader.readBool();
        msg.setTailed(value);
        break;

      default:
        reader.skipField();
        break;
    }
  }

  return msg;
};
/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */


proto.Operation.MarkersUpdate.MarkerUpdate.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.Operation.MarkersUpdate.MarkerUpdate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.MarkersUpdate.MarkerUpdate} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */


proto.Operation.MarkersUpdate.MarkerUpdate.serializeBinaryToWriter = function (message, writer) {
  var f = undefined;
  f = message.getRange();

  if (f != null) {
    writer.writeMessage(1, f, proto.Operation.MarkersUpdate.LogicalRange.serializeBinaryToWriter);
  }

  f = message.getExclusive();

  if (f) {
    writer.writeBool(2, f);
  }

  f = message.getReversed();

  if (f) {
    writer.writeBool(3, f);
  }

  f = message.getTailed();

  if (f) {
    writer.writeBool(4, f);
  }
};
/**
 * optional LogicalRange range = 1;
 * @return {?proto.Operation.MarkersUpdate.LogicalRange}
 */


proto.Operation.MarkersUpdate.MarkerUpdate.prototype.getRange = function () {
  return (
    /** @type{?proto.Operation.MarkersUpdate.LogicalRange} */
    jspb.Message.getWrapperField(this, proto.Operation.MarkersUpdate.LogicalRange, 1)
  );
};
/** @param {?proto.Operation.MarkersUpdate.LogicalRange|undefined} value */


proto.Operation.MarkersUpdate.MarkerUpdate.prototype.setRange = function (value) {
  jspb.Message.setWrapperField(this, 1, value);
};

proto.Operation.MarkersUpdate.MarkerUpdate.prototype.clearRange = function () {
  this.setRange(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.MarkersUpdate.MarkerUpdate.prototype.hasRange = function () {
  return jspb.Message.getField(this, 1) != null;
};
/**
 * optional bool exclusive = 2;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */


proto.Operation.MarkersUpdate.MarkerUpdate.prototype.getExclusive = function () {
  return (
    /** @type {boolean} */
    jspb.Message.getFieldWithDefault(this, 2, false)
  );
};
/** @param {boolean} value */


proto.Operation.MarkersUpdate.MarkerUpdate.prototype.setExclusive = function (value) {
  jspb.Message.setField(this, 2, value);
};
/**
 * optional bool reversed = 3;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */


proto.Operation.MarkersUpdate.MarkerUpdate.prototype.getReversed = function () {
  return (
    /** @type {boolean} */
    jspb.Message.getFieldWithDefault(this, 3, false)
  );
};
/** @param {boolean} value */


proto.Operation.MarkersUpdate.MarkerUpdate.prototype.setReversed = function (value) {
  jspb.Message.setField(this, 3, value);
};
/**
 * optional bool tailed = 4;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */


proto.Operation.MarkersUpdate.MarkerUpdate.prototype.getTailed = function () {
  return (
    /** @type {boolean} */
    jspb.Message.getFieldWithDefault(this, 4, false)
  );
};
/** @param {boolean} value */


proto.Operation.MarkersUpdate.MarkerUpdate.prototype.setTailed = function (value) {
  jspb.Message.setField(this, 4, value);
};
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */


proto.Operation.MarkersUpdate.LogicalRange = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};

goog.inherits(proto.Operation.MarkersUpdate.LogicalRange, jspb.Message);

if (goog.DEBUG && !COMPILED) {
  proto.Operation.MarkersUpdate.LogicalRange.displayName = 'proto.Operation.MarkersUpdate.LogicalRange';
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto suitable for use in Soy templates.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
   * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
   *     for transitional soy proto support: http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.Operation.MarkersUpdate.LogicalRange.prototype.toObject = function (opt_includeInstance) {
    return proto.Operation.MarkersUpdate.LogicalRange.toObject(opt_includeInstance, this);
  };
  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Whether to include the JSPB
   *     instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.Operation.MarkersUpdate.LogicalRange} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.Operation.MarkersUpdate.LogicalRange.toObject = function (includeInstance, msg) {
    var f,
        obj = {
      startDependencyId: (f = msg.getStartDependencyId()) && proto.Operation.SpliceId.toObject(includeInstance, f),
      offsetInStartDependency: (f = msg.getOffsetInStartDependency()) && proto.Operation.Point.toObject(includeInstance, f),
      endDependencyId: (f = msg.getEndDependencyId()) && proto.Operation.SpliceId.toObject(includeInstance, f),
      offsetInEndDependency: (f = msg.getOffsetInEndDependency()) && proto.Operation.Point.toObject(includeInstance, f)
    };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }

    return obj;
  };
}
/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.MarkersUpdate.LogicalRange}
 */


proto.Operation.MarkersUpdate.LogicalRange.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.MarkersUpdate.LogicalRange();
  return proto.Operation.MarkersUpdate.LogicalRange.deserializeBinaryFromReader(msg, reader);
};
/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.MarkersUpdate.LogicalRange} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.MarkersUpdate.LogicalRange}
 */


proto.Operation.MarkersUpdate.LogicalRange.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }

    var field = reader.getFieldNumber();

    switch (field) {
      case 1:
        var value = new proto.Operation.SpliceId();
        reader.readMessage(value, proto.Operation.SpliceId.deserializeBinaryFromReader);
        msg.setStartDependencyId(value);
        break;

      case 2:
        var value = new proto.Operation.Point();
        reader.readMessage(value, proto.Operation.Point.deserializeBinaryFromReader);
        msg.setOffsetInStartDependency(value);
        break;

      case 3:
        var value = new proto.Operation.SpliceId();
        reader.readMessage(value, proto.Operation.SpliceId.deserializeBinaryFromReader);
        msg.setEndDependencyId(value);
        break;

      case 4:
        var value = new proto.Operation.Point();
        reader.readMessage(value, proto.Operation.Point.deserializeBinaryFromReader);
        msg.setOffsetInEndDependency(value);
        break;

      default:
        reader.skipField();
        break;
    }
  }

  return msg;
};
/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */


proto.Operation.MarkersUpdate.LogicalRange.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.Operation.MarkersUpdate.LogicalRange.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.MarkersUpdate.LogicalRange} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */


proto.Operation.MarkersUpdate.LogicalRange.serializeBinaryToWriter = function (message, writer) {
  var f = undefined;
  f = message.getStartDependencyId();

  if (f != null) {
    writer.writeMessage(1, f, proto.Operation.SpliceId.serializeBinaryToWriter);
  }

  f = message.getOffsetInStartDependency();

  if (f != null) {
    writer.writeMessage(2, f, proto.Operation.Point.serializeBinaryToWriter);
  }

  f = message.getEndDependencyId();

  if (f != null) {
    writer.writeMessage(3, f, proto.Operation.SpliceId.serializeBinaryToWriter);
  }

  f = message.getOffsetInEndDependency();

  if (f != null) {
    writer.writeMessage(4, f, proto.Operation.Point.serializeBinaryToWriter);
  }
};
/**
 * optional SpliceId start_dependency_id = 1;
 * @return {?proto.Operation.SpliceId}
 */


proto.Operation.MarkersUpdate.LogicalRange.prototype.getStartDependencyId = function () {
  return (
    /** @type{?proto.Operation.SpliceId} */
    jspb.Message.getWrapperField(this, proto.Operation.SpliceId, 1)
  );
};
/** @param {?proto.Operation.SpliceId|undefined} value */


proto.Operation.MarkersUpdate.LogicalRange.prototype.setStartDependencyId = function (value) {
  jspb.Message.setWrapperField(this, 1, value);
};

proto.Operation.MarkersUpdate.LogicalRange.prototype.clearStartDependencyId = function () {
  this.setStartDependencyId(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.MarkersUpdate.LogicalRange.prototype.hasStartDependencyId = function () {
  return jspb.Message.getField(this, 1) != null;
};
/**
 * optional Point offset_in_start_dependency = 2;
 * @return {?proto.Operation.Point}
 */


proto.Operation.MarkersUpdate.LogicalRange.prototype.getOffsetInStartDependency = function () {
  return (
    /** @type{?proto.Operation.Point} */
    jspb.Message.getWrapperField(this, proto.Operation.Point, 2)
  );
};
/** @param {?proto.Operation.Point|undefined} value */


proto.Operation.MarkersUpdate.LogicalRange.prototype.setOffsetInStartDependency = function (value) {
  jspb.Message.setWrapperField(this, 2, value);
};

proto.Operation.MarkersUpdate.LogicalRange.prototype.clearOffsetInStartDependency = function () {
  this.setOffsetInStartDependency(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.MarkersUpdate.LogicalRange.prototype.hasOffsetInStartDependency = function () {
  return jspb.Message.getField(this, 2) != null;
};
/**
 * optional SpliceId end_dependency_id = 3;
 * @return {?proto.Operation.SpliceId}
 */


proto.Operation.MarkersUpdate.LogicalRange.prototype.getEndDependencyId = function () {
  return (
    /** @type{?proto.Operation.SpliceId} */
    jspb.Message.getWrapperField(this, proto.Operation.SpliceId, 3)
  );
};
/** @param {?proto.Operation.SpliceId|undefined} value */


proto.Operation.MarkersUpdate.LogicalRange.prototype.setEndDependencyId = function (value) {
  jspb.Message.setWrapperField(this, 3, value);
};

proto.Operation.MarkersUpdate.LogicalRange.prototype.clearEndDependencyId = function () {
  this.setEndDependencyId(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.MarkersUpdate.LogicalRange.prototype.hasEndDependencyId = function () {
  return jspb.Message.getField(this, 3) != null;
};
/**
 * optional Point offset_in_end_dependency = 4;
 * @return {?proto.Operation.Point}
 */


proto.Operation.MarkersUpdate.LogicalRange.prototype.getOffsetInEndDependency = function () {
  return (
    /** @type{?proto.Operation.Point} */
    jspb.Message.getWrapperField(this, proto.Operation.Point, 4)
  );
};
/** @param {?proto.Operation.Point|undefined} value */


proto.Operation.MarkersUpdate.LogicalRange.prototype.setOffsetInEndDependency = function (value) {
  jspb.Message.setWrapperField(this, 4, value);
};

proto.Operation.MarkersUpdate.LogicalRange.prototype.clearOffsetInEndDependency = function () {
  this.setOffsetInEndDependency(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.MarkersUpdate.LogicalRange.prototype.hasOffsetInEndDependency = function () {
  return jspb.Message.getField(this, 4) != null;
};
/**
 * optional uint32 site_id = 1;
 * @return {number}
 */


proto.Operation.MarkersUpdate.prototype.getSiteId = function () {
  return (
    /** @type {number} */
    jspb.Message.getFieldWithDefault(this, 1, 0)
  );
};
/** @param {number} value */


proto.Operation.MarkersUpdate.prototype.setSiteId = function (value) {
  jspb.Message.setField(this, 1, value);
};
/**
 * map<uint32, LayerOperation> layer_operations = 2;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<number,!proto.Operation.MarkersUpdate.LayerOperation>}
 */


proto.Operation.MarkersUpdate.prototype.getLayerOperationsMap = function (opt_noLazyCreate) {
  return (
    /** @type {!jspb.Map<number,!proto.Operation.MarkersUpdate.LayerOperation>} */
    jspb.Message.getMapField(this, 2, opt_noLazyCreate, proto.Operation.MarkersUpdate.LayerOperation)
  );
};

proto.Operation.MarkersUpdate.prototype.clearLayerOperationsMap = function () {
  this.getLayerOperationsMap().clear();
};
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */


proto.Operation.SpliceId = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};

goog.inherits(proto.Operation.SpliceId, jspb.Message);

if (goog.DEBUG && !COMPILED) {
  proto.Operation.SpliceId.displayName = 'proto.Operation.SpliceId';
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto suitable for use in Soy templates.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
   * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
   *     for transitional soy proto support: http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.Operation.SpliceId.prototype.toObject = function (opt_includeInstance) {
    return proto.Operation.SpliceId.toObject(opt_includeInstance, this);
  };
  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Whether to include the JSPB
   *     instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.Operation.SpliceId} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.Operation.SpliceId.toObject = function (includeInstance, msg) {
    var f,
        obj = {
      site: jspb.Message.getFieldWithDefault(msg, 1, 0),
      seq: jspb.Message.getFieldWithDefault(msg, 2, 0)
    };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }

    return obj;
  };
}
/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.SpliceId}
 */


proto.Operation.SpliceId.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.SpliceId();
  return proto.Operation.SpliceId.deserializeBinaryFromReader(msg, reader);
};
/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.SpliceId} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.SpliceId}
 */


proto.Operation.SpliceId.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }

    var field = reader.getFieldNumber();

    switch (field) {
      case 1:
        var value =
        /** @type {number} */
        reader.readUint32();
        msg.setSite(value);
        break;

      case 2:
        var value =
        /** @type {number} */
        reader.readUint32();
        msg.setSeq(value);
        break;

      default:
        reader.skipField();
        break;
    }
  }

  return msg;
};
/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */


proto.Operation.SpliceId.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.Operation.SpliceId.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.SpliceId} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */


proto.Operation.SpliceId.serializeBinaryToWriter = function (message, writer) {
  var f = undefined;
  f = message.getSite();

  if (f !== 0) {
    writer.writeUint32(1, f);
  }

  f = message.getSeq();

  if (f !== 0) {
    writer.writeUint32(2, f);
  }
};
/**
 * optional uint32 site = 1;
 * @return {number}
 */


proto.Operation.SpliceId.prototype.getSite = function () {
  return (
    /** @type {number} */
    jspb.Message.getFieldWithDefault(this, 1, 0)
  );
};
/** @param {number} value */


proto.Operation.SpliceId.prototype.setSite = function (value) {
  jspb.Message.setField(this, 1, value);
};
/**
 * optional uint32 seq = 2;
 * @return {number}
 */


proto.Operation.SpliceId.prototype.getSeq = function () {
  return (
    /** @type {number} */
    jspb.Message.getFieldWithDefault(this, 2, 0)
  );
};
/** @param {number} value */


proto.Operation.SpliceId.prototype.setSeq = function (value) {
  jspb.Message.setField(this, 2, value);
};
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */


proto.Operation.Point = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};

goog.inherits(proto.Operation.Point, jspb.Message);

if (goog.DEBUG && !COMPILED) {
  proto.Operation.Point.displayName = 'proto.Operation.Point';
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto suitable for use in Soy templates.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
   * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
   *     for transitional soy proto support: http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.Operation.Point.prototype.toObject = function (opt_includeInstance) {
    return proto.Operation.Point.toObject(opt_includeInstance, this);
  };
  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Whether to include the JSPB
   *     instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.Operation.Point} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.Operation.Point.toObject = function (includeInstance, msg) {
    var f,
        obj = {
      row: jspb.Message.getFieldWithDefault(msg, 1, 0),
      column: jspb.Message.getFieldWithDefault(msg, 2, 0)
    };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }

    return obj;
  };
}
/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.Point}
 */


proto.Operation.Point.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.Point();
  return proto.Operation.Point.deserializeBinaryFromReader(msg, reader);
};
/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.Point} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.Point}
 */


proto.Operation.Point.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }

    var field = reader.getFieldNumber();

    switch (field) {
      case 1:
        var value =
        /** @type {number} */
        reader.readUint32();
        msg.setRow(value);
        break;

      case 2:
        var value =
        /** @type {number} */
        reader.readUint32();
        msg.setColumn(value);
        break;

      default:
        reader.skipField();
        break;
    }
  }

  return msg;
};
/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */


proto.Operation.Point.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.Operation.Point.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};
/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.Point} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */


proto.Operation.Point.serializeBinaryToWriter = function (message, writer) {
  var f = undefined;
  f = message.getRow();

  if (f !== 0) {
    writer.writeUint32(1, f);
  }

  f = message.getColumn();

  if (f !== 0) {
    writer.writeUint32(2, f);
  }
};
/**
 * optional uint32 row = 1;
 * @return {number}
 */


proto.Operation.Point.prototype.getRow = function () {
  return (
    /** @type {number} */
    jspb.Message.getFieldWithDefault(this, 1, 0)
  );
};
/** @param {number} value */


proto.Operation.Point.prototype.setRow = function (value) {
  jspb.Message.setField(this, 1, value);
};
/**
 * optional uint32 column = 2;
 * @return {number}
 */


proto.Operation.Point.prototype.getColumn = function () {
  return (
    /** @type {number} */
    jspb.Message.getFieldWithDefault(this, 2, 0)
  );
};
/** @param {number} value */


proto.Operation.Point.prototype.setColumn = function (value) {
  jspb.Message.setField(this, 2, value);
};
/**
 * optional Splice splice = 1;
 * @return {?proto.Operation.Splice}
 */


proto.Operation.prototype.getSplice = function () {
  return (
    /** @type{?proto.Operation.Splice} */
    jspb.Message.getWrapperField(this, proto.Operation.Splice, 1)
  );
};
/** @param {?proto.Operation.Splice|undefined} value */


proto.Operation.prototype.setSplice = function (value) {
  jspb.Message.setOneofWrapperField(this, 1, proto.Operation.oneofGroups_[0], value);
};

proto.Operation.prototype.clearSplice = function () {
  this.setSplice(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.prototype.hasSplice = function () {
  return jspb.Message.getField(this, 1) != null;
};
/**
 * optional Undo undo = 2;
 * @return {?proto.Operation.Undo}
 */


proto.Operation.prototype.getUndo = function () {
  return (
    /** @type{?proto.Operation.Undo} */
    jspb.Message.getWrapperField(this, proto.Operation.Undo, 2)
  );
};
/** @param {?proto.Operation.Undo|undefined} value */


proto.Operation.prototype.setUndo = function (value) {
  jspb.Message.setOneofWrapperField(this, 2, proto.Operation.oneofGroups_[0], value);
};

proto.Operation.prototype.clearUndo = function () {
  this.setUndo(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.prototype.hasUndo = function () {
  return jspb.Message.getField(this, 2) != null;
};
/**
 * optional MarkersUpdate markers_update = 3;
 * @return {?proto.Operation.MarkersUpdate}
 */


proto.Operation.prototype.getMarkersUpdate = function () {
  return (
    /** @type{?proto.Operation.MarkersUpdate} */
    jspb.Message.getWrapperField(this, proto.Operation.MarkersUpdate, 3)
  );
};
/** @param {?proto.Operation.MarkersUpdate|undefined} value */


proto.Operation.prototype.setMarkersUpdate = function (value) {
  jspb.Message.setOneofWrapperField(this, 3, proto.Operation.oneofGroups_[0], value);
};

proto.Operation.prototype.clearMarkersUpdate = function () {
  this.setMarkersUpdate(undefined);
};
/**
 * Returns whether this field is set.
 * @return {!boolean}
 */


proto.Operation.prototype.hasMarkersUpdate = function () {
  return jspb.Message.getField(this, 3) != null;
};

goog.object.extend(exports, proto);

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var $jscomp={scope:{},getGlobal:function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global?global:a}};$jscomp.global=$jscomp.getGlobal(this);$jscomp.initSymbol=function(){$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol);$jscomp.initSymbol=function(){}};$jscomp.symbolCounter_=0;$jscomp.Symbol=function(a){return"jscomp_symbol_"+a+$jscomp.symbolCounter_++};
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();$jscomp.global.Symbol.iterator||($jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));$jscomp.initSymbolIterator=function(){}};$jscomp.makeIterator=function(a){$jscomp.initSymbolIterator();$jscomp.initSymbol();$jscomp.initSymbolIterator();var b=a[Symbol.iterator];if(b)return b.call(a);var c=0;return{next:function(){return c<a.length?{done:!1,value:a[c++]}:{done:!0}}}};
$jscomp.arrayFromIterator=function(a){for(var b,c=[];!(b=a.next()).done;)c.push(b.value);return c};$jscomp.arrayFromIterable=function(a){return a instanceof Array?a:$jscomp.arrayFromIterator($jscomp.makeIterator(a))};$jscomp.inherits=function(a,b){function c(){}c.prototype=b.prototype;a.prototype=new c;a.prototype.constructor=a;for(var d in b)if(Object.defineProperties){var e=Object.getOwnPropertyDescriptor(b,d);e&&Object.defineProperty(a,d,e)}else a[d]=b[d]};$jscomp.array=$jscomp.array||{};
$jscomp.iteratorFromArray=function(a,b){$jscomp.initSymbolIterator();a instanceof String&&(a+="");var c=0,d={next:function(){if(c<a.length){var e=c++;return{value:b(e,a[e]),done:!1}}d.next=function(){return{done:!0,value:void 0}};return d.next()}};$jscomp.initSymbol();$jscomp.initSymbolIterator();d[Symbol.iterator]=function(){return d};return d};
$jscomp.findInternal=function(a,b,c){a instanceof String&&(a=String(a));for(var d=a.length,e=0;e<d;e++){var f=a[e];if(b.call(c,f,e,a))return{i:e,v:f}}return{i:-1,v:void 0}};
$jscomp.array.from=function(a,b,c){$jscomp.initSymbolIterator();b=null!=b?b:function(a){return a};var d=[];$jscomp.initSymbol();$jscomp.initSymbolIterator();var e=a[Symbol.iterator];"function"==typeof e&&(a=e.call(a));if("function"==typeof a.next)for(;!(e=a.next()).done;)d.push(b.call(c,e.value));else for(var e=a.length,f=0;f<e;f++)d.push(b.call(c,a[f]));return d};$jscomp.array.of=function(a){return $jscomp.array.from(arguments)};
$jscomp.array.entries=function(){return $jscomp.iteratorFromArray(this,function(a,b){return[a,b]})};$jscomp.array.installHelper_=function(a,b){!Array.prototype[a]&&Object.defineProperties&&Object.defineProperty&&Object.defineProperty(Array.prototype,a,{configurable:!0,enumerable:!1,writable:!0,value:b})};$jscomp.array.entries$install=function(){$jscomp.array.installHelper_("entries",$jscomp.array.entries)};$jscomp.array.keys=function(){return $jscomp.iteratorFromArray(this,function(a){return a})};
$jscomp.array.keys$install=function(){$jscomp.array.installHelper_("keys",$jscomp.array.keys)};$jscomp.array.values=function(){return $jscomp.iteratorFromArray(this,function(a,b){return b})};$jscomp.array.values$install=function(){$jscomp.array.installHelper_("values",$jscomp.array.values)};
$jscomp.array.copyWithin=function(a,b,c){var d=this.length;a=Number(a);b=Number(b);c=Number(null!=c?c:d);if(a<b)for(c=Math.min(c,d);b<c;)b in this?this[a++]=this[b++]:(delete this[a++],b++);else for(c=Math.min(c,d+b-a),a+=c-b;c>b;)--c in this?this[--a]=this[c]:delete this[a];return this};$jscomp.array.copyWithin$install=function(){$jscomp.array.installHelper_("copyWithin",$jscomp.array.copyWithin)};
$jscomp.array.fill=function(a,b,c){var d=this.length||0;0>b&&(b=Math.max(0,d+b));if(null==c||c>d)c=d;c=Number(c);0>c&&(c=Math.max(0,d+c));for(b=Number(b||0);b<c;b++)this[b]=a;return this};$jscomp.array.fill$install=function(){$jscomp.array.installHelper_("fill",$jscomp.array.fill)};$jscomp.array.find=function(a,b){return $jscomp.findInternal(this,a,b).v};$jscomp.array.find$install=function(){$jscomp.array.installHelper_("find",$jscomp.array.find)};
$jscomp.array.findIndex=function(a,b){return $jscomp.findInternal(this,a,b).i};$jscomp.array.findIndex$install=function(){$jscomp.array.installHelper_("findIndex",$jscomp.array.findIndex)};$jscomp.ASSUME_NO_NATIVE_MAP=!1;
$jscomp.Map$isConformant=function(){if($jscomp.ASSUME_NO_NATIVE_MAP)return!1;var a=$jscomp.global.Map;if(!a||!a.prototype.entries||"function"!=typeof Object.seal)return!1;try{var b=Object.seal({x:4}),c=new a($jscomp.makeIterator([[b,"s"]]));if("s"!=c.get(b)||1!=c.size||c.get({x:4})||c.set({x:4},"t")!=c||2!=c.size)return!1;var d=c.entries(),e=d.next();if(e.done||e.value[0]!=b||"s"!=e.value[1])return!1;e=d.next();return e.done||4!=e.value[0].x||"t"!=e.value[1]||!d.next().done?!1:!0}catch(f){return!1}};
$jscomp.Map=function(a){this.data_={};this.head_=$jscomp.Map.createHead();this.size=0;if(a){a=$jscomp.makeIterator(a);for(var b;!(b=a.next()).done;)b=b.value,this.set(b[0],b[1])}};
$jscomp.Map.prototype.set=function(a,b){var c=$jscomp.Map.maybeGetEntry(this,a);c.list||(c.list=this.data_[c.id]=[]);c.entry?c.entry.value=b:(c.entry={next:this.head_,previous:this.head_.previous,head:this.head_,key:a,value:b},c.list.push(c.entry),this.head_.previous.next=c.entry,this.head_.previous=c.entry,this.size++);return this};
$jscomp.Map.prototype["delete"]=function(a){a=$jscomp.Map.maybeGetEntry(this,a);return a.entry&&a.list?(a.list.splice(a.index,1),a.list.length||delete this.data_[a.id],a.entry.previous.next=a.entry.next,a.entry.next.previous=a.entry.previous,a.entry.head=null,this.size--,!0):!1};$jscomp.Map.prototype.clear=function(){this.data_={};this.head_=this.head_.previous=$jscomp.Map.createHead();this.size=0};$jscomp.Map.prototype.has=function(a){return!!$jscomp.Map.maybeGetEntry(this,a).entry};
$jscomp.Map.prototype.get=function(a){return(a=$jscomp.Map.maybeGetEntry(this,a).entry)&&a.value};$jscomp.Map.prototype.entries=function(){return $jscomp.Map.makeIterator_(this,function(a){return[a.key,a.value]})};$jscomp.Map.prototype.keys=function(){return $jscomp.Map.makeIterator_(this,function(a){return a.key})};$jscomp.Map.prototype.values=function(){return $jscomp.Map.makeIterator_(this,function(a){return a.value})};
$jscomp.Map.prototype.forEach=function(a,b){for(var c=this.entries(),d;!(d=c.next()).done;)d=d.value,a.call(b,d[1],d[0],this)};$jscomp.Map.maybeGetEntry=function(a,b){var c=$jscomp.Map.getId(b),d=a.data_[c];if(d&&Object.prototype.hasOwnProperty.call(a.data_,c))for(var e=0;e<d.length;e++){var f=d[e];if(b!==b&&f.key!==f.key||b===f.key)return{id:c,list:d,index:e,entry:f}}return{id:c,list:d,index:-1,entry:void 0}};
$jscomp.Map.makeIterator_=function(a,b){var c=a.head_,d={next:function(){if(c){for(;c.head!=a.head_;)c=c.previous;for(;c.next!=c.head;)return c=c.next,{done:!1,value:b(c)};c=null}return{done:!0,value:void 0}}};$jscomp.initSymbol();$jscomp.initSymbolIterator();d[Symbol.iterator]=function(){return d};return d};$jscomp.Map.mapIndex_=0;$jscomp.Map.createHead=function(){var a={};return a.previous=a.next=a.head=a};
$jscomp.Map.getId=function(a){if(!(a instanceof Object))return"p_"+a;if(!($jscomp.Map.idKey in a))try{$jscomp.Map.defineProperty(a,$jscomp.Map.idKey,{value:++$jscomp.Map.mapIndex_})}catch(b){}return $jscomp.Map.idKey in a?a[$jscomp.Map.idKey]:"o_ "+a};$jscomp.Map.defineProperty=Object.defineProperty?function(a,b,c){Object.defineProperty(a,b,{value:String(c)})}:function(a,b,c){a[b]=String(c)};$jscomp.Map.Entry=function(){};
$jscomp.Map$install=function(){$jscomp.initSymbol();$jscomp.initSymbolIterator();$jscomp.Map$isConformant()?$jscomp.Map=$jscomp.global.Map:($jscomp.initSymbol(),$jscomp.initSymbolIterator(),$jscomp.Map.prototype[Symbol.iterator]=$jscomp.Map.prototype.entries,$jscomp.initSymbol(),$jscomp.Map.idKey=Symbol("map-id-key"),$jscomp.Map$install=function(){})};$jscomp.math=$jscomp.math||{};
$jscomp.math.clz32=function(a){a=Number(a)>>>0;if(0===a)return 32;var b=0;0===(a&4294901760)&&(a<<=16,b+=16);0===(a&4278190080)&&(a<<=8,b+=8);0===(a&4026531840)&&(a<<=4,b+=4);0===(a&3221225472)&&(a<<=2,b+=2);0===(a&2147483648)&&b++;return b};$jscomp.math.imul=function(a,b){a=Number(a);b=Number(b);var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};$jscomp.math.sign=function(a){a=Number(a);return 0===a||isNaN(a)?a:0<a?1:-1};
$jscomp.math.log10=function(a){return Math.log(a)/Math.LN10};$jscomp.math.log2=function(a){return Math.log(a)/Math.LN2};$jscomp.math.log1p=function(a){a=Number(a);if(.25>a&&-.25<a){for(var b=a,c=1,d=a,e=0,f=1;e!=d;)b*=a,f*=-1,d=(e=d)+f*b/++c;return d}return Math.log(1+a)};$jscomp.math.expm1=function(a){a=Number(a);if(.25>a&&-.25<a){for(var b=a,c=1,d=a,e=0;e!=d;)b*=a/++c,d=(e=d)+b;return d}return Math.exp(a)-1};$jscomp.math.cosh=function(a){a=Number(a);return(Math.exp(a)+Math.exp(-a))/2};
$jscomp.math.sinh=function(a){a=Number(a);return 0===a?a:(Math.exp(a)-Math.exp(-a))/2};$jscomp.math.tanh=function(a){a=Number(a);if(0===a)return a;var b=Math.exp(-2*Math.abs(a)),b=(1-b)/(1+b);return 0>a?-b:b};$jscomp.math.acosh=function(a){a=Number(a);return Math.log(a+Math.sqrt(a*a-1))};$jscomp.math.asinh=function(a){a=Number(a);if(0===a)return a;var b=Math.log(Math.abs(a)+Math.sqrt(a*a+1));return 0>a?-b:b};
$jscomp.math.atanh=function(a){a=Number(a);return($jscomp.math.log1p(a)-$jscomp.math.log1p(-a))/2};$jscomp.math.hypot=function(a,b,c){a=Number(a);b=Number(b);var d,e,f,g=Math.max(Math.abs(a),Math.abs(b));for(d=2;d<arguments.length;d++)g=Math.max(g,Math.abs(arguments[d]));if(1E100<g||1E-100>g){a/=g;b/=g;f=a*a+b*b;for(d=2;d<arguments.length;d++)e=Number(arguments[d])/g,f+=e*e;return Math.sqrt(f)*g}f=a*a+b*b;for(d=2;d<arguments.length;d++)e=Number(arguments[d]),f+=e*e;return Math.sqrt(f)};
$jscomp.math.trunc=function(a){a=Number(a);if(isNaN(a)||Infinity===a||-Infinity===a||0===a)return a;var b=Math.floor(Math.abs(a));return 0>a?-b:b};$jscomp.math.cbrt=function(a){if(0===a)return a;a=Number(a);var b=Math.pow(Math.abs(a),1/3);return 0>a?-b:b};$jscomp.number=$jscomp.number||{};$jscomp.number.isFinite=function(a){return"number"!==typeof a?!1:!isNaN(a)&&Infinity!==a&&-Infinity!==a};$jscomp.number.isInteger=function(a){return $jscomp.number.isFinite(a)?a===Math.floor(a):!1};
$jscomp.number.isNaN=function(a){return"number"===typeof a&&isNaN(a)};$jscomp.number.isSafeInteger=function(a){return $jscomp.number.isInteger(a)&&Math.abs(a)<=$jscomp.number.MAX_SAFE_INTEGER};$jscomp.number.EPSILON=function(){return Math.pow(2,-52)}();$jscomp.number.MAX_SAFE_INTEGER=function(){return 9007199254740991}();$jscomp.number.MIN_SAFE_INTEGER=function(){return-9007199254740991}();$jscomp.object=$jscomp.object||{};
$jscomp.object.assign=function(a,b){for(var c=1;c<arguments.length;c++){var d=arguments[c];if(d)for(var e in d)Object.prototype.hasOwnProperty.call(d,e)&&(a[e]=d[e])}return a};$jscomp.object.is=function(a,b){return a===b?0!==a||1/a===1/b:a!==a&&b!==b};$jscomp.ASSUME_NO_NATIVE_SET=!1;
$jscomp.Set$isConformant=function(){if($jscomp.ASSUME_NO_NATIVE_SET)return!1;var a=$jscomp.global.Set;if(!a||!a.prototype.entries||"function"!=typeof Object.seal)return!1;try{var b=Object.seal({x:4}),c=new a($jscomp.makeIterator([b]));if(!c.has(b)||1!=c.size||c.add(b)!=c||1!=c.size||c.add({x:4})!=c||2!=c.size)return!1;var d=c.entries(),e=d.next();if(e.done||e.value[0]!=b||e.value[1]!=b)return!1;e=d.next();return e.done||e.value[0]==b||4!=e.value[0].x||e.value[1]!=e.value[0]?!1:d.next().done}catch(f){return!1}};
$jscomp.Set=function(a){this.map_=new $jscomp.Map;if(a){a=$jscomp.makeIterator(a);for(var b;!(b=a.next()).done;)this.add(b.value)}this.size=this.map_.size};$jscomp.Set.prototype.add=function(a){this.map_.set(a,a);this.size=this.map_.size;return this};$jscomp.Set.prototype["delete"]=function(a){a=this.map_["delete"](a);this.size=this.map_.size;return a};$jscomp.Set.prototype.clear=function(){this.map_.clear();this.size=0};$jscomp.Set.prototype.has=function(a){return this.map_.has(a)};
$jscomp.Set.prototype.entries=function(){return this.map_.entries()};$jscomp.Set.prototype.values=function(){return this.map_.values()};$jscomp.Set.prototype.forEach=function(a,b){var c=this;this.map_.forEach(function(d){return a.call(b,d,d,c)})};$jscomp.Set$install=function(){$jscomp.Map$install();$jscomp.Set$isConformant()?$jscomp.Set=$jscomp.global.Set:($jscomp.initSymbol(),$jscomp.initSymbolIterator(),$jscomp.Set.prototype[Symbol.iterator]=$jscomp.Set.prototype.values,$jscomp.Set$install=function(){})};
$jscomp.string=$jscomp.string||{};$jscomp.checkStringArgs=function(a,b,c){if(null==a)throw new TypeError("The 'this' value for String.prototype."+c+" must not be null or undefined");if(b instanceof RegExp)throw new TypeError("First argument to String.prototype."+c+" must not be a regular expression");return a+""};
$jscomp.string.fromCodePoint=function(a){for(var b="",c=0;c<arguments.length;c++){var d=Number(arguments[c]);if(0>d||1114111<d||d!==Math.floor(d))throw new RangeError("invalid_code_point "+d);65535>=d?b+=String.fromCharCode(d):(d-=65536,b+=String.fromCharCode(d>>>10&1023|55296),b+=String.fromCharCode(d&1023|56320))}return b};
$jscomp.string.repeat=function(a){var b=$jscomp.checkStringArgs(this,null,"repeat");if(0>a||1342177279<a)throw new RangeError("Invalid count value");a|=0;for(var c="";a;)if(a&1&&(c+=b),a>>>=1)b+=b;return c};$jscomp.string.repeat$install=function(){String.prototype.repeat||(String.prototype.repeat=$jscomp.string.repeat)};
$jscomp.string.codePointAt=function(a){var b=$jscomp.checkStringArgs(this,null,"codePointAt"),c=b.length;a=Number(a)||0;if(0<=a&&a<c){a|=0;var d=b.charCodeAt(a);if(55296>d||56319<d||a+1===c)return d;a=b.charCodeAt(a+1);return 56320>a||57343<a?d:1024*(d-55296)+a+9216}};$jscomp.string.codePointAt$install=function(){String.prototype.codePointAt||(String.prototype.codePointAt=$jscomp.string.codePointAt)};
$jscomp.string.includes=function(a,b){return-1!==$jscomp.checkStringArgs(this,a,"includes").indexOf(a,b||0)};$jscomp.string.includes$install=function(){String.prototype.includes||(String.prototype.includes=$jscomp.string.includes)};$jscomp.string.startsWith=function(a,b){var c=$jscomp.checkStringArgs(this,a,"startsWith");a+="";for(var d=c.length,e=a.length,f=Math.max(0,Math.min(b|0,c.length)),g=0;g<e&&f<d;)if(c[f++]!=a[g++])return!1;return g>=e};
$jscomp.string.startsWith$install=function(){String.prototype.startsWith||(String.prototype.startsWith=$jscomp.string.startsWith)};$jscomp.string.endsWith=function(a,b){var c=$jscomp.checkStringArgs(this,a,"endsWith");a+="";void 0===b&&(b=c.length);for(var d=Math.max(0,Math.min(b|0,c.length)),e=a.length;0<e&&0<d;)if(c[--d]!=a[--e])return!1;return 0>=e};$jscomp.string.endsWith$install=function(){String.prototype.endsWith||(String.prototype.endsWith=$jscomp.string.endsWith)};
var COMPILED=!0,goog=goog||{};goog.global=this;goog.isDef=function(a){return void 0!==a};goog.exportPath_=function(a,b,c){a=a.split(".");c=c||goog.global;a[0]in c||!c.execScript||c.execScript("var "+a[0]);for(var d;a.length&&(d=a.shift());)!a.length&&goog.isDef(b)?c[d]=b:c=c[d]?c[d]:c[d]={}};
goog.define=function(a,b){var c=b;COMPILED||(goog.global.CLOSURE_UNCOMPILED_DEFINES&&Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES,a)?c=goog.global.CLOSURE_UNCOMPILED_DEFINES[a]:goog.global.CLOSURE_DEFINES&&Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES,a)&&(c=goog.global.CLOSURE_DEFINES[a]));goog.exportPath_(a,c)};goog.DEBUG=!0;goog.LOCALE="en";goog.TRUSTED_SITE=!0;goog.STRICT_MODE_COMPATIBLE=!1;goog.DISALLOW_TEST_ONLY_CODE=COMPILED&&!goog.DEBUG;
goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING=!1;goog.provide=function(a){if(!COMPILED&&goog.isProvided_(a))throw Error('Namespace "'+a+'" already declared.');goog.constructNamespace_(a)};goog.constructNamespace_=function(a,b){if(!COMPILED){delete goog.implicitNamespaces_[a];for(var c=a;(c=c.substring(0,c.lastIndexOf(".")))&&!goog.getObjectByName(c);)goog.implicitNamespaces_[c]=!0}goog.exportPath_(a,b)};goog.VALID_MODULE_RE_=/^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
goog.module=function(a){if(!goog.isString(a)||!a||-1==a.search(goog.VALID_MODULE_RE_))throw Error("Invalid module identifier");if(!goog.isInModuleLoader_())throw Error("Module "+a+" has been loaded incorrectly.");if(goog.moduleLoaderState_.moduleName)throw Error("goog.module may only be called once per module.");goog.moduleLoaderState_.moduleName=a;if(!COMPILED){if(goog.isProvided_(a))throw Error('Namespace "'+a+'" already declared.');delete goog.implicitNamespaces_[a]}};goog.module.get=function(a){return goog.module.getInternal_(a)};
goog.module.getInternal_=function(a){if(!COMPILED)return goog.isProvided_(a)?a in goog.loadedModules_?goog.loadedModules_[a]:goog.getObjectByName(a):null};goog.moduleLoaderState_=null;goog.isInModuleLoader_=function(){return null!=goog.moduleLoaderState_};
goog.module.declareLegacyNamespace=function(){if(!COMPILED&&!goog.isInModuleLoader_())throw Error("goog.module.declareLegacyNamespace must be called from within a goog.module");if(!COMPILED&&!goog.moduleLoaderState_.moduleName)throw Error("goog.module must be called prior to goog.module.declareLegacyNamespace.");goog.moduleLoaderState_.declareLegacyNamespace=!0};
goog.setTestOnly=function(a){if(goog.DISALLOW_TEST_ONLY_CODE)throw a=a||"",Error("Importing test-only code into non-debug environment"+(a?": "+a:"."));};goog.forwardDeclare=function(a){};COMPILED||(goog.isProvided_=function(a){return a in goog.loadedModules_||!goog.implicitNamespaces_[a]&&goog.isDefAndNotNull(goog.getObjectByName(a))},goog.implicitNamespaces_={"goog.module":!0});
goog.getObjectByName=function(a,b){for(var c=a.split("."),d=b||goog.global,e;e=c.shift();)if(goog.isDefAndNotNull(d[e]))d=d[e];else return null;return d};goog.globalize=function(a,b){var c=b||goog.global,d;for(d in a)c[d]=a[d]};goog.addDependency=function(a,b,c,d){if(goog.DEPENDENCIES_ENABLED){var e;a=a.replace(/\\/g,"/");for(var f=goog.dependencies_,g=0;e=b[g];g++)f.nameToPath[e]=a,f.pathIsModule[a]=!!d;for(d=0;b=c[d];d++)a in f.requires||(f.requires[a]={}),f.requires[a][b]=!0}};
goog.ENABLE_DEBUG_LOADER=!0;goog.logToConsole_=function(a){goog.global.console&&goog.global.console.error(a)};goog.require=function(a){if(!COMPILED){goog.ENABLE_DEBUG_LOADER&&goog.IS_OLD_IE_&&goog.maybeProcessDeferredDep_(a);if(goog.isProvided_(a))return goog.isInModuleLoader_()?goog.module.getInternal_(a):null;if(goog.ENABLE_DEBUG_LOADER){var b=goog.getPathFromDeps_(a);if(b)return goog.writeScripts_(b),null}a="goog.require could not find: "+a;goog.logToConsole_(a);throw Error(a);}};
goog.basePath="";goog.nullFunction=function(){};goog.abstractMethod=function(){throw Error("unimplemented abstract method");};goog.addSingletonGetter=function(a){a.getInstance=function(){if(a.instance_)return a.instance_;goog.DEBUG&&(goog.instantiatedSingletons_[goog.instantiatedSingletons_.length]=a);return a.instance_=new a}};goog.instantiatedSingletons_=[];goog.LOAD_MODULE_USING_EVAL=!0;goog.SEAL_MODULE_EXPORTS=goog.DEBUG;goog.loadedModules_={};goog.DEPENDENCIES_ENABLED=!COMPILED&&goog.ENABLE_DEBUG_LOADER;
goog.DEPENDENCIES_ENABLED&&(goog.dependencies_={pathIsModule:{},nameToPath:{},requires:{},visited:{},written:{},deferred:{}},goog.inHtmlDocument_=function(){var a=goog.global.document;return null!=a&&"write"in a},goog.findBasePath_=function(){if(goog.isDef(goog.global.CLOSURE_BASE_PATH))goog.basePath=goog.global.CLOSURE_BASE_PATH;else if(goog.inHtmlDocument_())for(var a=goog.global.document.getElementsByTagName("SCRIPT"),b=a.length-1;0<=b;--b){var c=a[b].src,d=c.lastIndexOf("?"),d=-1==d?c.length:
d;if("base.js"==c.substr(d-7,7)){goog.basePath=c.substr(0,d-7);break}}},goog.importScript_=function(a,b){(goog.global.CLOSURE_IMPORT_SCRIPT||goog.writeScriptTag_)(a,b)&&(goog.dependencies_.written[a]=!0)},goog.IS_OLD_IE_=!(goog.global.atob||!goog.global.document||!goog.global.document.all),goog.importModule_=function(a){goog.importScript_("",'goog.retrieveAndExecModule_("'+a+'");')&&(goog.dependencies_.written[a]=!0)},goog.queuedModules_=[],goog.wrapModule_=function(a,b){return goog.LOAD_MODULE_USING_EVAL&&
goog.isDef(goog.global.JSON)?"goog.loadModule("+goog.global.JSON.stringify(b+"\n//# sourceURL="+a+"\n")+");":'goog.loadModule(function(exports) {"use strict";'+b+"\n;return exports});\n//# sourceURL="+a+"\n"},goog.loadQueuedModules_=function(){var a=goog.queuedModules_.length;if(0<a){var b=goog.queuedModules_;goog.queuedModules_=[];for(var c=0;c<a;c++)goog.maybeProcessDeferredPath_(b[c])}},goog.maybeProcessDeferredDep_=function(a){goog.isDeferredModule_(a)&&goog.allDepsAreAvailable_(a)&&(a=goog.getPathFromDeps_(a),
goog.maybeProcessDeferredPath_(goog.basePath+a))},goog.isDeferredModule_=function(a){return(a=goog.getPathFromDeps_(a))&&goog.dependencies_.pathIsModule[a]?goog.basePath+a in goog.dependencies_.deferred:!1},goog.allDepsAreAvailable_=function(a){if((a=goog.getPathFromDeps_(a))&&a in goog.dependencies_.requires)for(var b in goog.dependencies_.requires[a])if(!goog.isProvided_(b)&&!goog.isDeferredModule_(b))return!1;return!0},goog.maybeProcessDeferredPath_=function(a){if(a in goog.dependencies_.deferred){var b=
goog.dependencies_.deferred[a];delete goog.dependencies_.deferred[a];goog.globalEval(b)}},goog.loadModuleFromUrl=function(a){goog.retrieveAndExecModule_(a)},goog.loadModule=function(a){var b=goog.moduleLoaderState_;try{goog.moduleLoaderState_={moduleName:void 0,declareLegacyNamespace:!1};var c;if(goog.isFunction(a))c=a.call(goog.global,{});else if(goog.isString(a))c=goog.loadModuleFromSource_.call(goog.global,a);else throw Error("Invalid module definition");var d=goog.moduleLoaderState_.moduleName;
if(!goog.isString(d)||!d)throw Error('Invalid module name "'+d+'"');goog.moduleLoaderState_.declareLegacyNamespace?goog.constructNamespace_(d,c):goog.SEAL_MODULE_EXPORTS&&Object.seal&&Object.seal(c);goog.loadedModules_[d]=c}finally{goog.moduleLoaderState_=b}},goog.loadModuleFromSource_=function(a){eval(a);return{}},goog.writeScriptSrcNode_=function(a){goog.global.document.write('<script type="text/javascript" src="'+a+'">\x3c/script>')},goog.appendScriptSrcNode_=function(a){var b=goog.global.document,
c=b.createElement("script");c.type="text/javascript";c.src=a;c.defer=!1;c.async=!1;b.head.appendChild(c)},goog.writeScriptTag_=function(a,b){if(goog.inHtmlDocument_()){var c=goog.global.document;if(!goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING&&"complete"==c.readyState){if(/\bdeps.js$/.test(a))return!1;throw Error('Cannot write "'+a+'" after document load');}var d=goog.IS_OLD_IE_;void 0===b?d?(d=" onreadystatechange='goog.onScriptLoad_(this, "+ ++goog.lastNonModuleScriptIndex_+")' ",c.write('<script type="text/javascript" src="'+
a+'"'+d+">\x3c/script>")):goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING?goog.appendScriptSrcNode_(a):goog.writeScriptSrcNode_(a):c.write('<script type="text/javascript">'+b+"\x3c/script>");return!0}return!1},goog.lastNonModuleScriptIndex_=0,goog.onScriptLoad_=function(a,b){"complete"==a.readyState&&goog.lastNonModuleScriptIndex_==b&&goog.loadQueuedModules_();return!0},goog.writeScripts_=function(a){function b(a){if(!(a in e.written||a in e.visited)){e.visited[a]=!0;if(a in e.requires)for(var f in e.requires[a])if(!goog.isProvided_(f))if(f in
e.nameToPath)b(e.nameToPath[f]);else throw Error("Undefined nameToPath for "+f);a in d||(d[a]=!0,c.push(a))}}var c=[],d={},e=goog.dependencies_;b(a);for(a=0;a<c.length;a++){var f=c[a];goog.dependencies_.written[f]=!0}var g=goog.moduleLoaderState_;goog.moduleLoaderState_=null;for(a=0;a<c.length;a++)if(f=c[a])e.pathIsModule[f]?goog.importModule_(goog.basePath+f):goog.importScript_(goog.basePath+f);else throw goog.moduleLoaderState_=g,Error("Undefined script input");goog.moduleLoaderState_=g},goog.getPathFromDeps_=
function(a){return a in goog.dependencies_.nameToPath?goog.dependencies_.nameToPath[a]:null},goog.findBasePath_(),goog.global.CLOSURE_NO_DEPS||goog.importScript_(goog.basePath+"deps.js"));goog.normalizePath_=function(a){a=a.split("/");for(var b=0;b<a.length;)"."==a[b]?a.splice(b,1):b&&".."==a[b]&&a[b-1]&&".."!=a[b-1]?a.splice(--b,2):b++;return a.join("/")};
goog.loadFileSync_=function(a){if(goog.global.CLOSURE_LOAD_FILE_SYNC)return goog.global.CLOSURE_LOAD_FILE_SYNC(a);var b=new goog.global.XMLHttpRequest;b.open("get",a,!1);b.send();return b.responseText};
goog.retrieveAndExecModule_=function(a){if(!COMPILED){var b=a;a=goog.normalizePath_(a);var c=goog.global.CLOSURE_IMPORT_SCRIPT||goog.writeScriptTag_,d=goog.loadFileSync_(a);if(null!=d)d=goog.wrapModule_(a,d),goog.IS_OLD_IE_?(goog.dependencies_.deferred[b]=d,goog.queuedModules_.push(b)):c(a,d);else throw Error("load of "+a+"failed");}};
goog.typeOf=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b};goog.isNull=function(a){return null===a};goog.isDefAndNotNull=function(a){return null!=a};goog.isArray=function(a){return"array"==goog.typeOf(a)};goog.isArrayLike=function(a){var b=goog.typeOf(a);return"array"==b||"object"==b&&"number"==typeof a.length};goog.isDateLike=function(a){return goog.isObject(a)&&"function"==typeof a.getFullYear};goog.isString=function(a){return"string"==typeof a};
goog.isBoolean=function(a){return"boolean"==typeof a};goog.isNumber=function(a){return"number"==typeof a};goog.isFunction=function(a){return"function"==goog.typeOf(a)};goog.isObject=function(a){var b=typeof a;return"object"==b&&null!=a||"function"==b};goog.getUid=function(a){return a[goog.UID_PROPERTY_]||(a[goog.UID_PROPERTY_]=++goog.uidCounter_)};goog.hasUid=function(a){return!!a[goog.UID_PROPERTY_]};
goog.removeUid=function(a){null!==a&&"removeAttribute"in a&&a.removeAttribute(goog.UID_PROPERTY_);try{delete a[goog.UID_PROPERTY_]}catch(b){}};goog.UID_PROPERTY_="closure_uid_"+(1E9*Math.random()>>>0);goog.uidCounter_=0;goog.getHashCode=goog.getUid;goog.removeHashCode=goog.removeUid;goog.cloneObject=function(a){var b=goog.typeOf(a);if("object"==b||"array"==b){if(a.clone)return a.clone();var b="array"==b?[]:{},c;for(c in a)b[c]=goog.cloneObject(a[c]);return b}return a};
goog.bindNative_=function(a,b,c){return a.call.apply(a.bind,arguments)};goog.bindJs_=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}};
goog.bind=function(a,b,c){Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?goog.bind=goog.bindNative_:goog.bind=goog.bindJs_;return goog.bind.apply(null,arguments)};goog.partial=function(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}};goog.mixin=function(a,b){for(var c in b)a[c]=b[c]};goog.now=goog.TRUSTED_SITE&&Date.now||function(){return+new Date};
goog.globalEval=function(a){if(goog.global.execScript)goog.global.execScript(a,"JavaScript");else if(goog.global.eval){if(null==goog.evalWorksForGlobals_)if(goog.global.eval("var _evalTest_ = 1;"),"undefined"!=typeof goog.global._evalTest_){try{delete goog.global._evalTest_}catch(d){}goog.evalWorksForGlobals_=!0}else goog.evalWorksForGlobals_=!1;if(goog.evalWorksForGlobals_)goog.global.eval(a);else{var b=goog.global.document,c=b.createElement("SCRIPT");c.type="text/javascript";c.defer=!1;c.appendChild(b.createTextNode(a));
b.body.appendChild(c);b.body.removeChild(c)}}else throw Error("goog.globalEval not available");};goog.evalWorksForGlobals_=null;goog.getCssName=function(a,b){var c=function(a){return goog.cssNameMapping_[a]||a},d=function(a){a=a.split("-");for(var b=[],d=0;d<a.length;d++)b.push(c(a[d]));return b.join("-")},d=goog.cssNameMapping_?"BY_WHOLE"==goog.cssNameMappingStyle_?c:d:function(a){return a};return b?a+"-"+d(b):d(a)};
goog.setCssNameMapping=function(a,b){goog.cssNameMapping_=a;goog.cssNameMappingStyle_=b};!COMPILED&&goog.global.CLOSURE_CSS_NAME_MAPPING&&(goog.cssNameMapping_=goog.global.CLOSURE_CSS_NAME_MAPPING);goog.getMsg=function(a,b){b&&(a=a.replace(/\{\$([^}]+)}/g,function(a,d){return null!=b&&d in b?b[d]:a}));return a};goog.getMsgWithFallback=function(a,b){return a};goog.exportSymbol=function(a,b,c){goog.exportPath_(a,b,c)};goog.exportProperty=function(a,b,c){a[b]=c};
goog.inherits=function(a,b){function c(){}c.prototype=b.prototype;a.superClass_=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.base=function(a,c,f){for(var g=Array(arguments.length-2),h=2;h<arguments.length;h++)g[h-2]=arguments[h];return b.prototype[c].apply(a,g)}};
goog.base=function(a,b,c){var d=arguments.callee.caller;if(goog.STRICT_MODE_COMPATIBLE||goog.DEBUG&&!d)throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");if(d.superClass_){for(var e=Array(arguments.length-1),f=1;f<arguments.length;f++)e[f-1]=arguments[f];return d.superClass_.constructor.apply(a,e)}e=Array(arguments.length-2);for(f=2;f<arguments.length;f++)e[f-2]=arguments[f];for(var f=!1,g=a.constructor;g;g=
g.superClass_&&g.superClass_.constructor)if(g.prototype[b]===d)f=!0;else if(f)return g.prototype[b].apply(a,e);if(a[b]===d)return a.constructor.prototype[b].apply(a,e);throw Error("goog.base called from a method of one name to a method of a different name");};goog.scope=function(a){a.call(goog.global)};COMPILED||(goog.global.COMPILED=COMPILED);
goog.defineClass=function(a,b){var c=b.constructor,d=b.statics;c&&c!=Object.prototype.constructor||(c=function(){throw Error("cannot instantiate an interface (no constructor defined).");});c=goog.defineClass.createSealingConstructor_(c,a);a&&goog.inherits(c,a);delete b.constructor;delete b.statics;goog.defineClass.applyProperties_(c.prototype,b);null!=d&&(d instanceof Function?d(c):goog.defineClass.applyProperties_(c,d));return c};goog.defineClass.SEAL_CLASS_INSTANCES=goog.DEBUG;
goog.defineClass.createSealingConstructor_=function(a,b){if(goog.defineClass.SEAL_CLASS_INSTANCES&&Object.seal instanceof Function){if(b&&b.prototype&&b.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_])return a;var c=function(){var b=a.apply(this,arguments)||this;b[goog.UID_PROPERTY_]=b[goog.UID_PROPERTY_];this.constructor===c&&Object.seal(b);return b};return c}return a};goog.defineClass.OBJECT_PROTOTYPE_FIELDS_="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.defineClass.applyProperties_=function(a,b){for(var c in b)Object.prototype.hasOwnProperty.call(b,c)&&(a[c]=b[c]);for(var d=0;d<goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;d++)c=goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[d],Object.prototype.hasOwnProperty.call(b,c)&&(a[c]=b[c])};goog.tagUnsealableClass=function(a){!COMPILED&&goog.defineClass.SEAL_CLASS_INSTANCES&&(a.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]=!0)};goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_="goog_defineClass_legacy_unsealable";goog.dom={};goog.dom.NodeType={ELEMENT:1,ATTRIBUTE:2,TEXT:3,CDATA_SECTION:4,ENTITY_REFERENCE:5,ENTITY:6,PROCESSING_INSTRUCTION:7,COMMENT:8,DOCUMENT:9,DOCUMENT_TYPE:10,DOCUMENT_FRAGMENT:11,NOTATION:12};goog.debug={};goog.debug.Error=function(a){if(Error.captureStackTrace)Error.captureStackTrace(this,goog.debug.Error);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a));this.reportErrorToServer=!0};goog.inherits(goog.debug.Error,Error);goog.debug.Error.prototype.name="CustomError";goog.string={};goog.string.DETECT_DOUBLE_ESCAPING=!1;goog.string.FORCE_NON_DOM_HTML_UNESCAPING=!1;goog.string.Unicode={NBSP:"\u00a0"};goog.string.startsWith=function(a,b){return 0==a.lastIndexOf(b,0)};goog.string.endsWith=function(a,b){var c=a.length-b.length;return 0<=c&&a.indexOf(b,c)==c};goog.string.caseInsensitiveStartsWith=function(a,b){return 0==goog.string.caseInsensitiveCompare(b,a.substr(0,b.length))};
goog.string.caseInsensitiveEndsWith=function(a,b){return 0==goog.string.caseInsensitiveCompare(b,a.substr(a.length-b.length,b.length))};goog.string.caseInsensitiveEquals=function(a,b){return a.toLowerCase()==b.toLowerCase()};goog.string.subs=function(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")};goog.string.collapseWhitespace=function(a){return a.replace(/[\s\xa0]+/g," ").replace(/^\s+|\s+$/g,"")};
goog.string.isEmptyOrWhitespace=function(a){return/^[\s\xa0]*$/.test(a)};goog.string.isEmptyString=function(a){return 0==a.length};goog.string.isEmpty=goog.string.isEmptyOrWhitespace;goog.string.isEmptyOrWhitespaceSafe=function(a){return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(a))};goog.string.isEmptySafe=goog.string.isEmptyOrWhitespaceSafe;goog.string.isBreakingWhitespace=function(a){return!/[^\t\n\r ]/.test(a)};goog.string.isAlpha=function(a){return!/[^a-zA-Z]/.test(a)};
goog.string.isNumeric=function(a){return!/[^0-9]/.test(a)};goog.string.isAlphaNumeric=function(a){return!/[^a-zA-Z0-9]/.test(a)};goog.string.isSpace=function(a){return" "==a};goog.string.isUnicodeChar=function(a){return 1==a.length&&" "<=a&&"~">=a||"\u0080"<=a&&"\ufffd">=a};goog.string.stripNewlines=function(a){return a.replace(/(\r\n|\r|\n)+/g," ")};goog.string.canonicalizeNewlines=function(a){return a.replace(/(\r\n|\r|\n)/g,"\n")};
goog.string.normalizeWhitespace=function(a){return a.replace(/\xa0|\s/g," ")};goog.string.normalizeSpaces=function(a){return a.replace(/\xa0|[ \t]+/g," ")};goog.string.collapseBreakingSpaces=function(a){return a.replace(/[\t\r\n ]+/g," ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g,"")};goog.string.trim=goog.TRUSTED_SITE&&String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};goog.string.trimLeft=function(a){return a.replace(/^[\s\xa0]+/,"")};
goog.string.trimRight=function(a){return a.replace(/[\s\xa0]+$/,"")};goog.string.caseInsensitiveCompare=function(a,b){var c=String(a).toLowerCase(),d=String(b).toLowerCase();return c<d?-1:c==d?0:1};
goog.string.numberAwareCompare_=function(a,b,c){if(a==b)return 0;if(!a)return-1;if(!b)return 1;for(var d=a.toLowerCase().match(c),e=b.toLowerCase().match(c),f=Math.min(d.length,e.length),g=0;g<f;g++){c=d[g];var h=e[g];if(c!=h)return a=parseInt(c,10),!isNaN(a)&&(b=parseInt(h,10),!isNaN(b)&&a-b)?a-b:c<h?-1:1}return d.length!=e.length?d.length-e.length:a<b?-1:1};goog.string.intAwareCompare=function(a,b){return goog.string.numberAwareCompare_(a,b,/\d+|\D+/g)};
goog.string.floatAwareCompare=function(a,b){return goog.string.numberAwareCompare_(a,b,/\d+|\.\d+|\D+/g)};goog.string.numerateCompare=goog.string.floatAwareCompare;goog.string.urlEncode=function(a){return encodeURIComponent(String(a))};goog.string.urlDecode=function(a){return decodeURIComponent(a.replace(/\+/g," "))};goog.string.newLineToBr=function(a,b){return a.replace(/(\r\n|\r|\n)/g,b?"<br />":"<br>")};
goog.string.htmlEscape=function(a,b){if(b)a=a.replace(goog.string.AMP_RE_,"&amp;").replace(goog.string.LT_RE_,"&lt;").replace(goog.string.GT_RE_,"&gt;").replace(goog.string.QUOT_RE_,"&quot;").replace(goog.string.SINGLE_QUOTE_RE_,"&#39;").replace(goog.string.NULL_RE_,"&#0;"),goog.string.DETECT_DOUBLE_ESCAPING&&(a=a.replace(goog.string.E_RE_,"&#101;"));else{if(!goog.string.ALL_RE_.test(a))return a;-1!=a.indexOf("&")&&(a=a.replace(goog.string.AMP_RE_,"&amp;"));-1!=a.indexOf("<")&&(a=a.replace(goog.string.LT_RE_,
"&lt;"));-1!=a.indexOf(">")&&(a=a.replace(goog.string.GT_RE_,"&gt;"));-1!=a.indexOf('"')&&(a=a.replace(goog.string.QUOT_RE_,"&quot;"));-1!=a.indexOf("'")&&(a=a.replace(goog.string.SINGLE_QUOTE_RE_,"&#39;"));-1!=a.indexOf("\x00")&&(a=a.replace(goog.string.NULL_RE_,"&#0;"));goog.string.DETECT_DOUBLE_ESCAPING&&-1!=a.indexOf("e")&&(a=a.replace(goog.string.E_RE_,"&#101;"))}return a};goog.string.AMP_RE_=/&/g;goog.string.LT_RE_=/</g;goog.string.GT_RE_=/>/g;goog.string.QUOT_RE_=/"/g;
goog.string.SINGLE_QUOTE_RE_=/'/g;goog.string.NULL_RE_=/\x00/g;goog.string.E_RE_=/e/g;goog.string.ALL_RE_=goog.string.DETECT_DOUBLE_ESCAPING?/[\x00&<>"'e]/:/[\x00&<>"']/;goog.string.unescapeEntities=function(a){return goog.string.contains(a,"&")?!goog.string.FORCE_NON_DOM_HTML_UNESCAPING&&"document"in goog.global?goog.string.unescapeEntitiesUsingDom_(a):goog.string.unescapePureXmlEntities_(a):a};
goog.string.unescapeEntitiesWithDocument=function(a,b){return goog.string.contains(a,"&")?goog.string.unescapeEntitiesUsingDom_(a,b):a};
goog.string.unescapeEntitiesUsingDom_=function(a,b){var c={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"'},d;d=b?b.createElement("div"):goog.global.document.createElement("div");return a.replace(goog.string.HTML_ENTITY_PATTERN_,function(a,b){var g=c[a];if(g)return g;if("#"==b.charAt(0)){var h=Number("0"+b.substr(1));isNaN(h)||(g=String.fromCharCode(h))}g||(d.innerHTML=a+" ",g=d.firstChild.nodeValue.slice(0,-1));return c[a]=g})};
goog.string.unescapePureXmlEntities_=function(a){return a.replace(/&([^;]+);/g,function(a,c){switch(c){case "amp":return"&";case "lt":return"<";case "gt":return">";case "quot":return'"';default:if("#"==c.charAt(0)){var d=Number("0"+c.substr(1));if(!isNaN(d))return String.fromCharCode(d)}return a}})};goog.string.HTML_ENTITY_PATTERN_=/&([^;\s<&]+);?/g;goog.string.whitespaceEscape=function(a,b){return goog.string.newLineToBr(a.replace(/  /g," &#160;"),b)};
goog.string.preserveSpaces=function(a){return a.replace(/(^|[\n ]) /g,"$1"+goog.string.Unicode.NBSP)};goog.string.stripQuotes=function(a,b){for(var c=b.length,d=0;d<c;d++){var e=1==c?b:b.charAt(d);if(a.charAt(0)==e&&a.charAt(a.length-1)==e)return a.substring(1,a.length-1)}return a};goog.string.truncate=function(a,b,c){c&&(a=goog.string.unescapeEntities(a));a.length>b&&(a=a.substring(0,b-3)+"...");c&&(a=goog.string.htmlEscape(a));return a};
goog.string.truncateMiddle=function(a,b,c,d){c&&(a=goog.string.unescapeEntities(a));if(d&&a.length>b){d>b&&(d=b);var e=a.length-d;a=a.substring(0,b-d)+"..."+a.substring(e)}else a.length>b&&(d=Math.floor(b/2),e=a.length-d,a=a.substring(0,d+b%2)+"..."+a.substring(e));c&&(a=goog.string.htmlEscape(a));return a};goog.string.specialEscapeChars_={"\x00":"\\0","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\x0B",'"':'\\"',"\\":"\\\\","<":"<"};goog.string.jsEscapeCache_={"'":"\\'"};
goog.string.quote=function(a){a=String(a);for(var b=['"'],c=0;c<a.length;c++){var d=a.charAt(c),e=d.charCodeAt(0);b[c+1]=goog.string.specialEscapeChars_[d]||(31<e&&127>e?d:goog.string.escapeChar(d))}b.push('"');return b.join("")};goog.string.escapeString=function(a){for(var b=[],c=0;c<a.length;c++)b[c]=goog.string.escapeChar(a.charAt(c));return b.join("")};
goog.string.escapeChar=function(a){if(a in goog.string.jsEscapeCache_)return goog.string.jsEscapeCache_[a];if(a in goog.string.specialEscapeChars_)return goog.string.jsEscapeCache_[a]=goog.string.specialEscapeChars_[a];var b,c=a.charCodeAt(0);if(31<c&&127>c)b=a;else{if(256>c){if(b="\\x",16>c||256<c)b+="0"}else b="\\u",4096>c&&(b+="0");b+=c.toString(16).toUpperCase()}return goog.string.jsEscapeCache_[a]=b};goog.string.contains=function(a,b){return-1!=a.indexOf(b)};
goog.string.caseInsensitiveContains=function(a,b){return goog.string.contains(a.toLowerCase(),b.toLowerCase())};goog.string.countOf=function(a,b){return a&&b?a.split(b).length-1:0};goog.string.removeAt=function(a,b,c){var d=a;0<=b&&b<a.length&&0<c&&(d=a.substr(0,b)+a.substr(b+c,a.length-b-c));return d};goog.string.remove=function(a,b){var c=new RegExp(goog.string.regExpEscape(b),"");return a.replace(c,"")};
goog.string.removeAll=function(a,b){var c=new RegExp(goog.string.regExpEscape(b),"g");return a.replace(c,"")};goog.string.regExpEscape=function(a){return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08")};goog.string.repeat=String.prototype.repeat?function(a,b){return a.repeat(b)}:function(a,b){return Array(b+1).join(a)};
goog.string.padNumber=function(a,b,c){a=goog.isDef(c)?a.toFixed(c):String(a);c=a.indexOf(".");-1==c&&(c=a.length);return goog.string.repeat("0",Math.max(0,b-c))+a};goog.string.makeSafe=function(a){return null==a?"":String(a)};goog.string.buildString=function(a){return Array.prototype.join.call(arguments,"")};goog.string.getRandomString=function(){return Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^goog.now()).toString(36)};
goog.string.compareVersions=function(a,b){for(var c=0,d=goog.string.trim(String(a)).split("."),e=goog.string.trim(String(b)).split("."),f=Math.max(d.length,e.length),g=0;0==c&&g<f;g++){var h=d[g]||"",k=e[g]||"",l=RegExp("(\\d*)(\\D*)","g"),p=RegExp("(\\d*)(\\D*)","g");do{var m=l.exec(h)||["","",""],n=p.exec(k)||["","",""];if(0==m[0].length&&0==n[0].length)break;var c=0==m[1].length?0:parseInt(m[1],10),q=0==n[1].length?0:parseInt(n[1],10),c=goog.string.compareElements_(c,q)||goog.string.compareElements_(0==
m[2].length,0==n[2].length)||goog.string.compareElements_(m[2],n[2])}while(0==c)}return c};goog.string.compareElements_=function(a,b){return a<b?-1:a>b?1:0};goog.string.hashCode=function(a){for(var b=0,c=0;c<a.length;++c)b=31*b+a.charCodeAt(c)>>>0;return b};goog.string.uniqueStringCounter_=2147483648*Math.random()|0;goog.string.createUniqueString=function(){return"goog_"+goog.string.uniqueStringCounter_++};
goog.string.toNumber=function(a){var b=Number(a);return 0==b&&goog.string.isEmptyOrWhitespace(a)?NaN:b};goog.string.isLowerCamelCase=function(a){return/^[a-z]+([A-Z][a-z]*)*$/.test(a)};goog.string.isUpperCamelCase=function(a){return/^([A-Z][a-z]*)+$/.test(a)};goog.string.toCamelCase=function(a){return String(a).replace(/\-([a-z])/g,function(a,c){return c.toUpperCase()})};goog.string.toSelectorCase=function(a){return String(a).replace(/([A-Z])/g,"-$1").toLowerCase()};
goog.string.toTitleCase=function(a,b){var c=goog.isString(b)?goog.string.regExpEscape(b):"\\s";return a.replace(new RegExp("(^"+(c?"|["+c+"]+":"")+")([a-z])","g"),function(a,b,c){return b+c.toUpperCase()})};goog.string.capitalize=function(a){return String(a.charAt(0)).toUpperCase()+String(a.substr(1)).toLowerCase()};goog.string.parseInt=function(a){isFinite(a)&&(a=String(a));return goog.isString(a)?/^\s*-?0x/i.test(a)?parseInt(a,16):parseInt(a,10):NaN};
goog.string.splitLimit=function(a,b,c){a=a.split(b);for(var d=[];0<c&&a.length;)d.push(a.shift()),c--;a.length&&d.push(a.join(b));return d};goog.string.editDistance=function(a,b){var c=[],d=[];if(a==b)return 0;if(!a.length||!b.length)return Math.max(a.length,b.length);for(var e=0;e<b.length+1;e++)c[e]=e;for(e=0;e<a.length;e++){d[0]=e+1;for(var f=0;f<b.length;f++)d[f+1]=Math.min(d[f]+1,c[f+1]+1,c[f]+Number(a[e]!=b[f]));for(f=0;f<c.length;f++)c[f]=d[f]}return d[b.length]};goog.asserts={};goog.asserts.ENABLE_ASSERTS=goog.DEBUG;goog.asserts.AssertionError=function(a,b){b.unshift(a);goog.debug.Error.call(this,goog.string.subs.apply(null,b));b.shift();this.messagePattern=a};goog.inherits(goog.asserts.AssertionError,goog.debug.Error);goog.asserts.AssertionError.prototype.name="AssertionError";goog.asserts.DEFAULT_ERROR_HANDLER=function(a){throw a;};goog.asserts.errorHandler_=goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.doAssertFailure_=function(a,b,c,d){var e="Assertion failed";if(c)var e=e+(": "+c),f=d;else a&&(e+=": "+a,f=b);a=new goog.asserts.AssertionError(""+e,f||[]);goog.asserts.errorHandler_(a)};goog.asserts.setErrorHandler=function(a){goog.asserts.ENABLE_ASSERTS&&(goog.asserts.errorHandler_=a)};goog.asserts.assert=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!a&&goog.asserts.doAssertFailure_("",null,b,Array.prototype.slice.call(arguments,2));return a};
goog.asserts.fail=function(a,b){goog.asserts.ENABLE_ASSERTS&&goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1)))};goog.asserts.assertNumber=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isNumber(a)&&goog.asserts.doAssertFailure_("Expected number but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};
goog.asserts.assertString=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isString(a)&&goog.asserts.doAssertFailure_("Expected string but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};goog.asserts.assertFunction=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isFunction(a)&&goog.asserts.doAssertFailure_("Expected function but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};
goog.asserts.assertObject=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isObject(a)&&goog.asserts.doAssertFailure_("Expected object but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};goog.asserts.assertArray=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isArray(a)&&goog.asserts.doAssertFailure_("Expected array but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};
goog.asserts.assertBoolean=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isBoolean(a)&&goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};goog.asserts.assertElement=function(a,b,c){!goog.asserts.ENABLE_ASSERTS||goog.isObject(a)&&a.nodeType==goog.dom.NodeType.ELEMENT||goog.asserts.doAssertFailure_("Expected Element but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};
goog.asserts.assertInstanceof=function(a,b,c,d){!goog.asserts.ENABLE_ASSERTS||a instanceof b||goog.asserts.doAssertFailure_("Expected instanceof %s but got %s.",[goog.asserts.getType_(b),goog.asserts.getType_(a)],c,Array.prototype.slice.call(arguments,3));return a};goog.asserts.assertObjectPrototypeIsIntact=function(){for(var a in Object.prototype)goog.asserts.fail(a+" should not be enumerable in Object.prototype.")};
goog.asserts.getType_=function(a){return a instanceof Function?a.displayName||a.name||"unknown type name":a instanceof Object?a.constructor.displayName||a.constructor.name||Object.prototype.toString.call(a):null===a?"null":typeof a};var jspb={Map:function(a,b){this.arr_=a;this.valueCtor_=b;this.map_={};this.arrClean=!0;0<this.arr_.length&&this.loadFromArray_()}};jspb.Map.prototype.loadFromArray_=function(){for(var a=0;a<this.arr_.length;a++){var b=this.arr_[a],c=b[0];this.map_[c.toString()]=new jspb.Map.Entry_(c,b[1])}this.arrClean=!0};
jspb.Map.prototype.toArray=function(){if(this.arrClean){if(this.valueCtor_){var a=this.map_,b;for(b in a)if(Object.prototype.hasOwnProperty.call(a,b)){var c=a[b].valueWrapper;c&&c.toArray()}}}else{this.arr_.length=0;a=this.stringKeys_();a.sort();for(b=0;b<a.length;b++){var d=this.map_[a[b]];(c=d.valueWrapper)&&c.toArray();this.arr_.push([d.key,d.value])}this.arrClean=!0}return this.arr_};
jspb.Map.prototype.toObject=function(a,b){for(var c=this.toArray(),d=[],e=0;e<c.length;e++){var f=this.map_[c[e][0].toString()];this.wrapEntry_(f);var g=f.valueWrapper;g?(goog.asserts.assert(b),d.push([f.key,b(a,g)])):d.push([f.key,f.value])}return d};jspb.Map.fromObject=function(a,b,c){b=new jspb.Map([],b);for(var d=0;d<a.length;d++){var e=a[d][0],f=c(a[d][1]);b.set(e,f)}return b};jspb.Map.ArrayIteratorIterable_=function(a){this.idx_=0;this.arr_=a};
jspb.Map.ArrayIteratorIterable_.prototype.next=function(){return this.idx_<this.arr_.length?{done:!1,value:this.arr_[this.idx_++]}:{done:!0,value:void 0}};$jscomp.initSymbol();"undefined"!=typeof Symbol&&($jscomp.initSymbol(),$jscomp.initSymbolIterator(),jspb.Map.ArrayIteratorIterable_.prototype[Symbol.iterator]=function(){return this});jspb.Map.prototype.getLength=function(){return this.stringKeys_().length};jspb.Map.prototype.clear=function(){this.map_={};this.arrClean=!1};
jspb.Map.prototype.del=function(a){a=a.toString();var b=this.map_.hasOwnProperty(a);delete this.map_[a];this.arrClean=!1;return b};jspb.Map.prototype.getEntryList=function(){var a=[],b=this.stringKeys_();b.sort();for(var c=0;c<b.length;c++){var d=this.map_[b[c]];a.push([d.key,d.value])}return a};jspb.Map.prototype.entries=function(){var a=[],b=this.stringKeys_();b.sort();for(var c=0;c<b.length;c++){var d=this.map_[b[c]];a.push([d.key,this.wrapEntry_(d)])}return new jspb.Map.ArrayIteratorIterable_(a)};
jspb.Map.prototype.keys=function(){var a=[],b=this.stringKeys_();b.sort();for(var c=0;c<b.length;c++)a.push(this.map_[b[c]].key);return new jspb.Map.ArrayIteratorIterable_(a)};jspb.Map.prototype.values=function(){var a=[],b=this.stringKeys_();b.sort();for(var c=0;c<b.length;c++)a.push(this.wrapEntry_(this.map_[b[c]]));return new jspb.Map.ArrayIteratorIterable_(a)};
jspb.Map.prototype.forEach=function(a,b){var c=this.stringKeys_();c.sort();for(var d=0;d<c.length;d++){var e=this.map_[c[d]];a.call(b,this.wrapEntry_(e),e.key,this)}};jspb.Map.prototype.set=function(a,b){var c=new jspb.Map.Entry_(a);this.valueCtor_?(c.valueWrapper=b,c.value=b.toArray()):c.value=b;this.map_[a.toString()]=c;this.arrClean=!1;return this};jspb.Map.prototype.wrapEntry_=function(a){return this.valueCtor_?(a.valueWrapper||(a.valueWrapper=new this.valueCtor_(a.value)),a.valueWrapper):a.value};
jspb.Map.prototype.get=function(a){if(a=this.map_[a.toString()])return this.wrapEntry_(a)};jspb.Map.prototype.has=function(a){return a.toString()in this.map_};jspb.Map.prototype.serializeBinary=function(a,b,c,d,e){var f=this.stringKeys_();f.sort();for(var g=0;g<f.length;g++){var h=this.map_[f[g]];b.beginSubMessage(a);c.call(b,1,h.key);this.valueCtor_?d.call(b,2,this.wrapEntry_(h),e):d.call(b,2,h.value);b.endSubMessage()}};
jspb.Map.deserializeBinary=function(a,b,c,d,e){for(var f=void 0,g=void 0;b.nextField()&&!b.isEndGroup();){var h=b.getFieldNumber();1==h?f=c.call(b):2==h&&(a.valueCtor_?(g=new a.valueCtor_,d.call(b,g,e)):g=d.call(b))}goog.asserts.assert(void 0!=f);goog.asserts.assert(void 0!=g);a.set(f,g)};jspb.Map.prototype.stringKeys_=function(){var a=this.map_,b=[],c;for(c in a)Object.prototype.hasOwnProperty.call(a,c)&&b.push(c);return b};
jspb.Map.Entry_=function(a,b){this.key=a;this.value=b;this.valueWrapper=void 0};goog.array={};goog.NATIVE_ARRAY_PROTOTYPES=goog.TRUSTED_SITE;goog.array.ASSUME_NATIVE_FUNCTIONS=!1;goog.array.peek=function(a){return a[a.length-1]};goog.array.last=goog.array.peek;
goog.array.indexOf=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.indexOf)?function(a,b,c){goog.asserts.assert(null!=a.length);return Array.prototype.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(goog.isString(a))return goog.isString(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1};
goog.array.lastIndexOf=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.lastIndexOf)?function(a,b,c){goog.asserts.assert(null!=a.length);return Array.prototype.lastIndexOf.call(a,b,null==c?a.length-1:c)}:function(a,b,c){c=null==c?a.length-1:c;0>c&&(c=Math.max(0,a.length+c));if(goog.isString(a))return goog.isString(b)&&1==b.length?a.lastIndexOf(b,c):-1;for(;0<=c;c--)if(c in a&&a[c]===b)return c;return-1};
goog.array.forEach=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.forEach)?function(a,b,c){goog.asserts.assert(null!=a.length);Array.prototype.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=goog.isString(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)};goog.array.forEachRight=function(a,b,c){for(var d=a.length,e=goog.isString(a)?a.split(""):a,d=d-1;0<=d;--d)d in e&&b.call(c,e[d],d,a)};
goog.array.filter=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.filter)?function(a,b,c){goog.asserts.assert(null!=a.length);return Array.prototype.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,g=goog.isString(a)?a.split(""):a,h=0;h<d;h++)if(h in g){var k=g[h];b.call(c,k,h,a)&&(e[f++]=k)}return e};
goog.array.map=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.map)?function(a,b,c){goog.asserts.assert(null!=a.length);return Array.prototype.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=goog.isString(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e};
goog.array.reduce=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.reduce)?function(a,b,c,d){goog.asserts.assert(null!=a.length);d&&(b=goog.bind(b,d));return Array.prototype.reduce.call(a,b,c)}:function(a,b,c,d){var e=c;goog.array.forEach(a,function(c,g){e=b.call(d,e,c,g,a)});return e};
goog.array.reduceRight=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.reduceRight)?function(a,b,c,d){goog.asserts.assert(null!=a.length);goog.asserts.assert(null!=b);d&&(b=goog.bind(b,d));return Array.prototype.reduceRight.call(a,b,c)}:function(a,b,c,d){var e=c;goog.array.forEachRight(a,function(c,g){e=b.call(d,e,c,g,a)});return e};
goog.array.some=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.some)?function(a,b,c){goog.asserts.assert(null!=a.length);return Array.prototype.some.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=goog.isString(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return!0;return!1};
goog.array.every=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.every)?function(a,b,c){goog.asserts.assert(null!=a.length);return Array.prototype.every.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=goog.isString(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&!b.call(c,e[f],f,a))return!1;return!0};goog.array.count=function(a,b,c){var d=0;goog.array.forEach(a,function(a,f,g){b.call(c,a,f,g)&&++d},c);return d};
goog.array.find=function(a,b,c){b=goog.array.findIndex(a,b,c);return 0>b?null:goog.isString(a)?a.charAt(b):a[b]};goog.array.findIndex=function(a,b,c){for(var d=a.length,e=goog.isString(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return f;return-1};goog.array.findRight=function(a,b,c){b=goog.array.findIndexRight(a,b,c);return 0>b?null:goog.isString(a)?a.charAt(b):a[b]};
goog.array.findIndexRight=function(a,b,c){for(var d=a.length,e=goog.isString(a)?a.split(""):a,d=d-1;0<=d;d--)if(d in e&&b.call(c,e[d],d,a))return d;return-1};goog.array.contains=function(a,b){return 0<=goog.array.indexOf(a,b)};goog.array.isEmpty=function(a){return 0==a.length};goog.array.clear=function(a){if(!goog.isArray(a))for(var b=a.length-1;0<=b;b--)delete a[b];a.length=0};goog.array.insert=function(a,b){goog.array.contains(a,b)||a.push(b)};
goog.array.insertAt=function(a,b,c){goog.array.splice(a,c,0,b)};goog.array.insertArrayAt=function(a,b,c){goog.partial(goog.array.splice,a,c,0).apply(null,b)};goog.array.insertBefore=function(a,b,c){var d;2==arguments.length||0>(d=goog.array.indexOf(a,c))?a.push(b):goog.array.insertAt(a,b,d)};goog.array.remove=function(a,b){var c=goog.array.indexOf(a,b),d;(d=0<=c)&&goog.array.removeAt(a,c);return d};
goog.array.removeAt=function(a,b){goog.asserts.assert(null!=a.length);return 1==Array.prototype.splice.call(a,b,1).length};goog.array.removeIf=function(a,b,c){b=goog.array.findIndex(a,b,c);return 0<=b?(goog.array.removeAt(a,b),!0):!1};goog.array.removeAllIf=function(a,b,c){var d=0;goog.array.forEachRight(a,function(e,f){b.call(c,e,f,a)&&goog.array.removeAt(a,f)&&d++});return d};goog.array.concat=function(a){return Array.prototype.concat.apply(Array.prototype,arguments)};
goog.array.join=function(a){return Array.prototype.concat.apply(Array.prototype,arguments)};goog.array.toArray=function(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]};goog.array.clone=goog.array.toArray;goog.array.extend=function(a,b){for(var c=1;c<arguments.length;c++){var d=arguments[c];if(goog.isArrayLike(d)){var e=a.length||0,f=d.length||0;a.length=e+f;for(var g=0;g<f;g++)a[e+g]=d[g]}else a.push(d)}};
goog.array.splice=function(a,b,c,d){goog.asserts.assert(null!=a.length);return Array.prototype.splice.apply(a,goog.array.slice(arguments,1))};goog.array.slice=function(a,b,c){goog.asserts.assert(null!=a.length);return 2>=arguments.length?Array.prototype.slice.call(a,b):Array.prototype.slice.call(a,b,c)};
goog.array.removeDuplicates=function(a,b,c){b=b||a;var d=function(a){return goog.isObject(a)?"o"+goog.getUid(a):(typeof a).charAt(0)+a};c=c||d;for(var d={},e=0,f=0;f<a.length;){var g=a[f++],h=c(g);Object.prototype.hasOwnProperty.call(d,h)||(d[h]=!0,b[e++]=g)}b.length=e};goog.array.binarySearch=function(a,b,c){return goog.array.binarySearch_(a,c||goog.array.defaultCompare,!1,b)};goog.array.binarySelect=function(a,b,c){return goog.array.binarySearch_(a,b,!0,void 0,c)};
goog.array.binarySearch_=function(a,b,c,d,e){for(var f=0,g=a.length,h;f<g;){var k=f+g>>1,l;l=c?b.call(e,a[k],k,a):b(d,a[k]);0<l?f=k+1:(g=k,h=!l)}return h?f:~f};goog.array.sort=function(a,b){a.sort(b||goog.array.defaultCompare)};goog.array.stableSort=function(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||goog.array.defaultCompare;goog.array.sort(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value};
goog.array.sortByKey=function(a,b,c){var d=c||goog.array.defaultCompare;goog.array.sort(a,function(a,c){return d(b(a),b(c))})};goog.array.sortObjectsByKey=function(a,b,c){goog.array.sortByKey(a,function(a){return a[b]},c)};goog.array.isSorted=function(a,b,c){b=b||goog.array.defaultCompare;for(var d=1;d<a.length;d++){var e=b(a[d-1],a[d]);if(0<e||0==e&&c)return!1}return!0};
goog.array.equals=function(a,b,c){if(!goog.isArrayLike(a)||!goog.isArrayLike(b)||a.length!=b.length)return!1;var d=a.length;c=c||goog.array.defaultCompareEquality;for(var e=0;e<d;e++)if(!c(a[e],b[e]))return!1;return!0};goog.array.compare3=function(a,b,c){c=c||goog.array.defaultCompare;for(var d=Math.min(a.length,b.length),e=0;e<d;e++){var f=c(a[e],b[e]);if(0!=f)return f}return goog.array.defaultCompare(a.length,b.length)};goog.array.defaultCompare=function(a,b){return a>b?1:a<b?-1:0};
goog.array.inverseDefaultCompare=function(a,b){return-goog.array.defaultCompare(a,b)};goog.array.defaultCompareEquality=function(a,b){return a===b};goog.array.binaryInsert=function(a,b,c){c=goog.array.binarySearch(a,b,c);return 0>c?(goog.array.insertAt(a,b,-(c+1)),!0):!1};goog.array.binaryRemove=function(a,b,c){b=goog.array.binarySearch(a,b,c);return 0<=b?goog.array.removeAt(a,b):!1};
goog.array.bucket=function(a,b,c){for(var d={},e=0;e<a.length;e++){var f=a[e],g=b.call(c,f,e,a);goog.isDef(g)&&(d[g]||(d[g]=[])).push(f)}return d};goog.array.toObject=function(a,b,c){var d={};goog.array.forEach(a,function(e,f){d[b.call(c,e,f,a)]=e});return d};goog.array.range=function(a,b,c){var d=[],e=0,f=a;c=c||1;void 0!==b&&(e=a,f=b);if(0>c*(f-e))return[];if(0<c)for(a=e;a<f;a+=c)d.push(a);else for(a=e;a>f;a+=c)d.push(a);return d};
goog.array.repeat=function(a,b){for(var c=[],d=0;d<b;d++)c[d]=a;return c};goog.array.flatten=function(a){for(var b=[],c=0;c<arguments.length;c++){var d=arguments[c];if(goog.isArray(d))for(var e=0;e<d.length;e+=8192)for(var f=goog.array.slice(d,e,e+8192),f=goog.array.flatten.apply(null,f),g=0;g<f.length;g++)b.push(f[g]);else b.push(d)}return b};
goog.array.rotate=function(a,b){goog.asserts.assert(null!=a.length);a.length&&(b%=a.length,0<b?Array.prototype.unshift.apply(a,a.splice(-b,b)):0>b&&Array.prototype.push.apply(a,a.splice(0,-b)));return a};goog.array.moveItem=function(a,b,c){goog.asserts.assert(0<=b&&b<a.length);goog.asserts.assert(0<=c&&c<a.length);b=Array.prototype.splice.call(a,b,1);Array.prototype.splice.call(a,c,0,b[0])};
goog.array.zip=function(a){if(!arguments.length)return[];for(var b=[],c=arguments[0].length,d=1;d<arguments.length;d++)arguments[d].length<c&&(c=arguments[d].length);for(d=0;d<c;d++){for(var e=[],f=0;f<arguments.length;f++)e.push(arguments[f][d]);b.push(e)}return b};goog.array.shuffle=function(a,b){for(var c=b||Math.random,d=a.length-1;0<d;d--){var e=Math.floor(c()*(d+1)),f=a[d];a[d]=a[e];a[e]=f}};goog.array.copyByIndex=function(a,b){var c=[];goog.array.forEach(b,function(b){c.push(a[b])});return c};goog.crypt={};goog.crypt.stringToByteArray=function(a){for(var b=[],c=0,d=0;d<a.length;d++){for(var e=a.charCodeAt(d);255<e;)b[c++]=e&255,e>>=8;b[c++]=e}return b};goog.crypt.byteArrayToString=function(a){if(8192>=a.length)return String.fromCharCode.apply(null,a);for(var b="",c=0;c<a.length;c+=8192)var d=goog.array.slice(a,c,c+8192),b=b+String.fromCharCode.apply(null,d);return b};goog.crypt.byteArrayToHex=function(a){return goog.array.map(a,function(a){a=a.toString(16);return 1<a.length?a:"0"+a}).join("")};
goog.crypt.hexToByteArray=function(a){goog.asserts.assert(0==a.length%2,"Key string length must be multiple of 2");for(var b=[],c=0;c<a.length;c+=2)b.push(parseInt(a.substring(c,c+2),16));return b};
goog.crypt.stringToUtf8ByteArray=function(a){for(var b=[],c=0,d=0;d<a.length;d++){var e=a.charCodeAt(d);128>e?b[c++]=e:(2048>e?b[c++]=e>>6|192:(55296==(e&64512)&&d+1<a.length&&56320==(a.charCodeAt(d+1)&64512)?(e=65536+((e&1023)<<10)+(a.charCodeAt(++d)&1023),b[c++]=e>>18|240,b[c++]=e>>12&63|128):b[c++]=e>>12|224,b[c++]=e>>6&63|128),b[c++]=e&63|128)}return b};
goog.crypt.utf8ByteArrayToString=function(a){for(var b=[],c=0,d=0;c<a.length;){var e=a[c++];if(128>e)b[d++]=String.fromCharCode(e);else if(191<e&&224>e){var f=a[c++];b[d++]=String.fromCharCode((e&31)<<6|f&63)}else if(239<e&&365>e){var f=a[c++],g=a[c++],h=a[c++],e=((e&7)<<18|(f&63)<<12|(g&63)<<6|h&63)-65536;b[d++]=String.fromCharCode(55296+(e>>10));b[d++]=String.fromCharCode(56320+(e&1023))}else f=a[c++],g=a[c++],b[d++]=String.fromCharCode((e&15)<<12|(f&63)<<6|g&63)}return b.join("")};
goog.crypt.xorByteArray=function(a,b){goog.asserts.assert(a.length==b.length,"XOR array lengths must match");for(var c=[],d=0;d<a.length;d++)c.push(a[d]^b[d]);return c};goog.labs={};goog.labs.userAgent={};goog.labs.userAgent.util={};goog.labs.userAgent.util.getNativeUserAgentString_=function(){var a=goog.labs.userAgent.util.getNavigator_();return a&&(a=a.userAgent)?a:""};goog.labs.userAgent.util.getNavigator_=function(){return goog.global.navigator};goog.labs.userAgent.util.userAgent_=goog.labs.userAgent.util.getNativeUserAgentString_();goog.labs.userAgent.util.setUserAgent=function(a){goog.labs.userAgent.util.userAgent_=a||goog.labs.userAgent.util.getNativeUserAgentString_()};
goog.labs.userAgent.util.getUserAgent=function(){return goog.labs.userAgent.util.userAgent_};goog.labs.userAgent.util.matchUserAgent=function(a){var b=goog.labs.userAgent.util.getUserAgent();return goog.string.contains(b,a)};goog.labs.userAgent.util.matchUserAgentIgnoreCase=function(a){var b=goog.labs.userAgent.util.getUserAgent();return goog.string.caseInsensitiveContains(b,a)};
goog.labs.userAgent.util.extractVersionTuples=function(a){for(var b=RegExp("(\\w[\\w ]+)/([^\\s]+)\\s*(?:\\((.*?)\\))?","g"),c=[],d;d=b.exec(a);)c.push([d[1],d[2],d[3]||void 0]);return c};goog.labs.userAgent.platform={};goog.labs.userAgent.platform.isAndroid=function(){return goog.labs.userAgent.util.matchUserAgent("Android")};goog.labs.userAgent.platform.isIpod=function(){return goog.labs.userAgent.util.matchUserAgent("iPod")};goog.labs.userAgent.platform.isIphone=function(){return goog.labs.userAgent.util.matchUserAgent("iPhone")&&!goog.labs.userAgent.util.matchUserAgent("iPod")&&!goog.labs.userAgent.util.matchUserAgent("iPad")};goog.labs.userAgent.platform.isIpad=function(){return goog.labs.userAgent.util.matchUserAgent("iPad")};
goog.labs.userAgent.platform.isIos=function(){return goog.labs.userAgent.platform.isIphone()||goog.labs.userAgent.platform.isIpad()||goog.labs.userAgent.platform.isIpod()};goog.labs.userAgent.platform.isMacintosh=function(){return goog.labs.userAgent.util.matchUserAgent("Macintosh")};goog.labs.userAgent.platform.isLinux=function(){return goog.labs.userAgent.util.matchUserAgent("Linux")};goog.labs.userAgent.platform.isWindows=function(){return goog.labs.userAgent.util.matchUserAgent("Windows")};
goog.labs.userAgent.platform.isChromeOS=function(){return goog.labs.userAgent.util.matchUserAgent("CrOS")};
goog.labs.userAgent.platform.getVersion=function(){var a=goog.labs.userAgent.util.getUserAgent(),b="";goog.labs.userAgent.platform.isWindows()?(b=/Windows (?:NT|Phone) ([0-9.]+)/,b=(a=b.exec(a))?a[1]:"0.0"):goog.labs.userAgent.platform.isIos()?(b=/(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/,b=(a=b.exec(a))&&a[1].replace(/_/g,".")):goog.labs.userAgent.platform.isMacintosh()?(b=/Mac OS X ([0-9_.]+)/,b=(a=b.exec(a))?a[1].replace(/_/g,"."):"10"):goog.labs.userAgent.platform.isAndroid()?(b=/Android\s+([^\);]+)(\)|;)/,
b=(a=b.exec(a))&&a[1]):goog.labs.userAgent.platform.isChromeOS()&&(b=/(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/,b=(a=b.exec(a))&&a[1]);return b||""};goog.labs.userAgent.platform.isVersionOrHigher=function(a){return 0<=goog.string.compareVersions(goog.labs.userAgent.platform.getVersion(),a)};goog.object={};goog.object.forEach=function(a,b,c){for(var d in a)b.call(c,a[d],d,a)};goog.object.filter=function(a,b,c){var d={},e;for(e in a)b.call(c,a[e],e,a)&&(d[e]=a[e]);return d};goog.object.map=function(a,b,c){var d={},e;for(e in a)d[e]=b.call(c,a[e],e,a);return d};goog.object.some=function(a,b,c){for(var d in a)if(b.call(c,a[d],d,a))return!0;return!1};goog.object.every=function(a,b,c){for(var d in a)if(!b.call(c,a[d],d,a))return!1;return!0};
goog.object.getCount=function(a){var b=0,c;for(c in a)b++;return b};goog.object.getAnyKey=function(a){for(var b in a)return b};goog.object.getAnyValue=function(a){for(var b in a)return a[b]};goog.object.contains=function(a,b){return goog.object.containsValue(a,b)};goog.object.getValues=function(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b};goog.object.getKeys=function(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b};
goog.object.getValueByKeys=function(a,b){for(var c=goog.isArrayLike(b),d=c?b:arguments,c=c?0:1;c<d.length&&(a=a[d[c]],goog.isDef(a));c++);return a};goog.object.containsKey=function(a,b){return null!==a&&b in a};goog.object.containsValue=function(a,b){for(var c in a)if(a[c]==b)return!0;return!1};goog.object.findKey=function(a,b,c){for(var d in a)if(b.call(c,a[d],d,a))return d};goog.object.findValue=function(a,b,c){return(b=goog.object.findKey(a,b,c))&&a[b]};
goog.object.isEmpty=function(a){for(var b in a)return!1;return!0};goog.object.clear=function(a){for(var b in a)delete a[b]};goog.object.remove=function(a,b){var c;(c=b in a)&&delete a[b];return c};goog.object.add=function(a,b,c){if(null!==a&&b in a)throw Error('The object already contains the key "'+b+'"');goog.object.set(a,b,c)};goog.object.get=function(a,b,c){return null!==a&&b in a?a[b]:c};goog.object.set=function(a,b,c){a[b]=c};
goog.object.setIfUndefined=function(a,b,c){return b in a?a[b]:a[b]=c};goog.object.setWithReturnValueIfNotSet=function(a,b,c){if(b in a)return a[b];c=c();return a[b]=c};goog.object.equals=function(a,b){for(var c in a)if(!(c in b)||a[c]!==b[c])return!1;for(c in b)if(!(c in a))return!1;return!0};goog.object.clone=function(a){var b={},c;for(c in a)b[c]=a[c];return b};
goog.object.unsafeClone=function(a){var b=goog.typeOf(a);if("object"==b||"array"==b){if(goog.isFunction(a.clone))return a.clone();var b="array"==b?[]:{},c;for(c in a)b[c]=goog.object.unsafeClone(a[c]);return b}return a};goog.object.transpose=function(a){var b={},c;for(c in a)b[a[c]]=c;return b};goog.object.PROTOTYPE_FIELDS_="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend=function(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<goog.object.PROTOTYPE_FIELDS_.length;f++)c=goog.object.PROTOTYPE_FIELDS_[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};
goog.object.create=function(a){var b=arguments.length;if(1==b&&goog.isArray(arguments[0]))return goog.object.create.apply(null,arguments[0]);if(b%2)throw Error("Uneven number of arguments");for(var c={},d=0;d<b;d+=2)c[arguments[d]]=arguments[d+1];return c};goog.object.createSet=function(a){var b=arguments.length;if(1==b&&goog.isArray(arguments[0]))return goog.object.createSet.apply(null,arguments[0]);for(var c={},d=0;d<b;d++)c[arguments[d]]=!0;return c};
goog.object.createImmutableView=function(a){var b=a;Object.isFrozen&&!Object.isFrozen(a)&&(b=Object.create(a),Object.freeze(b));return b};goog.object.isImmutableView=function(a){return!!Object.isFrozen&&Object.isFrozen(a)};goog.labs.userAgent.browser={};goog.labs.userAgent.browser.matchOpera_=function(){return goog.labs.userAgent.util.matchUserAgent("Opera")||goog.labs.userAgent.util.matchUserAgent("OPR")};goog.labs.userAgent.browser.matchIE_=function(){return goog.labs.userAgent.util.matchUserAgent("Trident")||goog.labs.userAgent.util.matchUserAgent("MSIE")};goog.labs.userAgent.browser.matchEdge_=function(){return goog.labs.userAgent.util.matchUserAgent("Edge")};goog.labs.userAgent.browser.matchFirefox_=function(){return goog.labs.userAgent.util.matchUserAgent("Firefox")};
goog.labs.userAgent.browser.matchSafari_=function(){return goog.labs.userAgent.util.matchUserAgent("Safari")&&!(goog.labs.userAgent.browser.matchChrome_()||goog.labs.userAgent.browser.matchCoast_()||goog.labs.userAgent.browser.matchOpera_()||goog.labs.userAgent.browser.matchEdge_()||goog.labs.userAgent.browser.isSilk()||goog.labs.userAgent.util.matchUserAgent("Android"))};goog.labs.userAgent.browser.matchCoast_=function(){return goog.labs.userAgent.util.matchUserAgent("Coast")};
goog.labs.userAgent.browser.matchIosWebview_=function(){return(goog.labs.userAgent.util.matchUserAgent("iPad")||goog.labs.userAgent.util.matchUserAgent("iPhone"))&&!goog.labs.userAgent.browser.matchSafari_()&&!goog.labs.userAgent.browser.matchChrome_()&&!goog.labs.userAgent.browser.matchCoast_()&&goog.labs.userAgent.util.matchUserAgent("AppleWebKit")};
goog.labs.userAgent.browser.matchChrome_=function(){return(goog.labs.userAgent.util.matchUserAgent("Chrome")||goog.labs.userAgent.util.matchUserAgent("CriOS"))&&!goog.labs.userAgent.browser.matchOpera_()&&!goog.labs.userAgent.browser.matchEdge_()};goog.labs.userAgent.browser.matchAndroidBrowser_=function(){return goog.labs.userAgent.util.matchUserAgent("Android")&&!(goog.labs.userAgent.browser.isChrome()||goog.labs.userAgent.browser.isFirefox()||goog.labs.userAgent.browser.isOpera()||goog.labs.userAgent.browser.isSilk())};
goog.labs.userAgent.browser.isOpera=goog.labs.userAgent.browser.matchOpera_;goog.labs.userAgent.browser.isIE=goog.labs.userAgent.browser.matchIE_;goog.labs.userAgent.browser.isEdge=goog.labs.userAgent.browser.matchEdge_;goog.labs.userAgent.browser.isFirefox=goog.labs.userAgent.browser.matchFirefox_;goog.labs.userAgent.browser.isSafari=goog.labs.userAgent.browser.matchSafari_;goog.labs.userAgent.browser.isCoast=goog.labs.userAgent.browser.matchCoast_;goog.labs.userAgent.browser.isIosWebview=goog.labs.userAgent.browser.matchIosWebview_;
goog.labs.userAgent.browser.isChrome=goog.labs.userAgent.browser.matchChrome_;goog.labs.userAgent.browser.isAndroidBrowser=goog.labs.userAgent.browser.matchAndroidBrowser_;goog.labs.userAgent.browser.isSilk=function(){return goog.labs.userAgent.util.matchUserAgent("Silk")};
goog.labs.userAgent.browser.getVersion=function(){function a(a){a=goog.array.find(a,d);return c[a]||""}var b=goog.labs.userAgent.util.getUserAgent();if(goog.labs.userAgent.browser.isIE())return goog.labs.userAgent.browser.getIEVersion_(b);var b=goog.labs.userAgent.util.extractVersionTuples(b),c={};goog.array.forEach(b,function(a){c[a[0]]=a[1]});var d=goog.partial(goog.object.containsKey,c);return goog.labs.userAgent.browser.isOpera()?a(["Version","Opera","OPR"]):goog.labs.userAgent.browser.isEdge()?
a(["Edge"]):goog.labs.userAgent.browser.isChrome()?a(["Chrome","CriOS"]):(b=b[2])&&b[1]||""};goog.labs.userAgent.browser.isVersionOrHigher=function(a){return 0<=goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(),a)};
goog.labs.userAgent.browser.getIEVersion_=function(a){var b=/rv: *([\d\.]*)/.exec(a);if(b&&b[1])return b[1];var b="",c=/MSIE +([\d\.]+)/.exec(a);if(c&&c[1])if(a=/Trident\/(\d.\d)/.exec(a),"7.0"==c[1])if(a&&a[1])switch(a[1]){case "4.0":b="8.0";break;case "5.0":b="9.0";break;case "6.0":b="10.0";break;case "7.0":b="11.0"}else b="7.0";else b=c[1];return b};goog.labs.userAgent.engine={};goog.labs.userAgent.engine.isPresto=function(){return goog.labs.userAgent.util.matchUserAgent("Presto")};goog.labs.userAgent.engine.isTrident=function(){return goog.labs.userAgent.util.matchUserAgent("Trident")||goog.labs.userAgent.util.matchUserAgent("MSIE")};goog.labs.userAgent.engine.isEdge=function(){return goog.labs.userAgent.util.matchUserAgent("Edge")};
goog.labs.userAgent.engine.isWebKit=function(){return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit")&&!goog.labs.userAgent.engine.isEdge()};goog.labs.userAgent.engine.isGecko=function(){return goog.labs.userAgent.util.matchUserAgent("Gecko")&&!goog.labs.userAgent.engine.isWebKit()&&!goog.labs.userAgent.engine.isTrident()&&!goog.labs.userAgent.engine.isEdge()};
goog.labs.userAgent.engine.getVersion=function(){var a=goog.labs.userAgent.util.getUserAgent();if(a){var a=goog.labs.userAgent.util.extractVersionTuples(a),b=goog.labs.userAgent.engine.getEngineTuple_(a);if(b)return"Gecko"==b[0]?goog.labs.userAgent.engine.getVersionForKey_(a,"Firefox"):b[1];var a=a[0],c;if(a&&(c=a[2])&&(c=/Trident\/([^\s;]+)/.exec(c)))return c[1]}return""};
goog.labs.userAgent.engine.getEngineTuple_=function(a){if(!goog.labs.userAgent.engine.isEdge())return a[1];for(var b=0;b<a.length;b++){var c=a[b];if("Edge"==c[0])return c}};goog.labs.userAgent.engine.isVersionOrHigher=function(a){return 0<=goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(),a)};goog.labs.userAgent.engine.getVersionForKey_=function(a,b){var c=goog.array.find(a,function(a){return b==a[0]});return c&&c[1]||""};goog.userAgent={};goog.userAgent.ASSUME_IE=!1;goog.userAgent.ASSUME_EDGE=!1;goog.userAgent.ASSUME_GECKO=!1;goog.userAgent.ASSUME_WEBKIT=!1;goog.userAgent.ASSUME_MOBILE_WEBKIT=!1;goog.userAgent.ASSUME_OPERA=!1;goog.userAgent.ASSUME_ANY_VERSION=!1;goog.userAgent.BROWSER_KNOWN_=goog.userAgent.ASSUME_IE||goog.userAgent.ASSUME_EDGE||goog.userAgent.ASSUME_GECKO||goog.userAgent.ASSUME_MOBILE_WEBKIT||goog.userAgent.ASSUME_WEBKIT||goog.userAgent.ASSUME_OPERA;goog.userAgent.getUserAgentString=function(){return goog.labs.userAgent.util.getUserAgent()};
goog.userAgent.getNavigator=function(){return goog.global.navigator||null};goog.userAgent.OPERA=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_OPERA:goog.labs.userAgent.browser.isOpera();goog.userAgent.IE=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_IE:goog.labs.userAgent.browser.isIE();goog.userAgent.EDGE=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_EDGE:goog.labs.userAgent.engine.isEdge();goog.userAgent.EDGE_OR_IE=goog.userAgent.EDGE||goog.userAgent.IE;
goog.userAgent.GECKO=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_GECKO:goog.labs.userAgent.engine.isGecko();goog.userAgent.WEBKIT=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_WEBKIT||goog.userAgent.ASSUME_MOBILE_WEBKIT:goog.labs.userAgent.engine.isWebKit();goog.userAgent.isMobile_=function(){return goog.userAgent.WEBKIT&&goog.labs.userAgent.util.matchUserAgent("Mobile")};goog.userAgent.MOBILE=goog.userAgent.ASSUME_MOBILE_WEBKIT||goog.userAgent.isMobile_();goog.userAgent.SAFARI=goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_=function(){var a=goog.userAgent.getNavigator();return a&&a.platform||""};goog.userAgent.PLATFORM=goog.userAgent.determinePlatform_();goog.userAgent.ASSUME_MAC=!1;goog.userAgent.ASSUME_WINDOWS=!1;goog.userAgent.ASSUME_LINUX=!1;goog.userAgent.ASSUME_X11=!1;goog.userAgent.ASSUME_ANDROID=!1;goog.userAgent.ASSUME_IPHONE=!1;goog.userAgent.ASSUME_IPAD=!1;
goog.userAgent.PLATFORM_KNOWN_=goog.userAgent.ASSUME_MAC||goog.userAgent.ASSUME_WINDOWS||goog.userAgent.ASSUME_LINUX||goog.userAgent.ASSUME_X11||goog.userAgent.ASSUME_ANDROID||goog.userAgent.ASSUME_IPHONE||goog.userAgent.ASSUME_IPAD;goog.userAgent.MAC=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_MAC:goog.labs.userAgent.platform.isMacintosh();goog.userAgent.WINDOWS=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_WINDOWS:goog.labs.userAgent.platform.isWindows();
goog.userAgent.isLegacyLinux_=function(){return goog.labs.userAgent.platform.isLinux()||goog.labs.userAgent.platform.isChromeOS()};goog.userAgent.LINUX=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_LINUX:goog.userAgent.isLegacyLinux_();goog.userAgent.isX11_=function(){var a=goog.userAgent.getNavigator();return!!a&&goog.string.contains(a.appVersion||"","X11")};goog.userAgent.X11=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_X11:goog.userAgent.isX11_();
goog.userAgent.ANDROID=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_ANDROID:goog.labs.userAgent.platform.isAndroid();goog.userAgent.IPHONE=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_IPHONE:goog.labs.userAgent.platform.isIphone();goog.userAgent.IPAD=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_IPAD:goog.labs.userAgent.platform.isIpad();goog.userAgent.operaVersion_=function(){var a=goog.global.opera.version;try{return a()}catch(b){return a}};
goog.userAgent.determineVersion_=function(){if(goog.userAgent.OPERA&&goog.global.opera)return goog.userAgent.operaVersion_();var a="",b=goog.userAgent.getVersionRegexResult_();b&&(a=b?b[1]:"");return goog.userAgent.IE&&(b=goog.userAgent.getDocumentMode_(),b>parseFloat(a))?String(b):a};
goog.userAgent.getVersionRegexResult_=function(){var a=goog.userAgent.getUserAgentString();if(goog.userAgent.GECKO)return/rv\:([^\);]+)(\)|;)/.exec(a);if(goog.userAgent.EDGE)return/Edge\/([\d\.]+)/.exec(a);if(goog.userAgent.IE)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(goog.userAgent.WEBKIT)return/WebKit\/(\S+)/.exec(a)};goog.userAgent.getDocumentMode_=function(){var a=goog.global.document;return a?a.documentMode:void 0};goog.userAgent.VERSION=goog.userAgent.determineVersion_();
goog.userAgent.compare=function(a,b){return goog.string.compareVersions(a,b)};goog.userAgent.isVersionOrHigherCache_={};goog.userAgent.isVersionOrHigher=function(a){return goog.userAgent.ASSUME_ANY_VERSION||goog.userAgent.isVersionOrHigherCache_[a]||(goog.userAgent.isVersionOrHigherCache_[a]=0<=goog.string.compareVersions(goog.userAgent.VERSION,a))};goog.userAgent.isVersion=goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher=function(a){return Number(goog.userAgent.DOCUMENT_MODE)>=a};goog.userAgent.isDocumentMode=goog.userAgent.isDocumentModeOrHigher;goog.userAgent.DOCUMENT_MODE=function(){var a=goog.global.document,b=goog.userAgent.getDocumentMode_();return a&&goog.userAgent.IE?b||("CSS1Compat"==a.compatMode?parseInt(goog.userAgent.VERSION,10):5):void 0}();goog.userAgent.product={};goog.userAgent.product.ASSUME_FIREFOX=!1;goog.userAgent.product.ASSUME_IPHONE=!1;goog.userAgent.product.ASSUME_IPAD=!1;goog.userAgent.product.ASSUME_ANDROID=!1;goog.userAgent.product.ASSUME_CHROME=!1;goog.userAgent.product.ASSUME_SAFARI=!1;
goog.userAgent.product.PRODUCT_KNOWN_=goog.userAgent.ASSUME_IE||goog.userAgent.ASSUME_EDGE||goog.userAgent.ASSUME_OPERA||goog.userAgent.product.ASSUME_FIREFOX||goog.userAgent.product.ASSUME_IPHONE||goog.userAgent.product.ASSUME_IPAD||goog.userAgent.product.ASSUME_ANDROID||goog.userAgent.product.ASSUME_CHROME||goog.userAgent.product.ASSUME_SAFARI;goog.userAgent.product.OPERA=goog.userAgent.OPERA;goog.userAgent.product.IE=goog.userAgent.IE;goog.userAgent.product.EDGE=goog.userAgent.EDGE;
goog.userAgent.product.FIREFOX=goog.userAgent.product.PRODUCT_KNOWN_?goog.userAgent.product.ASSUME_FIREFOX:goog.labs.userAgent.browser.isFirefox();goog.userAgent.product.isIphoneOrIpod_=function(){return goog.labs.userAgent.platform.isIphone()||goog.labs.userAgent.platform.isIpod()};goog.userAgent.product.IPHONE=goog.userAgent.product.PRODUCT_KNOWN_?goog.userAgent.product.ASSUME_IPHONE:goog.userAgent.product.isIphoneOrIpod_();
goog.userAgent.product.IPAD=goog.userAgent.product.PRODUCT_KNOWN_?goog.userAgent.product.ASSUME_IPAD:goog.labs.userAgent.platform.isIpad();goog.userAgent.product.ANDROID=goog.userAgent.product.PRODUCT_KNOWN_?goog.userAgent.product.ASSUME_ANDROID:goog.labs.userAgent.browser.isAndroidBrowser();goog.userAgent.product.CHROME=goog.userAgent.product.PRODUCT_KNOWN_?goog.userAgent.product.ASSUME_CHROME:goog.labs.userAgent.browser.isChrome();
goog.userAgent.product.isSafariDesktop_=function(){return goog.labs.userAgent.browser.isSafari()&&!goog.labs.userAgent.platform.isIos()};goog.userAgent.product.SAFARI=goog.userAgent.product.PRODUCT_KNOWN_?goog.userAgent.product.ASSUME_SAFARI:goog.userAgent.product.isSafariDesktop_();goog.crypt.base64={};goog.crypt.base64.byteToCharMap_=null;goog.crypt.base64.charToByteMap_=null;goog.crypt.base64.byteToCharMapWebSafe_=null;goog.crypt.base64.ENCODED_VALS_BASE="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";goog.crypt.base64.ENCODED_VALS=goog.crypt.base64.ENCODED_VALS_BASE+"+/=";goog.crypt.base64.ENCODED_VALS_WEBSAFE=goog.crypt.base64.ENCODED_VALS_BASE+"-_.";
goog.crypt.base64.ASSUME_NATIVE_SUPPORT_=goog.userAgent.GECKO||goog.userAgent.WEBKIT&&!goog.userAgent.product.SAFARI||goog.userAgent.OPERA;goog.crypt.base64.HAS_NATIVE_ENCODE_=goog.crypt.base64.ASSUME_NATIVE_SUPPORT_||"function"==typeof goog.global.btoa;goog.crypt.base64.HAS_NATIVE_DECODE_=goog.crypt.base64.ASSUME_NATIVE_SUPPORT_||!goog.userAgent.product.SAFARI&&!goog.userAgent.IE&&"function"==typeof goog.global.atob;
goog.crypt.base64.encodeByteArray=function(a,b){goog.asserts.assert(goog.isArrayLike(a),"encodeByteArray takes an array as a parameter");goog.crypt.base64.init_();for(var c=b?goog.crypt.base64.byteToCharMapWebSafe_:goog.crypt.base64.byteToCharMap_,d=[],e=0;e<a.length;e+=3){var f=a[e],g=e+1<a.length,h=g?a[e+1]:0,k=e+2<a.length,l=k?a[e+2]:0,p=f>>2,f=(f&3)<<4|h>>4,h=(h&15)<<2|l>>6,l=l&63;k||(l=64,g||(h=64));d.push(c[p],c[f],c[h],c[l])}return d.join("")};
goog.crypt.base64.encodeString=function(a,b){return goog.crypt.base64.HAS_NATIVE_ENCODE_&&!b?goog.global.btoa(a):goog.crypt.base64.encodeByteArray(goog.crypt.stringToByteArray(a),b)};goog.crypt.base64.decodeString=function(a,b){if(goog.crypt.base64.HAS_NATIVE_DECODE_&&!b)return goog.global.atob(a);var c="";goog.crypt.base64.decodeStringInternal_(a,function(a){c+=String.fromCharCode(a)});return c};
goog.crypt.base64.decodeStringToByteArray=function(a,b){var c=[];goog.crypt.base64.decodeStringInternal_(a,function(a){c.push(a)});return c};goog.crypt.base64.decodeStringToUint8Array=function(a){goog.asserts.assert(!goog.userAgent.IE||goog.userAgent.isVersionOrHigher("10"),"Browser does not support typed arrays");var b=new Uint8Array(Math.ceil(3*a.length/4)),c=0;goog.crypt.base64.decodeStringInternal_(a,function(a){b[c++]=a});return b.subarray(0,c)};
goog.crypt.base64.decodeStringInternal_=function(a,b){function c(b){for(;d<a.length;){var c=a.charAt(d++),e=goog.crypt.base64.charToByteMap_[c];if(null!=e)return e;if(!goog.string.isEmptyOrWhitespace(c))throw Error("Unknown base64 encoding at char: "+c);}return b}goog.crypt.base64.init_();for(var d=0;;){var e=c(-1),f=c(0),g=c(64),h=c(64);if(64===h&&-1===e)break;b(e<<2|f>>4);64!=g&&(b(f<<4&240|g>>2),64!=h&&b(g<<6&192|h))}};
goog.crypt.base64.init_=function(){if(!goog.crypt.base64.byteToCharMap_){goog.crypt.base64.byteToCharMap_={};goog.crypt.base64.charToByteMap_={};goog.crypt.base64.byteToCharMapWebSafe_={};for(var a=0;a<goog.crypt.base64.ENCODED_VALS.length;a++)goog.crypt.base64.byteToCharMap_[a]=goog.crypt.base64.ENCODED_VALS.charAt(a),goog.crypt.base64.charToByteMap_[goog.crypt.base64.byteToCharMap_[a]]=a,goog.crypt.base64.byteToCharMapWebSafe_[a]=goog.crypt.base64.ENCODED_VALS_WEBSAFE.charAt(a),a>=goog.crypt.base64.ENCODED_VALS_BASE.length&&
(goog.crypt.base64.charToByteMap_[goog.crypt.base64.ENCODED_VALS_WEBSAFE.charAt(a)]=a)}};jspb.ExtensionFieldInfo=function(a,b,c,d,e){this.fieldIndex=a;this.fieldName=b;this.ctor=c;this.toObjectFn=d;this.isRepeated=e};jspb.ExtensionFieldBinaryInfo=function(a,b,c,d,e,f){this.fieldInfo=a;this.binaryReaderFn=b;this.binaryWriterFn=c;this.binaryMessageSerializeFn=d;this.binaryMessageDeserializeFn=e;this.isPacked=f};jspb.ExtensionFieldInfo.prototype.isMessageType=function(){return!!this.ctor};jspb.Message=function(){};jspb.Message.GENERATE_TO_OBJECT=!0;jspb.Message.GENERATE_FROM_OBJECT=!goog.DISALLOW_TEST_ONLY_CODE;
jspb.Message.GENERATE_TO_STRING=!0;jspb.Message.ASSUME_LOCAL_ARRAYS=!1;jspb.Message.MINIMIZE_MEMORY_ALLOCATIONS=COMPILED;jspb.Message.SUPPORTS_UINT8ARRAY_="function"==typeof Uint8Array;jspb.Message.prototype.getJsPbMessageId=function(){return this.messageId_};jspb.Message.getIndex_=function(a,b){return b+a.arrayIndexOffset_};
jspb.Message.initialize=function(a,b,c,d,e,f){a.wrappers_=jspb.Message.MINIMIZE_MEMORY_ALLOCATIONS?null:{};b||(b=c?[c]:[]);a.messageId_=c?String(c):void 0;a.arrayIndexOffset_=0===c?-1:0;a.array=b;jspb.Message.initPivotAndExtensionObject_(a,d);a.convertedFloatingPointFields_={};if(e)for(b=0;b<e.length;b++)c=e[b],c<a.pivot_?(c=jspb.Message.getIndex_(a,c),a.array[c]=a.array[c]||(jspb.Message.MINIMIZE_MEMORY_ALLOCATIONS?jspb.Message.EMPTY_LIST_SENTINEL_:[])):(jspb.Message.maybeInitEmptyExtensionObject_(a),
a.extensionObject_[c]=a.extensionObject_[c]||(jspb.Message.MINIMIZE_MEMORY_ALLOCATIONS?jspb.Message.EMPTY_LIST_SENTINEL_:[]));f&&f.length&&goog.array.forEach(f,goog.partial(jspb.Message.computeOneofCase,a))};jspb.Message.EMPTY_LIST_SENTINEL_=goog.DEBUG&&Object.freeze?Object.freeze([]):[];jspb.Message.isArray_=function(a){return jspb.Message.ASSUME_LOCAL_ARRAYS?a instanceof Array:goog.isArray(a)};
jspb.Message.initPivotAndExtensionObject_=function(a,b){if(a.array.length){var c=a.array.length-1,d=a.array[c];if(d&&"object"==typeof d&&!jspb.Message.isArray_(d)&&!(jspb.Message.SUPPORTS_UINT8ARRAY_&&d instanceof Uint8Array)){a.pivot_=c-a.arrayIndexOffset_;a.extensionObject_=d;return}}-1<b?(a.pivot_=b,a.extensionObject_=null):a.pivot_=Number.MAX_VALUE};jspb.Message.maybeInitEmptyExtensionObject_=function(a){var b=jspb.Message.getIndex_(a,a.pivot_);a.array[b]||(a.extensionObject_=a.array[b]={})};
jspb.Message.toObjectList=function(a,b,c){for(var d=[],e=0;e<a.length;e++)d[e]=b.call(a[e],c,a[e]);return d};jspb.Message.toObjectExtension=function(a,b,c,d,e){for(var f in c){var g=c[f],h=d.call(a,g);if(null!=h){for(var k in g.fieldName)if(g.fieldName.hasOwnProperty(k))break;b[k]=g.toObjectFn?g.isRepeated?jspb.Message.toObjectList(h,g.toObjectFn,e):g.toObjectFn(e,h):h}}};
jspb.Message.serializeBinaryExtensions=function(a,b,c,d){for(var e in c){var f=c[e],g=f.fieldInfo;if(!f.binaryWriterFn)throw Error("Message extension present that was generated without binary serialization support");var h=d.call(a,g);if(null!=h)if(g.isMessageType())if(f.binaryMessageSerializeFn)f.binaryWriterFn.call(b,g.fieldIndex,h,f.binaryMessageSerializeFn);else throw Error("Message extension present holding submessage without binary support enabled, and message is being serialized to binary format");
else f.binaryWriterFn.call(b,g.fieldIndex,h)}};jspb.Message.readBinaryExtension=function(a,b,c,d,e){var f=c[b.getFieldNumber()];if(f){c=f.fieldInfo;if(!f.binaryReaderFn)throw Error("Deserializing extension whose generated code does not support binary format");var g;c.isMessageType()?(g=new c.ctor,f.binaryReaderFn.call(b,g,f.binaryMessageDeserializeFn)):g=f.binaryReaderFn.call(b);c.isRepeated&&!f.isPacked?(b=d.call(a,c))?b.push(g):e.call(a,c,[g]):e.call(a,c,g)}else b.skipField()};
jspb.Message.getField=function(a,b){if(b<a.pivot_){var c=jspb.Message.getIndex_(a,b),d=a.array[c];return d===jspb.Message.EMPTY_LIST_SENTINEL_?a.array[c]=[]:d}if(a.extensionObject_)return d=a.extensionObject_[b],d===jspb.Message.EMPTY_LIST_SENTINEL_?a.extensionObject_[b]=[]:d};
jspb.Message.getRepeatedField=function(a,b){if(b<a.pivot_){var c=jspb.Message.getIndex_(a,b),d=a.array[c];return d===jspb.Message.EMPTY_LIST_SENTINEL_?a.array[c]=[]:d}d=a.extensionObject_[b];return d===jspb.Message.EMPTY_LIST_SENTINEL_?a.extensionObject_[b]=[]:d};jspb.Message.getOptionalFloatingPointField=function(a,b){var c=jspb.Message.getField(a,b);return null==c?c:+c};
jspb.Message.getRepeatedFloatingPointField=function(a,b){var c=jspb.Message.getRepeatedField(a,b);a.convertedFloatingPointFields_||(a.convertedFloatingPointFields_={});if(!a.convertedFloatingPointFields_[b]){for(var d=0;d<c.length;d++)c[d]=+c[d];a.convertedFloatingPointFields_[b]=!0}return c};
jspb.Message.bytesAsB64=function(a){if(null==a||goog.isString(a))return a;if(jspb.Message.SUPPORTS_UINT8ARRAY_&&a instanceof Uint8Array)return goog.crypt.base64.encodeByteArray(a);goog.asserts.fail("Cannot coerce to b64 string: "+goog.typeOf(a));return null};jspb.Message.bytesAsU8=function(a){if(null==a||a instanceof Uint8Array)return a;if(goog.isString(a))return goog.crypt.base64.decodeStringToUint8Array(a);goog.asserts.fail("Cannot coerce to Uint8Array: "+goog.typeOf(a));return null};
jspb.Message.bytesListAsB64=function(a){jspb.Message.assertConsistentTypes_(a);return!a.length||goog.isString(a[0])?a:goog.array.map(a,jspb.Message.bytesAsB64)};jspb.Message.bytesListAsU8=function(a){jspb.Message.assertConsistentTypes_(a);return!a.length||a[0]instanceof Uint8Array?a:goog.array.map(a,jspb.Message.bytesAsU8)};
jspb.Message.assertConsistentTypes_=function(a){if(goog.DEBUG&&a&&1<a.length){var b=goog.typeOf(a[0]);goog.array.forEach(a,function(a){goog.typeOf(a)!=b&&goog.asserts.fail("Inconsistent type in JSPB repeated field array. Got "+goog.typeOf(a)+" expected "+b)})}};jspb.Message.getFieldWithDefault=function(a,b,c){a=jspb.Message.getField(a,b);return null==a?c:a};jspb.Message.getFieldProto3=jspb.Message.getFieldWithDefault;
jspb.Message.getMapField=function(a,b,c,d){a.wrappers_||(a.wrappers_={});if(b in a.wrappers_)return a.wrappers_[b];if(!c)return c=jspb.Message.getField(a,b),c||(c=[],jspb.Message.setField(a,b,c)),a.wrappers_[b]=new jspb.Map(c,d)};jspb.Message.setField=function(a,b,c){b<a.pivot_?a.array[jspb.Message.getIndex_(a,b)]=c:(jspb.Message.maybeInitEmptyExtensionObject_(a),a.extensionObject_[b]=c)};jspb.Message.setProto3IntField=function(a,b,c){jspb.Message.setFieldIgnoringDefault_(a,b,c,0)};
jspb.Message.setProto3FloatField=function(a,b,c){jspb.Message.setFieldIgnoringDefault_(a,b,c,0)};jspb.Message.setProto3BooleanField=function(a,b,c){jspb.Message.setFieldIgnoringDefault_(a,b,c,!1)};jspb.Message.setProto3StringField=function(a,b,c){jspb.Message.setFieldIgnoringDefault_(a,b,c,"")};jspb.Message.setProto3BytesField=function(a,b,c){jspb.Message.setFieldIgnoringDefault_(a,b,c,"")};jspb.Message.setProto3EnumField=function(a,b,c){jspb.Message.setFieldIgnoringDefault_(a,b,c,0)};
jspb.Message.setFieldIgnoringDefault_=function(a,b,c,d){c!=d?jspb.Message.setField(a,b,c):a.array[jspb.Message.getIndex_(a,b)]=null};jspb.Message.addToRepeatedField=function(a,b,c,d){a=jspb.Message.getRepeatedField(a,b);void 0!=d?a.splice(d,0,c):a.push(c)};jspb.Message.setOneofField=function(a,b,c,d){(c=jspb.Message.computeOneofCase(a,c))&&c!==b&&void 0!==d&&(a.wrappers_&&c in a.wrappers_&&(a.wrappers_[c]=void 0),jspb.Message.setField(a,c,void 0));jspb.Message.setField(a,b,d)};
jspb.Message.computeOneofCase=function(a,b){var c,d;goog.array.forEach(b,function(b){var f=jspb.Message.getField(a,b);goog.isDefAndNotNull(f)&&(c=b,d=f,jspb.Message.setField(a,b,void 0))});return c?(jspb.Message.setField(a,c,d),c):0};jspb.Message.getWrapperField=function(a,b,c,d){a.wrappers_||(a.wrappers_={});if(!a.wrappers_[c]){var e=jspb.Message.getField(a,c);if(d||e)a.wrappers_[c]=new b(e)}return a.wrappers_[c]};
jspb.Message.getRepeatedWrapperField=function(a,b,c){jspb.Message.wrapRepeatedField_(a,b,c);b=a.wrappers_[c];b==jspb.Message.EMPTY_LIST_SENTINEL_&&(b=a.wrappers_[c]=[]);return b};jspb.Message.wrapRepeatedField_=function(a,b,c){a.wrappers_||(a.wrappers_={});if(!a.wrappers_[c]){for(var d=jspb.Message.getRepeatedField(a,c),e=[],f=0;f<d.length;f++)e[f]=new b(d[f]);a.wrappers_[c]=e}};
jspb.Message.setWrapperField=function(a,b,c){a.wrappers_||(a.wrappers_={});var d=c?c.toArray():c;a.wrappers_[b]=c;jspb.Message.setField(a,b,d)};jspb.Message.setOneofWrapperField=function(a,b,c,d){a.wrappers_||(a.wrappers_={});var e=d?d.toArray():d;a.wrappers_[b]=d;jspb.Message.setOneofField(a,b,c,e)};jspb.Message.setRepeatedWrapperField=function(a,b,c){a.wrappers_||(a.wrappers_={});c=c||[];for(var d=[],e=0;e<c.length;e++)d[e]=c[e].toArray();a.wrappers_[b]=c;jspb.Message.setField(a,b,d)};
jspb.Message.addToRepeatedWrapperField=function(a,b,c,d,e){jspb.Message.wrapRepeatedField_(a,d,b);var f=a.wrappers_[b];f||(f=a.wrappers_[b]=[]);c=c?c:new d;a=jspb.Message.getRepeatedField(a,b);void 0!=e?(f.splice(e,0,c),a.splice(e,0,c.toArray())):(f.push(c),a.push(c.toArray()));return c};jspb.Message.toMap=function(a,b,c,d){for(var e={},f=0;f<a.length;f++)e[b.call(a[f])]=c?c.call(a[f],d,a[f]):a[f];return e};
jspb.Message.prototype.syncMapFields_=function(){if(this.wrappers_)for(var a in this.wrappers_){var b=this.wrappers_[a];if(goog.isArray(b))for(var c=0;c<b.length;c++)b[c]&&b[c].toArray();else b&&b.toArray()}};jspb.Message.prototype.toArray=function(){this.syncMapFields_();return this.array};jspb.Message.GENERATE_TO_STRING&&(jspb.Message.prototype.toString=function(){this.syncMapFields_();return this.array.toString()});
jspb.Message.prototype.getExtension=function(a){if(this.extensionObject_){this.wrappers_||(this.wrappers_={});var b=a.fieldIndex;if(a.isRepeated){if(a.isMessageType())return this.wrappers_[b]||(this.wrappers_[b]=goog.array.map(this.extensionObject_[b]||[],function(b){return new a.ctor(b)})),this.wrappers_[b]}else if(a.isMessageType())return!this.wrappers_[b]&&this.extensionObject_[b]&&(this.wrappers_[b]=new a.ctor(this.extensionObject_[b])),this.wrappers_[b];return this.extensionObject_[b]}};
jspb.Message.prototype.setExtension=function(a,b){this.wrappers_||(this.wrappers_={});jspb.Message.maybeInitEmptyExtensionObject_(this);var c=a.fieldIndex;a.isRepeated?(b=b||[],a.isMessageType()?(this.wrappers_[c]=b,this.extensionObject_[c]=goog.array.map(b,function(a){return a.toArray()})):this.extensionObject_[c]=b):a.isMessageType()?(this.wrappers_[c]=b,this.extensionObject_[c]=b?b.toArray():b):this.extensionObject_[c]=b;return this};
jspb.Message.difference=function(a,b){if(!(a instanceof b.constructor))throw Error("Messages have different types.");var c=a.toArray(),d=b.toArray(),e=[],f=0,g=c.length>d.length?c.length:d.length;a.getJsPbMessageId()&&(e[0]=a.getJsPbMessageId(),f=1);for(;f<g;f++)jspb.Message.compareFields(c[f],d[f])||(e[f]=d[f]);return new a.constructor(e)};jspb.Message.equals=function(a,b){return a==b||!(!a||!b)&&a instanceof b.constructor&&jspb.Message.compareFields(a.toArray(),b.toArray())};
jspb.Message.compareExtensions=function(a,b){a=a||{};b=b||{};var c={},d;for(d in a)c[d]=0;for(d in b)c[d]=0;for(d in c)if(!jspb.Message.compareFields(a[d],b[d]))return!1;return!0};
jspb.Message.compareFields=function(a,b){if(a==b)return!0;if(!goog.isObject(a)||!goog.isObject(b)||a.constructor!=b.constructor)return!1;if(jspb.Message.SUPPORTS_UINT8ARRAY_&&a.constructor===Uint8Array){if(a.length!=b.length)return!1;for(var c=0;c<a.length;c++)if(a[c]!=b[c])return!1;return!0}if(a.constructor===Array){for(var d=void 0,e=void 0,f=Math.max(a.length,b.length),c=0;c<f;c++){var g=a[c],h=b[c];g&&g.constructor==Object&&(goog.asserts.assert(void 0===d),goog.asserts.assert(c===a.length-1),
d=g,g=void 0);h&&h.constructor==Object&&(goog.asserts.assert(void 0===e),goog.asserts.assert(c===b.length-1),e=h,h=void 0);if(!jspb.Message.compareFields(g,h))return!1}return d||e?(d=d||{},e=e||{},jspb.Message.compareExtensions(d,e)):!0}if(a.constructor===Object)return jspb.Message.compareExtensions(a,b);throw Error("Invalid type in JSPB array");};jspb.Message.prototype.cloneMessage=function(){return jspb.Message.cloneMessage(this)};jspb.Message.prototype.clone=function(){return jspb.Message.cloneMessage(this)};
jspb.Message.clone=function(a){return jspb.Message.cloneMessage(a)};jspb.Message.cloneMessage=function(a){return new a.constructor(jspb.Message.clone_(a.toArray()))};
jspb.Message.copyInto=function(a,b){goog.asserts.assertInstanceof(a,jspb.Message);goog.asserts.assertInstanceof(b,jspb.Message);goog.asserts.assert(a.constructor==b.constructor,"Copy source and target message should have the same type.");for(var c=jspb.Message.clone(a),d=b.toArray(),e=c.toArray(),f=d.length=0;f<e.length;f++)d[f]=e[f];b.wrappers_=c.wrappers_;b.extensionObject_=c.extensionObject_};
jspb.Message.clone_=function(a){var b;if(goog.isArray(a)){for(var c=Array(a.length),d=0;d<a.length;d++)null!=(b=a[d])&&(c[d]="object"==typeof b?jspb.Message.clone_(b):b);return c}if(jspb.Message.SUPPORTS_UINT8ARRAY_&&a instanceof Uint8Array)return new Uint8Array(a);c={};for(d in a)null!=(b=a[d])&&(c[d]="object"==typeof b?jspb.Message.clone_(b):b);return c};jspb.Message.registerMessageType=function(a,b){jspb.Message.registry_[a]=b;b.messageId=a};jspb.Message.registry_={};
jspb.Message.messageSetExtensions={};jspb.Message.messageSetExtensionsBinary={};jspb.arith={};jspb.arith.UInt64=function(a,b){this.lo=a;this.hi=b};jspb.arith.UInt64.prototype.cmp=function(a){return this.hi<a.hi||this.hi==a.hi&&this.lo<a.lo?-1:this.hi==a.hi&&this.lo==a.lo?0:1};jspb.arith.UInt64.prototype.rightShift=function(){return new jspb.arith.UInt64((this.lo>>>1|(this.hi&1)<<31)>>>0,this.hi>>>1>>>0)};jspb.arith.UInt64.prototype.leftShift=function(){return new jspb.arith.UInt64(this.lo<<1>>>0,(this.hi<<1|this.lo>>>31)>>>0)};
jspb.arith.UInt64.prototype.msb=function(){return!!(this.hi&2147483648)};jspb.arith.UInt64.prototype.lsb=function(){return!!(this.lo&1)};jspb.arith.UInt64.prototype.zero=function(){return 0==this.lo&&0==this.hi};jspb.arith.UInt64.prototype.add=function(a){return new jspb.arith.UInt64((this.lo+a.lo&4294967295)>>>0>>>0,((this.hi+a.hi&4294967295)>>>0)+(4294967296<=this.lo+a.lo?1:0)>>>0)};
jspb.arith.UInt64.prototype.sub=function(a){return new jspb.arith.UInt64((this.lo-a.lo&4294967295)>>>0>>>0,((this.hi-a.hi&4294967295)>>>0)-(0>this.lo-a.lo?1:0)>>>0)};jspb.arith.UInt64.mul32x32=function(a,b){for(var c=a&65535,d=a>>>16,e=b&65535,f=b>>>16,g=c*e+65536*(c*f&65535)+65536*(d*e&65535),c=d*f+(c*f>>>16)+(d*e>>>16);4294967296<=g;)g-=4294967296,c+=1;return new jspb.arith.UInt64(g>>>0,c>>>0)};
jspb.arith.UInt64.prototype.mul=function(a){var b=jspb.arith.UInt64.mul32x32(this.lo,a);a=jspb.arith.UInt64.mul32x32(this.hi,a);a.hi=a.lo;a.lo=0;return b.add(a)};
jspb.arith.UInt64.prototype.div=function(a){if(0==a)return[];var b=new jspb.arith.UInt64(0,0),c=new jspb.arith.UInt64(this.lo,this.hi);a=new jspb.arith.UInt64(a,0);for(var d=new jspb.arith.UInt64(1,0);!a.msb();)a=a.leftShift(),d=d.leftShift();for(;!d.zero();)0>=a.cmp(c)&&(b=b.add(d),c=c.sub(a)),a=a.rightShift(),d=d.rightShift();return[b,c]};jspb.arith.UInt64.prototype.toString=function(){for(var a="",b=this;!b.zero();)var b=b.div(10),c=b[0],a=b[1].lo+a,b=c;""==a&&(a="0");return a};
jspb.arith.UInt64.fromString=function(a){for(var b=new jspb.arith.UInt64(0,0),c=new jspb.arith.UInt64(0,0),d=0;d<a.length;d++){if("0">a[d]||"9"<a[d])return null;var e=parseInt(a[d],10);c.lo=e;b=b.mul(10).add(c)}return b};jspb.arith.UInt64.prototype.clone=function(){return new jspb.arith.UInt64(this.lo,this.hi)};jspb.arith.Int64=function(a,b){this.lo=a;this.hi=b};
jspb.arith.Int64.prototype.add=function(a){return new jspb.arith.Int64((this.lo+a.lo&4294967295)>>>0>>>0,((this.hi+a.hi&4294967295)>>>0)+(4294967296<=this.lo+a.lo?1:0)>>>0)};jspb.arith.Int64.prototype.sub=function(a){return new jspb.arith.Int64((this.lo-a.lo&4294967295)>>>0>>>0,((this.hi-a.hi&4294967295)>>>0)-(0>this.lo-a.lo?1:0)>>>0)};jspb.arith.Int64.prototype.clone=function(){return new jspb.arith.Int64(this.lo,this.hi)};
jspb.arith.Int64.prototype.toString=function(){var a=0!=(this.hi&2147483648),b=new jspb.arith.UInt64(this.lo,this.hi);a&&(b=(new jspb.arith.UInt64(0,0)).sub(b));return(a?"-":"")+b.toString()};jspb.arith.Int64.fromString=function(a){var b=0<a.length&&"-"==a[0];b&&(a=a.substring(1));a=jspb.arith.UInt64.fromString(a);if(null===a)return null;b&&(a=(new jspb.arith.UInt64(0,0)).sub(a));return new jspb.arith.Int64(a.lo,a.hi)};jspb.BinaryConstants={};jspb.ConstBinaryMessage=function(){};jspb.BinaryMessage=function(){};jspb.BinaryConstants.FieldType={INVALID:-1,DOUBLE:1,FLOAT:2,INT64:3,UINT64:4,INT32:5,FIXED64:6,FIXED32:7,BOOL:8,STRING:9,GROUP:10,MESSAGE:11,BYTES:12,UINT32:13,ENUM:14,SFIXED32:15,SFIXED64:16,SINT32:17,SINT64:18,FHASH64:30,VHASH64:31};jspb.BinaryConstants.WireType={INVALID:-1,VARINT:0,FIXED64:1,DELIMITED:2,START_GROUP:3,END_GROUP:4,FIXED32:5};
jspb.BinaryConstants.FieldTypeToWireType=function(a){var b=jspb.BinaryConstants.FieldType,c=jspb.BinaryConstants.WireType;switch(a){case b.INT32:case b.INT64:case b.UINT32:case b.UINT64:case b.SINT32:case b.SINT64:case b.BOOL:case b.ENUM:case b.VHASH64:return c.VARINT;case b.DOUBLE:case b.FIXED64:case b.SFIXED64:case b.FHASH64:return c.FIXED64;case b.STRING:case b.MESSAGE:case b.BYTES:return c.DELIMITED;case b.FLOAT:case b.FIXED32:case b.SFIXED32:return c.FIXED32;default:return c.INVALID}};
jspb.BinaryConstants.INVALID_FIELD_NUMBER=-1;jspb.BinaryConstants.FLOAT32_EPS=1.401298464324817E-45;jspb.BinaryConstants.FLOAT32_MIN=1.1754943508222875E-38;jspb.BinaryConstants.FLOAT32_MAX=3.4028234663852886E38;jspb.BinaryConstants.FLOAT64_EPS=4.9E-324;jspb.BinaryConstants.FLOAT64_MIN=2.2250738585072014E-308;jspb.BinaryConstants.FLOAT64_MAX=1.7976931348623157E308;jspb.BinaryConstants.TWO_TO_20=1048576;jspb.BinaryConstants.TWO_TO_23=8388608;jspb.BinaryConstants.TWO_TO_31=2147483648;
jspb.BinaryConstants.TWO_TO_32=4294967296;jspb.BinaryConstants.TWO_TO_52=4503599627370496;jspb.BinaryConstants.TWO_TO_63=0x7fffffffffffffff;jspb.BinaryConstants.TWO_TO_64=1.8446744073709552E19;jspb.BinaryConstants.ZERO_HASH="\x00\x00\x00\x00\x00\x00\x00\x00";jspb.utils={};jspb.utils.split64Low=0;jspb.utils.split64High=0;jspb.utils.splitUint64=function(a){var b=a>>>0;a=Math.floor((a-b)/jspb.BinaryConstants.TWO_TO_32)>>>0;jspb.utils.split64Low=b;jspb.utils.split64High=a};jspb.utils.splitInt64=function(a){var b=0>a;a=Math.abs(a);var c=a>>>0;a=Math.floor((a-c)/jspb.BinaryConstants.TWO_TO_32);a>>>=0;b&&(a=~a>>>0,c=(~c>>>0)+1,4294967295<c&&(c=0,a++,4294967295<a&&(a=0)));jspb.utils.split64Low=c;jspb.utils.split64High=a};
jspb.utils.splitZigzag64=function(a){var b=0>a;a=2*Math.abs(a);jspb.utils.splitUint64(a);a=jspb.utils.split64Low;var c=jspb.utils.split64High;b&&(0==a?0==c?c=a=4294967295:(c--,a=4294967295):a--);jspb.utils.split64Low=a;jspb.utils.split64High=c};
jspb.utils.splitFloat32=function(a){var b=0>a?1:0;a=b?-a:a;var c;0===a?0<1/a?(jspb.utils.split64High=0,jspb.utils.split64Low=0):(jspb.utils.split64High=0,jspb.utils.split64Low=2147483648):isNaN(a)?(jspb.utils.split64High=0,jspb.utils.split64Low=2147483647):a>jspb.BinaryConstants.FLOAT32_MAX?(jspb.utils.split64High=0,jspb.utils.split64Low=(b<<31|2139095040)>>>0):a<jspb.BinaryConstants.FLOAT32_MIN?(a=Math.round(a/Math.pow(2,-149)),jspb.utils.split64High=0,jspb.utils.split64Low=(b<<31|a)>>>0):(c=Math.floor(Math.log(a)/
Math.LN2),a*=Math.pow(2,-c),a=Math.round(a*jspb.BinaryConstants.TWO_TO_23)&8388607,jspb.utils.split64High=0,jspb.utils.split64Low=(b<<31|c+127<<23|a)>>>0)};
jspb.utils.splitFloat64=function(a){var b=0>a?1:0;a=b?-a:a;if(0===a)jspb.utils.split64High=0<1/a?0:2147483648,jspb.utils.split64Low=0;else if(isNaN(a))jspb.utils.split64High=2147483647,jspb.utils.split64Low=4294967295;else if(a>jspb.BinaryConstants.FLOAT64_MAX)jspb.utils.split64High=(b<<31|2146435072)>>>0,jspb.utils.split64Low=0;else if(a<jspb.BinaryConstants.FLOAT64_MIN){var c=a/Math.pow(2,-1074);a=c/jspb.BinaryConstants.TWO_TO_32;jspb.utils.split64High=(b<<31|a)>>>0;jspb.utils.split64Low=c>>>0}else{var d=
Math.floor(Math.log(a)/Math.LN2);1024==d&&(d=1023);c=a*Math.pow(2,-d);a=c*jspb.BinaryConstants.TWO_TO_20&1048575;c=c*jspb.BinaryConstants.TWO_TO_52>>>0;jspb.utils.split64High=(b<<31|d+1023<<20|a)>>>0;jspb.utils.split64Low=c}};
jspb.utils.splitHash64=function(a){var b=a.charCodeAt(0),c=a.charCodeAt(1),d=a.charCodeAt(2),e=a.charCodeAt(3),f=a.charCodeAt(4),g=a.charCodeAt(5),h=a.charCodeAt(6);a=a.charCodeAt(7);jspb.utils.split64Low=b+(c<<8)+(d<<16)+(e<<24)>>>0;jspb.utils.split64High=f+(g<<8)+(h<<16)+(a<<24)>>>0};jspb.utils.joinUint64=function(a,b){return b*jspb.BinaryConstants.TWO_TO_32+a};
jspb.utils.joinInt64=function(a,b){var c=b&2147483648;c&&(a=~a+1>>>0,b=~b>>>0,0==a&&(b=b+1>>>0));var d=jspb.utils.joinUint64(a,b);return c?-d:d};jspb.utils.joinZigzag64=function(a,b){var c=a&1;a=(a>>>1|b<<31)>>>0;b>>>=1;c&&(a=a+1>>>0,0==a&&(b=b+1>>>0));var d=jspb.utils.joinUint64(a,b);return c?-d:d};jspb.utils.joinFloat32=function(a,b){var c=2*(a>>31)+1,d=a>>>23&255,e=a&8388607;return 255==d?e?NaN:Infinity*c:0==d?c*Math.pow(2,-149)*e:c*Math.pow(2,d-150)*(e+Math.pow(2,23))};
jspb.utils.joinFloat64=function(a,b){var c=2*(b>>31)+1,d=b>>>20&2047,e=jspb.BinaryConstants.TWO_TO_32*(b&1048575)+a;return 2047==d?e?NaN:Infinity*c:0==d?c*Math.pow(2,-1074)*e:c*Math.pow(2,d-1075)*(e+jspb.BinaryConstants.TWO_TO_52)};jspb.utils.joinHash64=function(a,b){return String.fromCharCode(a>>>0&255,a>>>8&255,a>>>16&255,a>>>24&255,b>>>0&255,b>>>8&255,b>>>16&255,b>>>24&255)};jspb.utils.DIGITS="0123456789abcdef".split("");
jspb.utils.joinUnsignedDecimalString=function(a,b){function c(a){for(var b=1E7,c=0;7>c;c++){var b=b/10,d=a/b%10>>>0;if(0!=d||h)h=!0,k+=g[d]}}if(2097151>=b)return""+(jspb.BinaryConstants.TWO_TO_32*b+a);var d=(a>>>24|b<<8)>>>0&16777215,e=b>>16&65535,f=(a&16777215)+6777216*d+6710656*e,d=d+8147497*e,e=2*e;1E7<=f&&(d+=Math.floor(f/1E7),f%=1E7);1E7<=d&&(e+=Math.floor(d/1E7),d%=1E7);var g=jspb.utils.DIGITS,h=!1,k="";(e||h)&&c(e);(d||h)&&c(d);(f||h)&&c(f);return k};
jspb.utils.joinSignedDecimalString=function(a,b){var c=b&2147483648;c&&(a=~a+1>>>0,b=~b+(0==a?1:0)>>>0);var d=jspb.utils.joinUnsignedDecimalString(a,b);return c?"-"+d:d};jspb.utils.hash64ToDecimalString=function(a,b){jspb.utils.splitHash64(a);var c=jspb.utils.split64Low,d=jspb.utils.split64High;return b?jspb.utils.joinSignedDecimalString(c,d):jspb.utils.joinUnsignedDecimalString(c,d)};
jspb.utils.hash64ArrayToDecimalStrings=function(a,b){for(var c=Array(a.length),d=0;d<a.length;d++)c[d]=jspb.utils.hash64ToDecimalString(a[d],b);return c};
jspb.utils.decimalStringToHash64=function(a){function b(a,b){for(var c=0;8>c&&(1!==a||0<b);c++){var d=a*e[c]+b;e[c]=d&255;b=d>>>8}}function c(){for(var a=0;8>a;a++)e[a]=~e[a]&255}goog.asserts.assert(0<a.length);var d=!1;"-"===a[0]&&(d=!0,a=a.slice(1));for(var e=[0,0,0,0,0,0,0,0],f=0;f<a.length;f++)b(10,jspb.utils.DIGITS.indexOf(a[f]));d&&(c(),b(1,1));return goog.crypt.byteArrayToString(e)};jspb.utils.splitDecimalString=function(a){jspb.utils.splitHash64(jspb.utils.decimalStringToHash64(a))};
jspb.utils.hash64ToHexString=function(a){var b=Array(18);b[0]="0";b[1]="x";for(var c=0;8>c;c++){var d=a.charCodeAt(7-c);b[2*c+2]=jspb.utils.DIGITS[d>>4];b[2*c+3]=jspb.utils.DIGITS[d&15]}return b.join("")};jspb.utils.hexStringToHash64=function(a){a=a.toLowerCase();goog.asserts.assert(18==a.length);goog.asserts.assert("0"==a[0]);goog.asserts.assert("x"==a[1]);for(var b="",c=0;8>c;c++)var d=jspb.utils.DIGITS.indexOf(a[2*c+2]),e=jspb.utils.DIGITS.indexOf(a[2*c+3]),b=String.fromCharCode(16*d+e)+b;return b};
jspb.utils.hash64ToNumber=function(a,b){jspb.utils.splitHash64(a);var c=jspb.utils.split64Low,d=jspb.utils.split64High;return b?jspb.utils.joinInt64(c,d):jspb.utils.joinUint64(c,d)};jspb.utils.numberToHash64=function(a){jspb.utils.splitInt64(a);return jspb.utils.joinHash64(jspb.utils.split64Low,jspb.utils.split64High)};jspb.utils.countVarints=function(a,b,c){for(var d=0,e=b;e<c;e++)d+=a[e]>>7;return c-b-d};
jspb.utils.countVarintFields=function(a,b,c,d){var e=0;d=8*d+jspb.BinaryConstants.WireType.VARINT;if(128>d)for(;b<c&&a[b++]==d;)for(e++;;){var f=a[b++];if(0==(f&128))break}else for(;b<c;){for(f=d;128<f;){if(a[b]!=(f&127|128))return e;b++;f>>=7}if(a[b++]!=f)break;for(e++;f=a[b++],0!=(f&128););}return e};jspb.utils.countFixedFields_=function(a,b,c,d,e){var f=0;if(128>d)for(;b<c&&a[b++]==d;)f++,b+=e;else for(;b<c;){for(var g=d;128<g;){if(a[b++]!=(g&127|128))return f;g>>=7}if(a[b++]!=g)break;f++;b+=e}return f};
jspb.utils.countFixed32Fields=function(a,b,c,d){return jspb.utils.countFixedFields_(a,b,c,8*d+jspb.BinaryConstants.WireType.FIXED32,4)};jspb.utils.countFixed64Fields=function(a,b,c,d){return jspb.utils.countFixedFields_(a,b,c,8*d+jspb.BinaryConstants.WireType.FIXED64,8)};
jspb.utils.countDelimitedFields=function(a,b,c,d){var e=0;for(d=8*d+jspb.BinaryConstants.WireType.DELIMITED;b<c;){for(var f=d;128<f;){if(a[b++]!=(f&127|128))return e;f>>=7}if(a[b++]!=f)break;e++;for(var g=0,h=1;f=a[b++],g+=(f&127)*h,h*=128,0!=(f&128););b+=g}return e};jspb.utils.debugBytesToTextFormat=function(a){var b='"';if(a){a=jspb.utils.byteSourceToUint8Array(a);for(var c=0;c<a.length;c++)b+="\\x",16>a[c]&&(b+="0"),b+=a[c].toString(16)}return b+'"'};
jspb.utils.debugScalarToTextFormat=function(a){return goog.isString(a)?goog.string.quote(a):a.toString()};jspb.utils.stringToByteArray=function(a){for(var b=new Uint8Array(a.length),c=0;c<a.length;c++){var d=a.charCodeAt(c);if(255<d)throw Error("Conversion error: string contains codepoint outside of byte range");b[c]=d}return b};
jspb.utils.byteSourceToUint8Array=function(a){if(a.constructor===Uint8Array)return a;if(a.constructor===ArrayBuffer||a.constructor===Array)return new Uint8Array(a);if(a.constructor===String)return goog.crypt.base64.decodeStringToUint8Array(a);goog.asserts.fail("Type not convertible to Uint8Array.");return new Uint8Array(0)};jspb.BinaryEncoder=function(){this.buffer_=[]};jspb.BinaryEncoder.prototype.length=function(){return this.buffer_.length};jspb.BinaryEncoder.prototype.end=function(){var a=this.buffer_;this.buffer_=[];return a};
jspb.BinaryEncoder.prototype.writeSplitVarint64=function(a,b){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(b==Math.floor(b));goog.asserts.assert(0<=a&&a<jspb.BinaryConstants.TWO_TO_32);for(goog.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_32);0<b||127<a;)this.buffer_.push(a&127|128),a=(a>>>7|b<<25)>>>0,b>>>=7;this.buffer_.push(a)};
jspb.BinaryEncoder.prototype.writeSplitFixed64=function(a,b){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(b==Math.floor(b));goog.asserts.assert(0<=a&&a<jspb.BinaryConstants.TWO_TO_32);goog.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_32);this.writeUint32(a);this.writeUint32(b)};
jspb.BinaryEncoder.prototype.writeUnsignedVarint32=function(a){goog.asserts.assert(a==Math.floor(a));for(goog.asserts.assert(0<=a&&a<jspb.BinaryConstants.TWO_TO_32);127<a;)this.buffer_.push(a&127|128),a>>>=7;this.buffer_.push(a)};
jspb.BinaryEncoder.prototype.writeSignedVarint32=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_31&&a<jspb.BinaryConstants.TWO_TO_31);if(0<=a)this.writeUnsignedVarint32(a);else{for(var b=0;9>b;b++)this.buffer_.push(a&127|128),a>>=7;this.buffer_.push(1)}};
jspb.BinaryEncoder.prototype.writeUnsignedVarint64=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(0<=a&&a<jspb.BinaryConstants.TWO_TO_64);jspb.utils.splitInt64(a);this.writeSplitVarint64(jspb.utils.split64Low,jspb.utils.split64High)};
jspb.BinaryEncoder.prototype.writeSignedVarint64=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_63&&a<jspb.BinaryConstants.TWO_TO_63);jspb.utils.splitInt64(a);this.writeSplitVarint64(jspb.utils.split64Low,jspb.utils.split64High)};
jspb.BinaryEncoder.prototype.writeZigzagVarint32=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_31&&a<jspb.BinaryConstants.TWO_TO_31);this.writeUnsignedVarint32((a<<1^a>>31)>>>0)};jspb.BinaryEncoder.prototype.writeZigzagVarint64=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_63&&a<jspb.BinaryConstants.TWO_TO_63);jspb.utils.splitZigzag64(a);this.writeSplitVarint64(jspb.utils.split64Low,jspb.utils.split64High)};
jspb.BinaryEncoder.prototype.writeZigzagVarint64String=function(a){this.writeZigzagVarint64(parseInt(a,10))};jspb.BinaryEncoder.prototype.writeUint8=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(0<=a&&256>a);this.buffer_.push(a>>>0&255)};jspb.BinaryEncoder.prototype.writeUint16=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(0<=a&&65536>a);this.buffer_.push(a>>>0&255);this.buffer_.push(a>>>8&255)};
jspb.BinaryEncoder.prototype.writeUint32=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(0<=a&&a<jspb.BinaryConstants.TWO_TO_32);this.buffer_.push(a>>>0&255);this.buffer_.push(a>>>8&255);this.buffer_.push(a>>>16&255);this.buffer_.push(a>>>24&255)};jspb.BinaryEncoder.prototype.writeUint64=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(0<=a&&a<jspb.BinaryConstants.TWO_TO_64);jspb.utils.splitUint64(a);this.writeUint32(jspb.utils.split64Low);this.writeUint32(jspb.utils.split64High)};
jspb.BinaryEncoder.prototype.writeInt8=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(-128<=a&&128>a);this.buffer_.push(a>>>0&255)};jspb.BinaryEncoder.prototype.writeInt16=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(-32768<=a&&32768>a);this.buffer_.push(a>>>0&255);this.buffer_.push(a>>>8&255)};
jspb.BinaryEncoder.prototype.writeInt32=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_31&&a<jspb.BinaryConstants.TWO_TO_31);this.buffer_.push(a>>>0&255);this.buffer_.push(a>>>8&255);this.buffer_.push(a>>>16&255);this.buffer_.push(a>>>24&255)};
jspb.BinaryEncoder.prototype.writeInt64=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_63&&a<jspb.BinaryConstants.TWO_TO_63);jspb.utils.splitInt64(a);this.writeSplitFixed64(jspb.utils.split64Low,jspb.utils.split64High)};
jspb.BinaryEncoder.prototype.writeInt64String=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(+a>=-jspb.BinaryConstants.TWO_TO_63&&+a<jspb.BinaryConstants.TWO_TO_63);jspb.utils.splitHash64(jspb.utils.decimalStringToHash64(a));this.writeSplitFixed64(jspb.utils.split64Low,jspb.utils.split64High)};jspb.BinaryEncoder.prototype.writeFloat=function(a){goog.asserts.assert(a>=-jspb.BinaryConstants.FLOAT32_MAX&&a<=jspb.BinaryConstants.FLOAT32_MAX);jspb.utils.splitFloat32(a);this.writeUint32(jspb.utils.split64Low)};
jspb.BinaryEncoder.prototype.writeDouble=function(a){goog.asserts.assert(a>=-jspb.BinaryConstants.FLOAT64_MAX&&a<=jspb.BinaryConstants.FLOAT64_MAX);jspb.utils.splitFloat64(a);this.writeUint32(jspb.utils.split64Low);this.writeUint32(jspb.utils.split64High)};jspb.BinaryEncoder.prototype.writeBool=function(a){goog.asserts.assert(goog.isBoolean(a)||goog.isNumber(a));this.buffer_.push(a?1:0)};
jspb.BinaryEncoder.prototype.writeEnum=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_31&&a<jspb.BinaryConstants.TWO_TO_31);this.writeSignedVarint32(a)};jspb.BinaryEncoder.prototype.writeBytes=function(a){this.buffer_.push.apply(this.buffer_,a)};jspb.BinaryEncoder.prototype.writeVarintHash64=function(a){jspb.utils.splitHash64(a);this.writeSplitVarint64(jspb.utils.split64Low,jspb.utils.split64High)};
jspb.BinaryEncoder.prototype.writeFixedHash64=function(a){jspb.utils.splitHash64(a);this.writeUint32(jspb.utils.split64Low);this.writeUint32(jspb.utils.split64High)};
jspb.BinaryEncoder.prototype.writeString=function(a){for(var b=this.buffer_.length,c=0;c<a.length;c++){var d=a.charCodeAt(c);if(128>d)this.buffer_.push(d);else if(2048>d)this.buffer_.push(d>>6|192),this.buffer_.push(d&63|128);else if(65536>d)if(55296<=d&&56319>=d&&c+1<a.length){var e=a.charCodeAt(c+1);56320<=e&&57343>=e&&(d=1024*(d-55296)+e-56320+65536,this.buffer_.push(d>>18|240),this.buffer_.push(d>>12&63|128),this.buffer_.push(d>>6&63|128),this.buffer_.push(d&63|128),c++)}else this.buffer_.push(d>>
12|224),this.buffer_.push(d>>6&63|128),this.buffer_.push(d&63|128)}return this.buffer_.length-b};jspb.BinaryWriter=function(){this.blocks_=[];this.totalLength_=0;this.encoder_=new jspb.BinaryEncoder;this.bookmarks_=[]};jspb.BinaryWriter.prototype.appendUint8Array_=function(a){var b=this.encoder_.end();this.blocks_.push(b);this.blocks_.push(a);this.totalLength_+=b.length+a.length};
jspb.BinaryWriter.prototype.beginDelimited_=function(a){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);a=this.encoder_.end();this.blocks_.push(a);this.totalLength_+=a.length;a.push(this.totalLength_);return a};jspb.BinaryWriter.prototype.endDelimited_=function(a){var b=a.pop(),b=this.totalLength_+this.encoder_.length()-b;for(goog.asserts.assert(0<=b);127<b;)a.push(b&127|128),b>>>=7,this.totalLength_++;a.push(b);this.totalLength_++};
jspb.BinaryWriter.prototype.writeSerializedMessage=function(a,b,c){this.appendUint8Array_(a.subarray(b,c))};jspb.BinaryWriter.prototype.maybeWriteSerializedMessage=function(a,b,c){null!=a&&null!=b&&null!=c&&this.writeSerializedMessage(a,b,c)};jspb.BinaryWriter.prototype.reset=function(){this.blocks_=[];this.encoder_.end();this.totalLength_=0;this.bookmarks_=[]};
jspb.BinaryWriter.prototype.getResultBuffer=function(){goog.asserts.assert(0==this.bookmarks_.length);for(var a=new Uint8Array(this.totalLength_+this.encoder_.length()),b=this.blocks_,c=b.length,d=0,e=0;e<c;e++){var f=b[e];a.set(f,d);d+=f.length}b=this.encoder_.end();a.set(b,d);d+=b.length;goog.asserts.assert(d==a.length);this.blocks_=[a];return a};jspb.BinaryWriter.prototype.getResultBase64String=function(){return goog.crypt.base64.encodeByteArray(this.getResultBuffer())};
jspb.BinaryWriter.prototype.beginSubMessage=function(a){this.bookmarks_.push(this.beginDelimited_(a))};jspb.BinaryWriter.prototype.endSubMessage=function(){goog.asserts.assert(0<=this.bookmarks_.length);this.endDelimited_(this.bookmarks_.pop())};jspb.BinaryWriter.prototype.writeFieldHeader_=function(a,b){goog.asserts.assert(1<=a&&a==Math.floor(a));this.encoder_.writeUnsignedVarint32(8*a+b)};
jspb.BinaryWriter.prototype.writeAny=function(a,b,c){var d=jspb.BinaryConstants.FieldType;switch(a){case d.DOUBLE:this.writeDouble(b,c);break;case d.FLOAT:this.writeFloat(b,c);break;case d.INT64:this.writeInt64(b,c);break;case d.UINT64:this.writeUint64(b,c);break;case d.INT32:this.writeInt32(b,c);break;case d.FIXED64:this.writeFixed64(b,c);break;case d.FIXED32:this.writeFixed32(b,c);break;case d.BOOL:this.writeBool(b,c);break;case d.STRING:this.writeString(b,c);break;case d.GROUP:goog.asserts.fail("Group field type not supported in writeAny()");
break;case d.MESSAGE:goog.asserts.fail("Message field type not supported in writeAny()");break;case d.BYTES:this.writeBytes(b,c);break;case d.UINT32:this.writeUint32(b,c);break;case d.ENUM:this.writeEnum(b,c);break;case d.SFIXED32:this.writeSfixed32(b,c);break;case d.SFIXED64:this.writeSfixed64(b,c);break;case d.SINT32:this.writeSint32(b,c);break;case d.SINT64:this.writeSint64(b,c);break;case d.FHASH64:this.writeFixedHash64(b,c);break;case d.VHASH64:this.writeVarintHash64(b,c);break;default:goog.asserts.fail("Invalid field type in writeAny()")}};
jspb.BinaryWriter.prototype.writeUnsignedVarint32_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeUnsignedVarint32(b))};jspb.BinaryWriter.prototype.writeSignedVarint32_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeSignedVarint32(b))};jspb.BinaryWriter.prototype.writeUnsignedVarint64_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeUnsignedVarint64(b))};
jspb.BinaryWriter.prototype.writeSignedVarint64_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeSignedVarint64(b))};jspb.BinaryWriter.prototype.writeZigzagVarint32_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeZigzagVarint32(b))};jspb.BinaryWriter.prototype.writeZigzagVarint64_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeZigzagVarint64(b))};
jspb.BinaryWriter.prototype.writeZigzagVarint64String_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeZigzagVarint64String(b))};jspb.BinaryWriter.prototype.writeInt32=function(a,b){null!=b&&(goog.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_31&&b<jspb.BinaryConstants.TWO_TO_31),this.writeSignedVarint32_(a,b))};
jspb.BinaryWriter.prototype.writeInt32String=function(a,b){if(null!=b){var c=parseInt(b,10);goog.asserts.assert(c>=-jspb.BinaryConstants.TWO_TO_31&&c<jspb.BinaryConstants.TWO_TO_31);this.writeSignedVarint32_(a,c)}};jspb.BinaryWriter.prototype.writeInt64=function(a,b){null!=b&&(goog.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_63&&b<jspb.BinaryConstants.TWO_TO_63),this.writeSignedVarint64_(a,b))};
jspb.BinaryWriter.prototype.writeInt64String=function(a,b){if(null!=b){var c=jspb.arith.Int64.fromString(b);this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT);this.encoder_.writeSplitVarint64(c.lo,c.hi)}};jspb.BinaryWriter.prototype.writeUint32=function(a,b){null!=b&&(goog.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_32),this.writeUnsignedVarint32_(a,b))};
jspb.BinaryWriter.prototype.writeUint32String=function(a,b){if(null!=b){var c=parseInt(b,10);goog.asserts.assert(0<=c&&c<jspb.BinaryConstants.TWO_TO_32);this.writeUnsignedVarint32_(a,c)}};jspb.BinaryWriter.prototype.writeUint64=function(a,b){null!=b&&(goog.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_64),this.writeUnsignedVarint64_(a,b))};
jspb.BinaryWriter.prototype.writeUint64String=function(a,b){if(null!=b){var c=jspb.arith.UInt64.fromString(b);this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT);this.encoder_.writeSplitVarint64(c.lo,c.hi)}};jspb.BinaryWriter.prototype.writeSint32=function(a,b){null!=b&&(goog.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_31&&b<jspb.BinaryConstants.TWO_TO_31),this.writeZigzagVarint32_(a,b))};
jspb.BinaryWriter.prototype.writeSint64=function(a,b){null!=b&&(goog.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_63&&b<jspb.BinaryConstants.TWO_TO_63),this.writeZigzagVarint64_(a,b))};jspb.BinaryWriter.prototype.writeSint64String=function(a,b){null!=b&&(goog.asserts.assert(+b>=-jspb.BinaryConstants.TWO_TO_63&&+b<jspb.BinaryConstants.TWO_TO_63),this.writeZigzagVarint64String_(a,b))};
jspb.BinaryWriter.prototype.writeFixed32=function(a,b){null!=b&&(goog.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_32),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED32),this.encoder_.writeUint32(b))};jspb.BinaryWriter.prototype.writeFixed64=function(a,b){null!=b&&(goog.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_64),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64),this.encoder_.writeUint64(b))};
jspb.BinaryWriter.prototype.writeFixed64String=function(a,b){if(null!=b){var c=jspb.arith.UInt64.fromString(b);this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64);this.encoder_.writeSplitFixed64(c.lo,c.hi)}};jspb.BinaryWriter.prototype.writeSfixed32=function(a,b){null!=b&&(goog.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_31&&b<jspb.BinaryConstants.TWO_TO_31),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED32),this.encoder_.writeInt32(b))};
jspb.BinaryWriter.prototype.writeSfixed64=function(a,b){null!=b&&(goog.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_63&&b<jspb.BinaryConstants.TWO_TO_63),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64),this.encoder_.writeInt64(b))};jspb.BinaryWriter.prototype.writeSfixed64String=function(a,b){if(null!=b){var c=jspb.arith.Int64.fromString(b);this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64);this.encoder_.writeSplitFixed64(c.lo,c.hi)}};
jspb.BinaryWriter.prototype.writeFloat=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED32),this.encoder_.writeFloat(b))};jspb.BinaryWriter.prototype.writeDouble=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64),this.encoder_.writeDouble(b))};jspb.BinaryWriter.prototype.writeBool=function(a,b){null!=b&&(goog.asserts.assert(goog.isBoolean(b)||goog.isNumber(b)),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeBool(b))};
jspb.BinaryWriter.prototype.writeEnum=function(a,b){null!=b&&(goog.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_31&&b<jspb.BinaryConstants.TWO_TO_31),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeSignedVarint32(b))};jspb.BinaryWriter.prototype.writeString=function(a,b){if(null!=b){var c=this.beginDelimited_(a);this.encoder_.writeString(b);this.endDelimited_(c)}};
jspb.BinaryWriter.prototype.writeBytes=function(a,b){if(null!=b){var c=jspb.utils.byteSourceToUint8Array(b);this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(c.length);this.appendUint8Array_(c)}};jspb.BinaryWriter.prototype.writeMessage=function(a,b,c){null!=b&&(a=this.beginDelimited_(a),c(b,this),this.endDelimited_(a))};
jspb.BinaryWriter.prototype.writeGroup=function(a,b,c){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.START_GROUP),c(b,this),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.END_GROUP))};jspb.BinaryWriter.prototype.writeFixedHash64=function(a,b){null!=b&&(goog.asserts.assert(8==b.length),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64),this.encoder_.writeFixedHash64(b))};
jspb.BinaryWriter.prototype.writeVarintHash64=function(a,b){null!=b&&(goog.asserts.assert(8==b.length),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeVarintHash64(b))};jspb.BinaryWriter.prototype.writeRepeatedInt32=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeSignedVarint32_(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedInt32String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeInt32String(a,b[c])};
jspb.BinaryWriter.prototype.writeRepeatedInt64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeSignedVarint64_(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedInt64String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeInt64String(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedUint32=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeUnsignedVarint32_(a,b[c])};
jspb.BinaryWriter.prototype.writeRepeatedUint32String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeUint32String(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedUint64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeUnsignedVarint64_(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedUint64String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeUint64String(a,b[c])};
jspb.BinaryWriter.prototype.writeRepeatedSint32=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeZigzagVarint32_(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedSint64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeZigzagVarint64_(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedSint64String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeZigzagVarint64String_(a,b[c])};
jspb.BinaryWriter.prototype.writeRepeatedFixed32=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeFixed32(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedFixed64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeFixed64(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedFixed64String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeFixed64String(a,b[c])};
jspb.BinaryWriter.prototype.writeRepeatedSfixed32=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeSfixed32(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedSfixed64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeSfixed64(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedSfixed64String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeSfixed64String(a,b[c])};
jspb.BinaryWriter.prototype.writeRepeatedFloat=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeFloat(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedDouble=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeDouble(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedBool=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeBool(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedEnum=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeEnum(a,b[c])};
jspb.BinaryWriter.prototype.writeRepeatedString=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeString(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedBytes=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeBytes(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedMessage=function(a,b,c){if(null!=b)for(var d=0;d<b.length;d++){var e=this.beginDelimited_(a);c(b[d],this);this.endDelimited_(e)}};
jspb.BinaryWriter.prototype.writeRepeatedGroup=function(a,b,c){if(null!=b)for(var d=0;d<b.length;d++)this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.START_GROUP),c(b[d],this),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.END_GROUP)};jspb.BinaryWriter.prototype.writeRepeatedFixedHash64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeFixedHash64(a,b[c])};
jspb.BinaryWriter.prototype.writeRepeatedVarintHash64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeVarintHash64(a,b[c])};jspb.BinaryWriter.prototype.writePackedInt32=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeSignedVarint32(b[d]);this.endDelimited_(c)}};
jspb.BinaryWriter.prototype.writePackedInt32String=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeSignedVarint32(parseInt(b[d],10));this.endDelimited_(c)}};jspb.BinaryWriter.prototype.writePackedInt64=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeSignedVarint64(b[d]);this.endDelimited_(c)}};
jspb.BinaryWriter.prototype.writePackedInt64String=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++){var e=jspb.arith.Int64.fromString(b[d]);this.encoder_.writeSplitVarint64(e.lo,e.hi)}this.endDelimited_(c)}};jspb.BinaryWriter.prototype.writePackedUint32=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeUnsignedVarint32(b[d]);this.endDelimited_(c)}};
jspb.BinaryWriter.prototype.writePackedUint32String=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeUnsignedVarint32(parseInt(b[d],10));this.endDelimited_(c)}};jspb.BinaryWriter.prototype.writePackedUint64=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeUnsignedVarint64(b[d]);this.endDelimited_(c)}};
jspb.BinaryWriter.prototype.writePackedUint64String=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++){var e=jspb.arith.UInt64.fromString(b[d]);this.encoder_.writeSplitVarint64(e.lo,e.hi)}this.endDelimited_(c)}};jspb.BinaryWriter.prototype.writePackedSint32=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeZigzagVarint32(b[d]);this.endDelimited_(c)}};
jspb.BinaryWriter.prototype.writePackedSint64=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeZigzagVarint64(b[d]);this.endDelimited_(c)}};jspb.BinaryWriter.prototype.writePackedSint64String=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeZigzagVarint64(parseInt(b[d],10));this.endDelimited_(c)}};
jspb.BinaryWriter.prototype.writePackedFixed32=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(4*b.length);for(var c=0;c<b.length;c++)this.encoder_.writeUint32(b[c])}};jspb.BinaryWriter.prototype.writePackedFixed64=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(8*b.length);for(var c=0;c<b.length;c++)this.encoder_.writeUint64(b[c])}};
jspb.BinaryWriter.prototype.writePackedFixed64String=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(8*b.length);for(var c=0;c<b.length;c++){var d=jspb.arith.UInt64.fromString(b[c]);this.encoder_.writeSplitFixed64(d.lo,d.hi)}}};
jspb.BinaryWriter.prototype.writePackedSfixed32=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(4*b.length);for(var c=0;c<b.length;c++)this.encoder_.writeInt32(b[c])}};jspb.BinaryWriter.prototype.writePackedSfixed64=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(8*b.length);for(var c=0;c<b.length;c++)this.encoder_.writeInt64(b[c])}};
jspb.BinaryWriter.prototype.writePackedSfixed64String=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(8*b.length);for(var c=0;c<b.length;c++)this.encoder_.writeInt64String(b[c])}};jspb.BinaryWriter.prototype.writePackedFloat=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(4*b.length);for(var c=0;c<b.length;c++)this.encoder_.writeFloat(b[c])}};
jspb.BinaryWriter.prototype.writePackedDouble=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(8*b.length);for(var c=0;c<b.length;c++)this.encoder_.writeDouble(b[c])}};jspb.BinaryWriter.prototype.writePackedBool=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(b.length);for(var c=0;c<b.length;c++)this.encoder_.writeBool(b[c])}};
jspb.BinaryWriter.prototype.writePackedEnum=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeEnum(b[d]);this.endDelimited_(c)}};jspb.BinaryWriter.prototype.writePackedFixedHash64=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(8*b.length);for(var c=0;c<b.length;c++)this.encoder_.writeFixedHash64(b[c])}};
jspb.BinaryWriter.prototype.writePackedVarintHash64=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeVarintHash64(b[d]);this.endDelimited_(c)}};jspb.BinaryIterator=function(a,b,c){this.elements_=this.nextMethod_=this.decoder_=null;this.cursor_=0;this.nextValue_=null;this.atEnd_=!0;this.init_(a,b,c)};jspb.BinaryIterator.prototype.init_=function(a,b,c){a&&b&&(this.decoder_=a,this.nextMethod_=b);this.elements_=c||null;this.cursor_=0;this.nextValue_=null;this.atEnd_=!this.decoder_&&!this.elements_;this.next()};jspb.BinaryIterator.instanceCache_=[];
jspb.BinaryIterator.alloc=function(a,b,c){if(jspb.BinaryIterator.instanceCache_.length){var d=jspb.BinaryIterator.instanceCache_.pop();d.init_(a,b,c);return d}return new jspb.BinaryIterator(a,b,c)};jspb.BinaryIterator.prototype.free=function(){this.clear();100>jspb.BinaryIterator.instanceCache_.length&&jspb.BinaryIterator.instanceCache_.push(this)};
jspb.BinaryIterator.prototype.clear=function(){this.decoder_&&this.decoder_.free();this.elements_=this.nextMethod_=this.decoder_=null;this.cursor_=0;this.nextValue_=null;this.atEnd_=!0};jspb.BinaryIterator.prototype.get=function(){return this.nextValue_};jspb.BinaryIterator.prototype.atEnd=function(){return this.atEnd_};
jspb.BinaryIterator.prototype.next=function(){var a=this.nextValue_;this.decoder_?this.decoder_.atEnd()?(this.nextValue_=null,this.atEnd_=!0):this.nextValue_=this.nextMethod_.call(this.decoder_):this.elements_&&(this.cursor_==this.elements_.length?(this.nextValue_=null,this.atEnd_=!0):this.nextValue_=this.elements_[this.cursor_++]);return a};jspb.BinaryDecoder=function(a,b,c){this.bytes_=null;this.tempHigh_=this.tempLow_=this.cursor_=this.end_=this.start_=0;this.error_=!1;a&&this.setBlock(a,b,c)};
jspb.BinaryDecoder.instanceCache_=[];jspb.BinaryDecoder.alloc=function(a,b,c){if(jspb.BinaryDecoder.instanceCache_.length){var d=jspb.BinaryDecoder.instanceCache_.pop();a&&d.setBlock(a,b,c);return d}return new jspb.BinaryDecoder(a,b,c)};jspb.BinaryDecoder.prototype.free=function(){this.clear();100>jspb.BinaryDecoder.instanceCache_.length&&jspb.BinaryDecoder.instanceCache_.push(this)};jspb.BinaryDecoder.prototype.clone=function(){return jspb.BinaryDecoder.alloc(this.bytes_,this.start_,this.end_-this.start_)};
jspb.BinaryDecoder.prototype.clear=function(){this.bytes_=null;this.cursor_=this.end_=this.start_=0;this.error_=!1};jspb.BinaryDecoder.prototype.getBuffer=function(){return this.bytes_};jspb.BinaryDecoder.prototype.setBlock=function(a,b,c){this.bytes_=jspb.utils.byteSourceToUint8Array(a);this.start_=goog.isDef(b)?b:0;this.end_=goog.isDef(c)?this.start_+c:this.bytes_.length;this.cursor_=this.start_};jspb.BinaryDecoder.prototype.getEnd=function(){return this.end_};
jspb.BinaryDecoder.prototype.setEnd=function(a){this.end_=a};jspb.BinaryDecoder.prototype.reset=function(){this.cursor_=this.start_};jspb.BinaryDecoder.prototype.getCursor=function(){return this.cursor_};jspb.BinaryDecoder.prototype.setCursor=function(a){this.cursor_=a};jspb.BinaryDecoder.prototype.advance=function(a){this.cursor_+=a;goog.asserts.assert(this.cursor_<=this.end_)};jspb.BinaryDecoder.prototype.atEnd=function(){return this.cursor_==this.end_};
jspb.BinaryDecoder.prototype.pastEnd=function(){return this.cursor_>this.end_};jspb.BinaryDecoder.prototype.getError=function(){return this.error_||0>this.cursor_||this.cursor_>this.end_};
jspb.BinaryDecoder.prototype.readSplitVarint64_=function(){for(var a,b=0,c,d=0;4>d;d++)if(a=this.bytes_[this.cursor_++],b|=(a&127)<<7*d,128>a){this.tempLow_=b>>>0;this.tempHigh_=0;return}a=this.bytes_[this.cursor_++];b|=(a&127)<<28;c=0|(a&127)>>4;if(128>a)this.tempLow_=b>>>0,this.tempHigh_=c>>>0;else{for(d=0;5>d;d++)if(a=this.bytes_[this.cursor_++],c|=(a&127)<<7*d+3,128>a){this.tempLow_=b>>>0;this.tempHigh_=c>>>0;return}goog.asserts.fail("Failed to read varint, encoding is invalid.");this.error_=
!0}};jspb.BinaryDecoder.prototype.skipVarint=function(){for(;this.bytes_[this.cursor_]&128;)this.cursor_++;this.cursor_++};jspb.BinaryDecoder.prototype.unskipVarint=function(a){for(;128<a;)this.cursor_--,a>>>=7;this.cursor_--};
jspb.BinaryDecoder.prototype.readUnsignedVarint32=function(){var a,b=this.bytes_;a=b[this.cursor_+0];var c=a&127;if(128>a)return this.cursor_+=1,goog.asserts.assert(this.cursor_<=this.end_),c;a=b[this.cursor_+1];c|=(a&127)<<7;if(128>a)return this.cursor_+=2,goog.asserts.assert(this.cursor_<=this.end_),c;a=b[this.cursor_+2];c|=(a&127)<<14;if(128>a)return this.cursor_+=3,goog.asserts.assert(this.cursor_<=this.end_),c;a=b[this.cursor_+3];c|=(a&127)<<21;if(128>a)return this.cursor_+=4,goog.asserts.assert(this.cursor_<=
this.end_),c;a=b[this.cursor_+4];c|=(a&15)<<28;if(128>a)return this.cursor_+=5,goog.asserts.assert(this.cursor_<=this.end_),c>>>0;this.cursor_+=5;128<=b[this.cursor_++]&&128<=b[this.cursor_++]&&128<=b[this.cursor_++]&&128<=b[this.cursor_++]&&128<=b[this.cursor_++]&&goog.asserts.assert(!1);goog.asserts.assert(this.cursor_<=this.end_);return c};jspb.BinaryDecoder.prototype.readSignedVarint32=jspb.BinaryDecoder.prototype.readUnsignedVarint32;jspb.BinaryDecoder.prototype.readUnsignedVarint32String=function(){return this.readUnsignedVarint32().toString()};
jspb.BinaryDecoder.prototype.readSignedVarint32String=function(){return this.readSignedVarint32().toString()};jspb.BinaryDecoder.prototype.readZigzagVarint32=function(){var a=this.readUnsignedVarint32();return a>>>1^-(a&1)};jspb.BinaryDecoder.prototype.readUnsignedVarint64=function(){this.readSplitVarint64_();return jspb.utils.joinUint64(this.tempLow_,this.tempHigh_)};
jspb.BinaryDecoder.prototype.readUnsignedVarint64String=function(){this.readSplitVarint64_();return jspb.utils.joinUnsignedDecimalString(this.tempLow_,this.tempHigh_)};jspb.BinaryDecoder.prototype.readSignedVarint64=function(){this.readSplitVarint64_();return jspb.utils.joinInt64(this.tempLow_,this.tempHigh_)};jspb.BinaryDecoder.prototype.readSignedVarint64String=function(){this.readSplitVarint64_();return jspb.utils.joinSignedDecimalString(this.tempLow_,this.tempHigh_)};
jspb.BinaryDecoder.prototype.readZigzagVarint64=function(){this.readSplitVarint64_();return jspb.utils.joinZigzag64(this.tempLow_,this.tempHigh_)};jspb.BinaryDecoder.prototype.readZigzagVarint64String=function(){return this.readZigzagVarint64().toString()};jspb.BinaryDecoder.prototype.readUint8=function(){var a=this.bytes_[this.cursor_+0];this.cursor_+=1;goog.asserts.assert(this.cursor_<=this.end_);return a};
jspb.BinaryDecoder.prototype.readUint16=function(){var a=this.bytes_[this.cursor_+0],b=this.bytes_[this.cursor_+1];this.cursor_+=2;goog.asserts.assert(this.cursor_<=this.end_);return a<<0|b<<8};jspb.BinaryDecoder.prototype.readUint32=function(){var a=this.bytes_[this.cursor_+0],b=this.bytes_[this.cursor_+1],c=this.bytes_[this.cursor_+2],d=this.bytes_[this.cursor_+3];this.cursor_+=4;goog.asserts.assert(this.cursor_<=this.end_);return(a<<0|b<<8|c<<16|d<<24)>>>0};
jspb.BinaryDecoder.prototype.readUint64=function(){var a=this.readUint32(),b=this.readUint32();return jspb.utils.joinUint64(a,b)};jspb.BinaryDecoder.prototype.readUint64String=function(){var a=this.readUint32(),b=this.readUint32();return jspb.utils.joinUnsignedDecimalString(a,b)};jspb.BinaryDecoder.prototype.readInt8=function(){var a=this.bytes_[this.cursor_+0];this.cursor_+=1;goog.asserts.assert(this.cursor_<=this.end_);return a<<24>>24};
jspb.BinaryDecoder.prototype.readInt16=function(){var a=this.bytes_[this.cursor_+0],b=this.bytes_[this.cursor_+1];this.cursor_+=2;goog.asserts.assert(this.cursor_<=this.end_);return(a<<0|b<<8)<<16>>16};jspb.BinaryDecoder.prototype.readInt32=function(){var a=this.bytes_[this.cursor_+0],b=this.bytes_[this.cursor_+1],c=this.bytes_[this.cursor_+2],d=this.bytes_[this.cursor_+3];this.cursor_+=4;goog.asserts.assert(this.cursor_<=this.end_);return a<<0|b<<8|c<<16|d<<24};
jspb.BinaryDecoder.prototype.readInt64=function(){var a=this.readUint32(),b=this.readUint32();return jspb.utils.joinInt64(a,b)};jspb.BinaryDecoder.prototype.readInt64String=function(){var a=this.readUint32(),b=this.readUint32();return jspb.utils.joinSignedDecimalString(a,b)};jspb.BinaryDecoder.prototype.readFloat=function(){var a=this.readUint32();return jspb.utils.joinFloat32(a,0)};
jspb.BinaryDecoder.prototype.readDouble=function(){var a=this.readUint32(),b=this.readUint32();return jspb.utils.joinFloat64(a,b)};jspb.BinaryDecoder.prototype.readBool=function(){return!!this.bytes_[this.cursor_++]};jspb.BinaryDecoder.prototype.readEnum=function(){return this.readSignedVarint32()};
jspb.BinaryDecoder.prototype.readString=function(a){var b=this.bytes_,c=this.cursor_;a=c+a;for(var d=[],e="";c<a;){var f=b[c++];if(128>f)d.push(f);else if(192>f)continue;else if(224>f){var g=b[c++];d.push((f&31)<<6|g&63)}else if(240>f){var g=b[c++],h=b[c++];d.push((f&15)<<12|(g&63)<<6|h&63)}else if(248>f){var g=b[c++],h=b[c++],k=b[c++],f=(f&7)<<18|(g&63)<<12|(h&63)<<6|k&63,f=f-65536;d.push((f>>10&1023)+55296,(f&1023)+56320)}8192<=d.length&&(e+=String.fromCharCode.apply(null,d),d.length=0)}e+=goog.crypt.byteArrayToString(d);
this.cursor_=c;return e};jspb.BinaryDecoder.prototype.readStringWithLength=function(){var a=this.readUnsignedVarint32();return this.readString(a)};jspb.BinaryDecoder.prototype.readBytes=function(a){if(0>a||this.cursor_+a>this.bytes_.length)return this.error_=!0,goog.asserts.fail("Invalid byte length!"),new Uint8Array(0);var b=this.bytes_.subarray(this.cursor_,this.cursor_+a);this.cursor_+=a;goog.asserts.assert(this.cursor_<=this.end_);return b};
jspb.BinaryDecoder.prototype.readVarintHash64=function(){this.readSplitVarint64_();return jspb.utils.joinHash64(this.tempLow_,this.tempHigh_)};jspb.BinaryDecoder.prototype.readFixedHash64=function(){var a=this.bytes_,b=this.cursor_,c=a[b+0],d=a[b+1],e=a[b+2],f=a[b+3],g=a[b+4],h=a[b+5],k=a[b+6],a=a[b+7];this.cursor_+=8;return String.fromCharCode(c,d,e,f,g,h,k,a)};jspb.BinaryReader=function(a,b,c){this.decoder_=jspb.BinaryDecoder.alloc(a,b,c);this.fieldCursor_=this.decoder_.getCursor();this.nextField_=jspb.BinaryConstants.INVALID_FIELD_NUMBER;this.nextWireType_=jspb.BinaryConstants.WireType.INVALID;this.error_=!1;this.readCallbacks_=null};jspb.BinaryReader.instanceCache_=[];
jspb.BinaryReader.alloc=function(a,b,c){if(jspb.BinaryReader.instanceCache_.length){var d=jspb.BinaryReader.instanceCache_.pop();a&&d.decoder_.setBlock(a,b,c);return d}return new jspb.BinaryReader(a,b,c)};jspb.BinaryReader.prototype.alloc=jspb.BinaryReader.alloc;
jspb.BinaryReader.prototype.free=function(){this.decoder_.clear();this.nextField_=jspb.BinaryConstants.INVALID_FIELD_NUMBER;this.nextWireType_=jspb.BinaryConstants.WireType.INVALID;this.error_=!1;this.readCallbacks_=null;100>jspb.BinaryReader.instanceCache_.length&&jspb.BinaryReader.instanceCache_.push(this)};jspb.BinaryReader.prototype.getFieldCursor=function(){return this.fieldCursor_};jspb.BinaryReader.prototype.getCursor=function(){return this.decoder_.getCursor()};
jspb.BinaryReader.prototype.getBuffer=function(){return this.decoder_.getBuffer()};jspb.BinaryReader.prototype.getFieldNumber=function(){return this.nextField_};jspb.BinaryReader.prototype.getWireType=function(){return this.nextWireType_};jspb.BinaryReader.prototype.isEndGroup=function(){return this.nextWireType_==jspb.BinaryConstants.WireType.END_GROUP};jspb.BinaryReader.prototype.getError=function(){return this.error_||this.decoder_.getError()};
jspb.BinaryReader.prototype.setBlock=function(a,b,c){this.decoder_.setBlock(a,b,c);this.nextField_=jspb.BinaryConstants.INVALID_FIELD_NUMBER;this.nextWireType_=jspb.BinaryConstants.WireType.INVALID};jspb.BinaryReader.prototype.reset=function(){this.decoder_.reset();this.nextField_=jspb.BinaryConstants.INVALID_FIELD_NUMBER;this.nextWireType_=jspb.BinaryConstants.WireType.INVALID};jspb.BinaryReader.prototype.advance=function(a){this.decoder_.advance(a)};
jspb.BinaryReader.prototype.nextField=function(){if(this.decoder_.atEnd())return!1;if(this.getError())return goog.asserts.fail("Decoder hit an error"),!1;this.fieldCursor_=this.decoder_.getCursor();var a=this.decoder_.readUnsignedVarint32(),b=a>>>3,a=a&7;if(a!=jspb.BinaryConstants.WireType.VARINT&&a!=jspb.BinaryConstants.WireType.FIXED32&&a!=jspb.BinaryConstants.WireType.FIXED64&&a!=jspb.BinaryConstants.WireType.DELIMITED&&a!=jspb.BinaryConstants.WireType.START_GROUP&&a!=jspb.BinaryConstants.WireType.END_GROUP)return goog.asserts.fail("Invalid wire type"),
this.error_=!0,!1;this.nextField_=b;this.nextWireType_=a;return!0};jspb.BinaryReader.prototype.unskipHeader=function(){this.decoder_.unskipVarint(this.nextField_<<3|this.nextWireType_)};jspb.BinaryReader.prototype.skipMatchingFields=function(){var a=this.nextField_;for(this.unskipHeader();this.nextField()&&this.getFieldNumber()==a;)this.skipField();this.decoder_.atEnd()||this.unskipHeader()};
jspb.BinaryReader.prototype.skipVarintField=function(){this.nextWireType_!=jspb.BinaryConstants.WireType.VARINT?(goog.asserts.fail("Invalid wire type for skipVarintField"),this.skipField()):this.decoder_.skipVarint()};jspb.BinaryReader.prototype.skipDelimitedField=function(){if(this.nextWireType_!=jspb.BinaryConstants.WireType.DELIMITED)goog.asserts.fail("Invalid wire type for skipDelimitedField"),this.skipField();else{var a=this.decoder_.readUnsignedVarint32();this.decoder_.advance(a)}};
jspb.BinaryReader.prototype.skipFixed32Field=function(){this.nextWireType_!=jspb.BinaryConstants.WireType.FIXED32?(goog.asserts.fail("Invalid wire type for skipFixed32Field"),this.skipField()):this.decoder_.advance(4)};jspb.BinaryReader.prototype.skipFixed64Field=function(){this.nextWireType_!=jspb.BinaryConstants.WireType.FIXED64?(goog.asserts.fail("Invalid wire type for skipFixed64Field"),this.skipField()):this.decoder_.advance(8)};
jspb.BinaryReader.prototype.skipGroup=function(){var a=[this.nextField_];do{if(!this.nextField()){goog.asserts.fail("Unmatched start-group tag: stream EOF");this.error_=!0;break}if(this.nextWireType_==jspb.BinaryConstants.WireType.START_GROUP)a.push(this.nextField_);else if(this.nextWireType_==jspb.BinaryConstants.WireType.END_GROUP&&this.nextField_!=a.pop()){goog.asserts.fail("Unmatched end-group tag");this.error_=!0;break}}while(0<a.length)};
jspb.BinaryReader.prototype.skipField=function(){switch(this.nextWireType_){case jspb.BinaryConstants.WireType.VARINT:this.skipVarintField();break;case jspb.BinaryConstants.WireType.FIXED64:this.skipFixed64Field();break;case jspb.BinaryConstants.WireType.DELIMITED:this.skipDelimitedField();break;case jspb.BinaryConstants.WireType.FIXED32:this.skipFixed32Field();break;case jspb.BinaryConstants.WireType.START_GROUP:this.skipGroup();break;default:goog.asserts.fail("Invalid wire encoding for field.")}};
jspb.BinaryReader.prototype.registerReadCallback=function(a,b){goog.isNull(this.readCallbacks_)&&(this.readCallbacks_={});goog.asserts.assert(!this.readCallbacks_[a]);this.readCallbacks_[a]=b};jspb.BinaryReader.prototype.runReadCallback=function(a){goog.asserts.assert(!goog.isNull(this.readCallbacks_));a=this.readCallbacks_[a];goog.asserts.assert(a);return a(this)};
jspb.BinaryReader.prototype.readAny=function(a){this.nextWireType_=jspb.BinaryConstants.FieldTypeToWireType(a);var b=jspb.BinaryConstants.FieldType;switch(a){case b.DOUBLE:return this.readDouble();case b.FLOAT:return this.readFloat();case b.INT64:return this.readInt64();case b.UINT64:return this.readUint64();case b.INT32:return this.readInt32();case b.FIXED64:return this.readFixed64();case b.FIXED32:return this.readFixed32();case b.BOOL:return this.readBool();case b.STRING:return this.readString();
case b.GROUP:goog.asserts.fail("Group field type not supported in readAny()");case b.MESSAGE:goog.asserts.fail("Message field type not supported in readAny()");case b.BYTES:return this.readBytes();case b.UINT32:return this.readUint32();case b.ENUM:return this.readEnum();case b.SFIXED32:return this.readSfixed32();case b.SFIXED64:return this.readSfixed64();case b.SINT32:return this.readSint32();case b.SINT64:return this.readSint64();case b.FHASH64:return this.readFixedHash64();case b.VHASH64:return this.readVarintHash64();
default:goog.asserts.fail("Invalid field type in readAny()")}return 0};jspb.BinaryReader.prototype.readMessage=function(a,b){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.DELIMITED);var c=this.decoder_.getEnd(),d=this.decoder_.readUnsignedVarint32(),d=this.decoder_.getCursor()+d;this.decoder_.setEnd(d);b(a,this);this.decoder_.setCursor(d);this.decoder_.setEnd(c)};
jspb.BinaryReader.prototype.readGroup=function(a,b,c){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.START_GROUP);goog.asserts.assert(this.nextField_==a);c(b,this);this.error_||this.nextWireType_==jspb.BinaryConstants.WireType.END_GROUP||(goog.asserts.fail("Group submessage did not end with an END_GROUP tag"),this.error_=!0)};
jspb.BinaryReader.prototype.getFieldDecoder=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.DELIMITED);var a=this.decoder_.readUnsignedVarint32(),b=this.decoder_.getCursor(),c=b+a,a=jspb.BinaryDecoder.alloc(this.decoder_.getBuffer(),b,a);this.decoder_.setCursor(c);return a};jspb.BinaryReader.prototype.readInt32=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readSignedVarint32()};
jspb.BinaryReader.prototype.readInt32String=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readSignedVarint32String()};jspb.BinaryReader.prototype.readInt64=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readSignedVarint64()};jspb.BinaryReader.prototype.readInt64String=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readSignedVarint64String()};
jspb.BinaryReader.prototype.readUint32=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readUnsignedVarint32()};jspb.BinaryReader.prototype.readUint32String=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readUnsignedVarint32String()};jspb.BinaryReader.prototype.readUint64=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readUnsignedVarint64()};
jspb.BinaryReader.prototype.readUint64String=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readUnsignedVarint64String()};jspb.BinaryReader.prototype.readSint32=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readZigzagVarint32()};jspb.BinaryReader.prototype.readSint64=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readZigzagVarint64()};
jspb.BinaryReader.prototype.readSint64String=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readZigzagVarint64String()};jspb.BinaryReader.prototype.readFixed32=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED32);return this.decoder_.readUint32()};jspb.BinaryReader.prototype.readFixed64=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readUint64()};
jspb.BinaryReader.prototype.readFixed64String=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readUint64String()};jspb.BinaryReader.prototype.readSfixed32=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED32);return this.decoder_.readInt32()};jspb.BinaryReader.prototype.readSfixed32String=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED32);return this.decoder_.readInt32().toString()};
jspb.BinaryReader.prototype.readSfixed64=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readInt64()};jspb.BinaryReader.prototype.readSfixed64String=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readInt64String()};jspb.BinaryReader.prototype.readFloat=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED32);return this.decoder_.readFloat()};
jspb.BinaryReader.prototype.readDouble=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readDouble()};jspb.BinaryReader.prototype.readBool=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return!!this.decoder_.readUnsignedVarint32()};jspb.BinaryReader.prototype.readEnum=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readSignedVarint64()};
jspb.BinaryReader.prototype.readString=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.DELIMITED);var a=this.decoder_.readUnsignedVarint32();return this.decoder_.readString(a)};jspb.BinaryReader.prototype.readBytes=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.DELIMITED);var a=this.decoder_.readUnsignedVarint32();return this.decoder_.readBytes(a)};
jspb.BinaryReader.prototype.readVarintHash64=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readVarintHash64()};jspb.BinaryReader.prototype.readFixedHash64=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readFixedHash64()};
jspb.BinaryReader.prototype.readPackedField_=function(a){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.DELIMITED);for(var b=this.decoder_.readUnsignedVarint32(),b=this.decoder_.getCursor()+b,c=[];this.decoder_.getCursor()<b;)c.push(a.call(this.decoder_));return c};jspb.BinaryReader.prototype.readPackedInt32=function(){return this.readPackedField_(this.decoder_.readSignedVarint32)};jspb.BinaryReader.prototype.readPackedInt32String=function(){return this.readPackedField_(this.decoder_.readSignedVarint32String)};
jspb.BinaryReader.prototype.readPackedInt64=function(){return this.readPackedField_(this.decoder_.readSignedVarint64)};jspb.BinaryReader.prototype.readPackedInt64String=function(){return this.readPackedField_(this.decoder_.readSignedVarint64String)};jspb.BinaryReader.prototype.readPackedUint32=function(){return this.readPackedField_(this.decoder_.readUnsignedVarint32)};jspb.BinaryReader.prototype.readPackedUint32String=function(){return this.readPackedField_(this.decoder_.readUnsignedVarint32String)};
jspb.BinaryReader.prototype.readPackedUint64=function(){return this.readPackedField_(this.decoder_.readUnsignedVarint64)};jspb.BinaryReader.prototype.readPackedUint64String=function(){return this.readPackedField_(this.decoder_.readUnsignedVarint64String)};jspb.BinaryReader.prototype.readPackedSint32=function(){return this.readPackedField_(this.decoder_.readZigzagVarint32)};jspb.BinaryReader.prototype.readPackedSint64=function(){return this.readPackedField_(this.decoder_.readZigzagVarint64)};
jspb.BinaryReader.prototype.readPackedSint64String=function(){return this.readPackedField_(this.decoder_.readZigzagVarint64String)};jspb.BinaryReader.prototype.readPackedFixed32=function(){return this.readPackedField_(this.decoder_.readUint32)};jspb.BinaryReader.prototype.readPackedFixed64=function(){return this.readPackedField_(this.decoder_.readUint64)};jspb.BinaryReader.prototype.readPackedFixed64String=function(){return this.readPackedField_(this.decoder_.readUint64String)};
jspb.BinaryReader.prototype.readPackedSfixed32=function(){return this.readPackedField_(this.decoder_.readInt32)};jspb.BinaryReader.prototype.readPackedSfixed64=function(){return this.readPackedField_(this.decoder_.readInt64)};jspb.BinaryReader.prototype.readPackedSfixed64String=function(){return this.readPackedField_(this.decoder_.readInt64String)};jspb.BinaryReader.prototype.readPackedFloat=function(){return this.readPackedField_(this.decoder_.readFloat)};
jspb.BinaryReader.prototype.readPackedDouble=function(){return this.readPackedField_(this.decoder_.readDouble)};jspb.BinaryReader.prototype.readPackedBool=function(){return this.readPackedField_(this.decoder_.readBool)};jspb.BinaryReader.prototype.readPackedEnum=function(){return this.readPackedField_(this.decoder_.readEnum)};jspb.BinaryReader.prototype.readPackedVarintHash64=function(){return this.readPackedField_(this.decoder_.readVarintHash64)};
jspb.BinaryReader.prototype.readPackedFixedHash64=function(){return this.readPackedField_(this.decoder_.readFixedHash64)};jspb.Export={};exports.Map=jspb.Map;exports.Message=jspb.Message;exports.BinaryReader=jspb.BinaryReader;exports.BinaryWriter=jspb.BinaryWriter;exports.ExtensionFieldInfo=jspb.ExtensionFieldInfo;exports.ExtensionFieldBinaryInfo=jspb.ExtensionFieldBinaryInfo;exports.exportSymbol=goog.exportSymbol;exports.inherits=goog.inherits;exports.object={extend:goog.object.extend};exports.typeOf=goog.typeOf;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ })
/******/ ])});;