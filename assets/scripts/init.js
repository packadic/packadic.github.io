 
 ; /**
 * @license
 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash exports="amd,commonjs,global,none" include="each, find, isFunction, isNumber, isObject, isString, isUndefined, last, map, merge" --output ghpages/assets/scripts/plugins/lodash.custom.js`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '3.2.0';

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect named functions. */
  var reFuncName = /^\s*function[ \n\r\t]+\w/;

  /** Used to detect host constructors (Safari > 5). */
  var reHostCtor = /^\[object .+?Constructor\]$/;

  /**
   * Used to match `RegExp` special characters.
   * See this [article on `RegExp` characters](http://www.regular-expressions.info/characters.html#special)
   * for more details.
   */
  var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
      reHasRegExpChars = RegExp(reRegExpChars.source);

  /** Used to detect functions containing a `this` reference. */
  var reThis = /\bthis\b/;

  /** Used to fix the JScript `[[DontEnum]]` bug. */
  var shadowProps = [
    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
    'toLocaleString', 'toString', 'valueOf'
  ];

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
  cloneableTags[dateTag] = cloneableTags[float32Tag] =
  cloneableTags[float64Tag] = cloneableTags[int8Tag] =
  cloneableTags[int16Tag] = cloneableTags[int32Tag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[stringTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[mapTag] = cloneableTags[setTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it is the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = (objectTypes[typeof window] && window !== (this && this.window)) ? window : this;

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Converts `value` to a string if it is not one. An empty string is returned
   * for `null` or `undefined` values.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    if (typeof value == 'string') {
      return value;
    }
    return value == null ? '' : (value + '');
  }

  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */
  var isHostObject = (function() {
    try {
      Object({ 'toString': 0 } + '');
    } catch(e) {
      return function() { return false; };
    }
    return function(value) {
      // IE < 9 presents many host objects as `Object` objects that can coerce
      // to strings despite having improperly defined `toString` methods.
      return typeof value.toString != 'function' && typeof (value + '') == 'string';
    };
  }());

  /**
   * Checks if `value` is object-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   */
  function isObjectLike(value) {
    return (value && typeof value == 'object') || false;
  }

  /*--------------------------------------------------------------------------*/

  /** Used for native method references. */
  var arrayProto = Array.prototype,
      errorProto = Error.prototype,
      objectProto = Object.prototype,
      stringProto = String.prototype;

  /** Used to resolve the decompiled source of functions. */
  var fnToString = Function.prototype.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the `toStringTag` of values.
   * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
   * for more details.
   */
  var objToString = objectProto.toString;

  /** Used to detect if a method is native. */
  var reNative = RegExp('^' +
    escapeRegExp(objToString)
    .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /** Native method references. */
  var ArrayBuffer = isNative(ArrayBuffer = root.ArrayBuffer) && ArrayBuffer,
      bufferSlice = isNative(bufferSlice = ArrayBuffer && new ArrayBuffer(0).slice) && bufferSlice,
      floor = Math.floor,
      getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
      propertyIsEnumerable = objectProto.propertyIsEnumerable,
      splice = arrayProto.splice,
      Uint8Array = isNative(Uint8Array = root.Uint8Array) && Uint8Array,
      WeakMap = isNative(WeakMap = root.WeakMap) && WeakMap;

  /** Used to clone array buffers. */
  var Float64Array = (function() {
    // Safari 5 errors when using an array buffer to initialize a typed array
    // where the array buffer's `byteLength` is not a multiple of the typed
    // array's `BYTES_PER_ELEMENT`.
    try {
      var func = isNative(func = root.Float64Array) && func,
          result = new func(new ArrayBuffer(10), 0, 1) && func;
    } catch(e) {}
    return result;
  }());

  /* Native method references for those with the same name as other `lodash` methods. */
  var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
      nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

  /** Used as the size, in bytes, of each `Float64Array` element. */
  var FLOAT64_BYTES_PER_ELEMENT = Float64Array ? Float64Array.BYTES_PER_ELEMENT : 0;

  /**
   * Used as the maximum length of an array-like value.
   * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
   * for more details.
   */
  var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

  /** Used to store function metadata. */
  var metaMap = WeakMap && new WeakMap;

  /** Used to lookup a type array constructors by `toStringTag`. */
  var ctorByTag = {};
  ctorByTag[float32Tag] = root.Float32Array;
  ctorByTag[float64Tag] = root.Float64Array;
  ctorByTag[int8Tag] = root.Int8Array;
  ctorByTag[int16Tag] = root.Int16Array;
  ctorByTag[int32Tag] = root.Int32Array;
  ctorByTag[uint8Tag] = root.Uint8Array;
  ctorByTag[uint8ClampedTag] = root.Uint8ClampedArray;
  ctorByTag[uint16Tag] = root.Uint16Array;
  ctorByTag[uint32Tag] = root.Uint32Array;

  /** Used to avoid iterating over non-enumerable properties in IE < 9. */
  var nonEnumProps = {};
  nonEnumProps[arrayTag] = nonEnumProps[dateTag] = nonEnumProps[numberTag] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
  nonEnumProps[boolTag] = nonEnumProps[stringTag] = { 'constructor': true, 'toString': true, 'valueOf': true };
  nonEnumProps[errorTag] = nonEnumProps[funcTag] = nonEnumProps[regexpTag] = { 'constructor': true, 'toString': true };
  nonEnumProps[objectTag] = { 'constructor': true };

  arrayEach(shadowProps, function(key) {
    for (var tag in nonEnumProps) {
      if (hasOwnProperty.call(nonEnumProps, tag)) {
        var props = nonEnumProps[tag];
        props[key] = hasOwnProperty.call(props, key);
      }
    }
  });

  /*------------------------------------------------------------------------*/

  /**
   * Creates a `lodash` object which wraps `value` to enable implicit chaining.
   * Methods that operate on and return arrays, collections, and functions can
   * be chained together. Methods that return a boolean or single value will
   * automatically end the chain returning the unwrapped value. Explicit chaining
   * may be enabled using `_.chain`. The execution of chained methods is lazy,
   * that is, execution is deferred until `_#value` is implicitly or explicitly
   * called.
   *
   * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
   * fusion is an optimization that merges iteratees to avoid creating intermediate
   * arrays and reduce the number of iteratee executions.
   *
   * Chaining is supported in custom builds as long as the `_#value` method is
   * directly or indirectly included in the build.
   *
   * In addition to lodash methods, wrappers also have the following `Array` methods:
   * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
   * and `unshift`
   *
   * The wrapper methods that support shortcut fusion are:
   * `compact`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`,
   * `first`, `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`,
   * `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `toArray`,
   * and `where`
   *
   * The chainable wrapper methods are:
   * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
   * `callback`, `chain`, `chunk`, `commit`, `compact`, `concat`, `constant`,
   * `countBy`, `create`, `curry`, `debounce`, `defaults`, `defer`, `delay`,
   * `difference`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `fill`,
   * `filter`, `flatten`, `flattenDeep`, `flow`, `flowRight`, `forEach`,
   * `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `functions`,
   * `groupBy`, `indexBy`, `initial`, `intersection`, `invert`, `invoke`, `keys`,
   * `keysIn`, `map`, `mapValues`, `matches`, `memoize`, `merge`, `mixin`,
   * `negate`, `noop`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
   * `partition`, `pick`, `plant`, `pluck`, `property`, `propertyOf`, `pull`,
   * `pullAt`, `push`, `range`, `rearg`, `reject`, `remove`, `rest`, `reverse`,
   * `shuffle`, `slice`, `sort`, `sortBy`, `sortByAll`, `splice`, `spread`,
   * `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `tap`, `throttle`,
   * `thru`, `times`, `toArray`, `toPlainObject`, `transform`, `union`, `uniq`,
   * `unshift`, `unzip`, `values`, `valuesIn`, `where`, `without`, `wrap`, `xor`,
   * `zip`, and `zipObject`
   *
   * The wrapper methods that are **not** chainable by default are:
   * `attempt`, `camelCase`, `capitalize`, `clone`, `cloneDeep`, `deburr`,
   * `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`,
   * `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`, `has`,
   * `identity`, `includes`, `indexOf`, `isArguments`, `isArray`, `isBoolean`,
   * `isDate`, `isElement`, `isEmpty`, `isEqual`, `isError`, `isFinite`,
   * `isFunction`, `isMatch`, `isNative`, `isNaN`, `isNull`, `isNumber`,
   * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`,
   * `isTypedArray`, `join`, `kebabCase`, `last`, `lastIndexOf`, `max`, `min`,
   * `noConflict`, `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`,
   * `random`, `reduce`, `reduceRight`, `repeat`, `result`, `runInContext`,
   * `shift`, `size`, `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`,
   * `startCase`, `startsWith`, `template`, `trim`, `trimLeft`, `trimRight`,
   * `trunc`, `unescape`, `uniqueId`, `value`, and `words`
   *
   * The wrapper method `sample` will return a wrapped value when `n` is provided,
   * otherwise an unwrapped value is returned.
   *
   * @name _
   * @constructor
   * @category Chain
   * @param {*} value The value to wrap in a `lodash` instance.
   * @returns {Object} Returns the new `lodash` wrapper instance.
   * @example
   *
   * var wrapped = _([1, 2, 3]);
   *
   * // returns an unwrapped value
   * wrapped.reduce(function(sum, n) { return sum + n; });
   * // => 6
   *
   * // returns a wrapped value
   * var squares = wrapped.map(function(n) { return n * n; });
   *
   * _.isArray(squares);
   * // => false
   *
   * _.isArray(squares.value());
   * // => true
   */
  function lodash() {
    // No operation performed.
  }

  /**
   * An object environment feature flags.
   *
   * @static
   * @memberOf _
   * @type Object
   */
  var support = lodash.support = {};

  (function(x) {
    var Ctor = function() { this.x = 1; },
        object = { '0': 1, 'length': 1 },
        props = [];

    Ctor.prototype = { 'valueOf': 1, 'y': 1 };
    for (var key in new Ctor) { props.push(key); }

    /**
     * Detect if the `toStringTag` of `arguments` objects is resolvable
     * (all but Firefox < 4, IE < 9).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.argsTag = objToString.call(arguments) == argsTag;

    /**
     * Detect if `name` or `message` properties of `Error.prototype` are
     * enumerable by default (IE < 9, Safari < 5.1).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') ||
      propertyIsEnumerable.call(errorProto, 'name');

    /**
     * Detect if `prototype` properties are enumerable by default.
     *
     * Firefox < 3.6, Opera > 9.50 - Opera < 11.60, and Safari < 5.1
     * (if the prototype or a property on the prototype has been set)
     * incorrectly set the `[[Enumerable]]` value of a function's `prototype`
     * property to `true`.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.enumPrototypes = propertyIsEnumerable.call(Ctor, 'prototype');

    /**
     * Detect if functions can be decompiled by `Function#toString`
     * (all but Firefox OS certified apps, older Opera mobile browsers, and
     * the PlayStation 3; forced `false` for Windows 8 apps).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcDecomp = !isNative(root.WinRTError) && reThis.test(function() { return this; });

    /**
     * Detect if `Function#name` is supported (all but IE).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcNames = typeof Function.name == 'string';

    /**
     * Detect if string indexes are non-enumerable
     * (IE < 9, RingoJS, Rhino, Narwhal).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.nonEnumStrings = !propertyIsEnumerable.call('x', 0);

    /**
     * Detect if properties shadowing those on `Object.prototype` are
     * non-enumerable.
     *
     * In IE < 9 an object's own properties, shadowing non-enumerable ones,
     * are made non-enumerable as well (a.k.a the JScript `[[DontEnum]]` bug).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.nonEnumShadows = !/valueOf/.test(props);

    /**
     * Detect if own properties are iterated after inherited properties (IE < 9).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.ownLast = props[0] != 'x';

    /**
     * Detect if `Array#shift` and `Array#splice` augment array-like objects
     * correctly.
     *
     * Firefox < 10, compatibility modes of IE 8, and IE < 9 have buggy Array `shift()`
     * and `splice()` functions that fail to remove the last element, `value[0]`,
     * of array-like objects even though the `length` property is set to `0`.
     * The `shift()` method is buggy in compatibility modes of IE 8, while `splice()`
     * is buggy regardless of mode in IE < 9.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.spliceObjects = (splice.call(object, 0, 1), !object[0]);

    /**
     * Detect lack of support for accessing string characters by index.
     *
     * IE < 8 can't access characters by index. IE 8 can only access characters
     * by index on string literals, not string objects.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.unindexedChars = ('x'[0] + Object('x')[0]) != 'xx';

    /**
     * Detect if `arguments` object indexes are non-enumerable.
     *
     * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
     * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
     * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
     * checks for indexes that exceed their function's formal parameters with
     * associated values of `0`.
     *
     * @memberOf _.support
     * @type boolean
     */
    try {
      support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
    } catch(e) {
      support.nonEnumArgs = true;
    }
  }(0, 0));

  /*------------------------------------------------------------------------*/

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function arrayCopy(source, array) {
    var index = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for callback
   * shorthands or `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.map` for arrays without support for callback
   * shorthands or `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Copies the properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Array} props The property names to copy.
   * @returns {Object} Returns `object`.
   */
  function baseCopy(source, object, props) {
    if (!props) {
      props = object;
      object = {};
    }
    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];
      object[key] = source[key];
    }
    return object;
  }

  /**
   * The base implementation of `_.callback` which supports specifying the
   * number of arguments to provide to `func`.
   *
   * @private
   * @param {*} [func=_.identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {number} [argCount] The number of arguments to provide to `func`.
   * @returns {Function} Returns the callback.
   */
  function baseCallback(func, thisArg, argCount) {
    var type = typeof func;
    if (type == 'function') {
      return (typeof thisArg != 'undefined' && isBindable(func))
        ? bindCallback(func, thisArg, argCount)
        : func;
    }
    if (func == null) {
      return identity;
    }
    if (type == 'object') {
      return baseMatches(func);
    }
    return typeof thisArg == 'undefined'
      ? baseProperty(func + '')
      : baseMatchesProperty(func + '', thisArg);
  }

  /**
   * The base implementation of `_.clone` without support for argument juggling
   * and `this` binding `customizer` functions.
   *
   * @private
   * @param {*} value The value to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @param {Function} [customizer] The function to customize cloning values.
   * @param {string} [key] The key of `value`.
   * @param {Object} [object] The object `value` belongs to.
   * @param {Array} [stackA=[]] Tracks traversed source objects.
   * @param {Array} [stackB=[]] Associates clones with source counterparts.
   * @returns {*} Returns the cloned value.
   */
  function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
    var result;
    if (customizer) {
      result = object ? customizer(value, key, object) : customizer(value);
    }
    if (typeof result != 'undefined') {
      return result;
    }
    if (!isObject(value)) {
      return value;
    }
    var isArr = isArray(value);
    if (isArr) {
      result = initCloneArray(value);
      if (!isDeep) {
        return arrayCopy(value, result);
      }
    } else {
      var tag = objToString.call(value),
          isFunc = tag == funcTag;

      if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
        if (isHostObject(value)) {
          return object ? value : {};
        }
        result = initCloneObject(isFunc ? {} : value);
        if (!isDeep) {
          return baseCopy(value, result, keys(value));
        }
      } else {
        return cloneableTags[tag]
          ? initCloneByTag(value, tag, isDeep)
          : (object ? value : {});
      }
    }
    // Check for circular references and return corresponding clone.
    stackA || (stackA = []);
    stackB || (stackB = []);

    var length = stackA.length;
    while (length--) {
      if (stackA[length] == value) {
        return stackB[length];
      }
    }
    // Add the source value to the stack of traversed objects and associate it with its clone.
    stackA.push(value);
    stackB.push(result);

    // Recursively populate clone (susceptible to call stack limits).
    (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
      result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
    });
    return result;
  }

  /**
   * The base implementation of `_.forEach` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object|string} Returns `collection`.
   */
  function baseEach(collection, iteratee) {
    var length = collection ? collection.length : 0;
    if (!isLength(length)) {
      return baseForOwn(collection, iteratee);
    }
    var index = -1,
        iterable = toObject(collection);

    while (++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  }

  /**
   * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
   * without support for callback shorthands and `this` binding, which iterates
   * over `collection` using the provided `eachFunc`.
   *
   * @private
   * @param {Array|Object|string} collection The collection to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @param {boolean} [retKey] Specify returning the key of the found element
   *  instead of the element itself.
   * @returns {*} Returns the found element or its key, else `undefined`.
   */
  function baseFind(collection, predicate, eachFunc, retKey) {
    var result;
    eachFunc(collection, function(value, key, collection) {
      if (predicate(value, key, collection)) {
        result = retKey ? key : value;
        return false;
      }
    });
    return result;
  }

  /**
   * The base implementation of `baseForIn` and `baseForOwn` which iterates
   * over `object` properties returned by `keysFunc` invoking `iteratee` for
   * each property. Iterator functions may exit iteration early by explicitly
   * returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */
  function baseFor(object, iteratee, keysFunc) {
    var index = -1,
        iterable = toObject(object),
        props = keysFunc(object),
        length = props.length;

    while (++index < length) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  }

  /**
   * The base implementation of `_.forIn` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForIn(object, iteratee) {
    return baseFor(object, iteratee, keysIn);
  }

  /**
   * The base implementation of `_.forOwn` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForOwn(object, iteratee) {
    return baseFor(object, iteratee, keys);
  }

  /**
   * The base implementation of `_.isEqual` without support for `this` binding
   * `customizer` functions.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {Function} [customizer] The function to customize comparing values.
   * @param {boolean} [isWhere] Specify performing partial comparisons.
   * @param {Array} [stackA] Tracks traversed `value` objects.
   * @param {Array} [stackB] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */
  function baseIsEqual(value, other, customizer, isWhere, stackA, stackB) {
    // Exit early for identical values.
    if (value === other) {
      // Treat `+0` vs. `-0` as not equal.
      return value !== 0 || (1 / value == 1 / other);
    }
    var valType = typeof value,
        othType = typeof other;

    // Exit early for unlike primitive values.
    if ((valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object') ||
        value == null || other == null) {
      // Return `false` unless both values are `NaN`.
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, baseIsEqual, customizer, isWhere, stackA, stackB);
  }

  /**
   * A specialized version of `baseIsEqual` for arrays and objects which performs
   * deep comparisons and tracks traversed objects enabling objects with circular
   * references to be compared.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} [customizer] The function to customize comparing objects.
   * @param {boolean} [isWhere] Specify performing partial comparisons.
   * @param {Array} [stackA=[]] Tracks traversed `value` objects.
   * @param {Array} [stackB=[]] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function baseIsEqualDeep(object, other, equalFunc, customizer, isWhere, stackA, stackB) {
    var objIsArr = isArray(object),
        othIsArr = isArray(other),
        objTag = arrayTag,
        othTag = arrayTag;

    if (!objIsArr) {
      objTag = objToString.call(object);
      if (objTag == argsTag) {
        objTag = objectTag;
      } else if (objTag != objectTag) {
        objIsArr = isTypedArray(object);
      }
    }
    if (!othIsArr) {
      othTag = objToString.call(other);
      if (othTag == argsTag) {
        othTag = objectTag;
      } else if (othTag != objectTag) {
        othIsArr = isTypedArray(other);
      }
    }
    var objIsObj = objTag == objectTag && !isHostObject(object),
        othIsObj = othTag == objectTag && !isHostObject(other),
        isSameTag = objTag == othTag;

    if (isSameTag && !(objIsArr || objIsObj)) {
      return equalByTag(object, other, objTag);
    }
    var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (valWrapped || othWrapped) {
      return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isWhere, stackA, stackB);
    }
    if (!isSameTag) {
      return false;
    }
    // Assume cyclic values are equal.
    // For more information on detecting circular references see https://es5.github.io/#JO.
    stackA || (stackA = []);
    stackB || (stackB = []);

    var length = stackA.length;
    while (length--) {
      if (stackA[length] == object) {
        return stackB[length] == other;
      }
    }
    // Add `object` and `other` to the stack of traversed objects.
    stackA.push(object);
    stackB.push(other);

    var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isWhere, stackA, stackB);

    stackA.pop();
    stackB.pop();

    return result;
  }

  /**
   * The base implementation of `_.isMatch` without support for callback
   * shorthands or `this` binding.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {Array} props The source property names to match.
   * @param {Array} values The source values to match.
   * @param {Array} strictCompareFlags Strict comparison flags for source values.
   * @param {Function} [customizer] The function to customize comparing objects.
   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
   */
  function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
    var length = props.length;
    if (object == null) {
      return !length;
    }
    var index = -1,
        noCustomizer = !customizer;

    while (++index < length) {
      if ((noCustomizer && strictCompareFlags[index])
            ? values[index] !== object[props[index]]
            : !hasOwnProperty.call(object, props[index])
          ) {
        return false;
      }
    }
    index = -1;
    while (++index < length) {
      var key = props[index];
      if (noCustomizer && strictCompareFlags[index]) {
        var result = hasOwnProperty.call(object, key);
      } else {
        var objValue = object[key],
            srcValue = values[index];

        result = customizer ? customizer(objValue, srcValue, key) : undefined;
        if (typeof result == 'undefined') {
          result = baseIsEqual(srcValue, objValue, customizer, true);
        }
      }
      if (!result) {
        return false;
      }
    }
    return true;
  }

  /**
   * The base implementation of `_.map` without support for callback shorthands
   * or `this` binding.
   *
   * @private
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function baseMap(collection, iteratee) {
    var result = [];
    baseEach(collection, function(value, key, collection) {
      result.push(iteratee(value, key, collection));
    });
    return result;
  }

  /**
   * The base implementation of `_.matches` which does not clone `source`.
   *
   * @private
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new function.
   */
  function baseMatches(source) {
    var props = keys(source),
        length = props.length;

    if (length == 1) {
      var key = props[0],
          value = source[key];

      if (isStrictComparable(value)) {
        return function(object) {
          return object != null && value === object[key] && hasOwnProperty.call(object, key);
        };
      }
    }
    var values = Array(length),
        strictCompareFlags = Array(length);

    while (length--) {
      value = source[props[length]];
      values[length] = value;
      strictCompareFlags[length] = isStrictComparable(value);
    }
    return function(object) {
      return baseIsMatch(object, props, values, strictCompareFlags);
    };
  }

  /**
   * The base implementation of `_.matchesProperty` which does not coerce `key`
   * to a string.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @param {*} value The value to compare.
   * @returns {Function} Returns the new function.
   */
  function baseMatchesProperty(key, value) {
    if (isStrictComparable(value)) {
      return function(object) {
        return object != null && object[key] === value;
      };
    }
    return function(object) {
      return object != null && baseIsEqual(value, object[key], null, true);
    };
  }

  /**
   * The base implementation of `_.merge` without support for argument juggling,
   * multiple sources, and `this` binding `customizer` functions.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {Function} [customizer] The function to customize merging properties.
   * @param {Array} [stackA=[]] Tracks traversed source objects.
   * @param {Array} [stackB=[]] Associates values with source counterparts.
   * @returns {Object} Returns the destination object.
   */
  function baseMerge(object, source, customizer, stackA, stackB) {
    var isSrcArr = isLength(source.length) && (isArray(source) || isTypedArray(source));

    (isSrcArr ? arrayEach : baseForOwn)(source, function(srcValue, key, source) {
      if (isObjectLike(srcValue)) {
        stackA || (stackA = []);
        stackB || (stackB = []);
        return baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
      }
      var value = object[key],
          result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
          isCommon = typeof result == 'undefined';

      if (isCommon) {
        result = srcValue;
      }
      if ((isSrcArr || typeof result != 'undefined') &&
          (isCommon || (result === result ? result !== value : value === value))) {
        object[key] = result;
      }
    });
    return object;
  }

  /**
   * A specialized version of `baseMerge` for arrays and objects which performs
   * deep merges and tracks traversed objects enabling objects with circular
   * references to be merged.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {string} key The key of the value to merge.
   * @param {Function} mergeFunc The function to merge values.
   * @param {Function} [customizer] The function to customize merging properties.
   * @param {Array} [stackA=[]] Tracks traversed source objects.
   * @param {Array} [stackB=[]] Associates values with source counterparts.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
    var length = stackA.length,
        srcValue = source[key];

    while (length--) {
      if (stackA[length] == srcValue) {
        object[key] = stackB[length];
        return;
      }
    }
    var value = object[key],
        result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
        isCommon = typeof result == 'undefined';

    if (isCommon) {
      result = srcValue;
      if (isLength(srcValue.length) && (isArray(srcValue) || isTypedArray(srcValue))) {
        result = isArray(value)
          ? value
          : (value ? arrayCopy(value) : []);
      }
      else if (isPlainObject(srcValue) || isArguments(srcValue)) {
        result = isArguments(value)
          ? toPlainObject(value)
          : (isPlainObject(value) ? value : {});
      }
      else {
        isCommon = false;
      }
    }
    // Add the source value to the stack of traversed objects and associate
    // it with its merged value.
    stackA.push(srcValue);
    stackB.push(result);

    if (isCommon) {
      // Recursively merge objects and arrays (susceptible to call stack limits).
      object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
    } else if (result === result ? result !== value : value === value) {
      object[key] = result;
    }
  }

  /**
   * The base implementation of `_.property` which does not coerce `key` to a string.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `setData` without support for hot loop detection.
   *
   * @private
   * @param {Function} func The function to associate metadata with.
   * @param {*} data The metadata.
   * @returns {Function} Returns `func`.
   */
  var baseSetData = !metaMap ? identity : function(func, data) {
    metaMap.set(func, data);
    return func;
  };

  /**
   * A specialized version of `baseCallback` which only supports `this` binding
   * and specifying the number of arguments to provide to `func`.
   *
   * @private
   * @param {Function} func The function to bind.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {number} [argCount] The number of arguments to provide to `func`.
   * @returns {Function} Returns the callback.
   */
  function bindCallback(func, thisArg, argCount) {
    if (typeof func != 'function') {
      return identity;
    }
    if (typeof thisArg == 'undefined') {
      return func;
    }
    switch (argCount) {
      case 1: return function(value) {
        return func.call(thisArg, value);
      };
      case 3: return function(value, index, collection) {
        return func.call(thisArg, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(thisArg, accumulator, value, index, collection);
      };
      case 5: return function(value, other, key, object, source) {
        return func.call(thisArg, value, other, key, object, source);
      };
    }
    return function() {
      return func.apply(thisArg, arguments);
    };
  }

  /**
   * Creates a clone of the given array buffer.
   *
   * @private
   * @param {ArrayBuffer} buffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */
  function bufferClone(buffer) {
    return bufferSlice.call(buffer, 0);
  }
  if (!bufferSlice) {
    // PhantomJS has `ArrayBuffer` and `Uint8Array` but not `Float64Array`.
    bufferClone = !(ArrayBuffer && Uint8Array) ? constant(null) : function(buffer) {
      var byteLength = buffer.byteLength,
          floatLength = Float64Array ? floor(byteLength / FLOAT64_BYTES_PER_ELEMENT) : 0,
          offset = floatLength * FLOAT64_BYTES_PER_ELEMENT,
          result = new ArrayBuffer(byteLength);

      if (floatLength) {
        var view = new Float64Array(result, 0, floatLength);
        view.set(new Float64Array(buffer, 0, floatLength));
      }
      if (byteLength != offset) {
        view = new Uint8Array(result, offset);
        view.set(new Uint8Array(buffer, offset));
      }
      return result;
    };
  }

  /**
   * Creates a function that assigns properties of source object(s) to a given
   * destination object.
   *
   * @private
   * @param {Function} assigner The function to assign values.
   * @returns {Function} Returns the new assigner function.
   */
  function createAssigner(assigner) {
    return function() {
      var length = arguments.length,
          object = arguments[0];

      if (length < 2 || object == null) {
        return object;
      }
      if (length > 3 && isIterateeCall(arguments[1], arguments[2], arguments[3])) {
        length = 2;
      }
      // Juggle arguments.
      if (length > 3 && typeof arguments[length - 2] == 'function') {
        var customizer = bindCallback(arguments[--length - 1], arguments[length--], 5);
      } else if (length > 2 && typeof arguments[length - 1] == 'function') {
        customizer = arguments[--length];
      }
      var index = 0;
      while (++index < length) {
        var source = arguments[index];
        if (source) {
          assigner(object, source, customizer);
        }
      }
      return object;
    };
  }

  /**
   * A specialized version of `baseIsEqualDeep` for arrays with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Array} array The array to compare.
   * @param {Array} other The other array to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} [customizer] The function to customize comparing arrays.
   * @param {boolean} [isWhere] Specify performing partial comparisons.
   * @param {Array} [stackA] Tracks traversed `value` objects.
   * @param {Array} [stackB] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
   */
  function equalArrays(array, other, equalFunc, customizer, isWhere, stackA, stackB) {
    var index = -1,
        arrLength = array.length,
        othLength = other.length,
        result = true;

    if (arrLength != othLength && !(isWhere && othLength > arrLength)) {
      return false;
    }
    // Deep compare the contents, ignoring non-numeric properties.
    while (result && ++index < arrLength) {
      var arrValue = array[index],
          othValue = other[index];

      result = undefined;
      if (customizer) {
        result = isWhere
          ? customizer(othValue, arrValue, index)
          : customizer(arrValue, othValue, index);
      }
      if (typeof result == 'undefined') {
        // Recursively compare arrays (susceptible to call stack limits).
        if (isWhere) {
          var othIndex = othLength;
          while (othIndex--) {
            othValue = other[othIndex];
            result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isWhere, stackA, stackB);
            if (result) {
              break;
            }
          }
        } else {
          result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isWhere, stackA, stackB);
        }
      }
    }
    return !!result;
  }

  /**
   * A specialized version of `baseIsEqualDeep` for comparing objects of
   * the same `toStringTag`.
   *
   * **Note:** This function only supports comparing values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} value The object to compare.
   * @param {Object} other The other object to compare.
   * @param {string} tag The `toStringTag` of the objects to compare.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalByTag(object, other, tag) {
    switch (tag) {
      case boolTag:
      case dateTag:
        // Coerce dates and booleans to numbers, dates to milliseconds and booleans
        // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
        return +object == +other;

      case errorTag:
        return object.name == other.name && object.message == other.message;

      case numberTag:
        // Treat `NaN` vs. `NaN` as equal.
        return (object != +object)
          ? other != +other
          // But, treat `-0` vs. `+0` as not equal.
          : (object == 0 ? ((1 / object) == (1 / other)) : object == +other);

      case regexpTag:
      case stringTag:
        // Coerce regexes to strings and treat strings primitives and string
        // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
        return object == (other + '');
    }
    return false;
  }

  /**
   * A specialized version of `baseIsEqualDeep` for objects with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} [customizer] The function to customize comparing values.
   * @param {boolean} [isWhere] Specify performing partial comparisons.
   * @param {Array} [stackA] Tracks traversed `value` objects.
   * @param {Array} [stackB] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalObjects(object, other, equalFunc, customizer, isWhere, stackA, stackB) {
    var objProps = keys(object),
        objLength = objProps.length,
        othProps = keys(other),
        othLength = othProps.length;

    if (objLength != othLength && !isWhere) {
      return false;
    }
    var hasCtor,
        index = -1;

    while (++index < objLength) {
      var key = objProps[index],
          result = hasOwnProperty.call(other, key);

      if (result) {
        var objValue = object[key],
            othValue = other[key];

        result = undefined;
        if (customizer) {
          result = isWhere
            ? customizer(othValue, objValue, key)
            : customizer(objValue, othValue, key);
        }
        if (typeof result == 'undefined') {
          // Recursively compare objects (susceptible to call stack limits).
          result = (objValue && objValue === othValue) || equalFunc(objValue, othValue, customizer, isWhere, stackA, stackB);
        }
      }
      if (!result) {
        return false;
      }
      hasCtor || (hasCtor = key == 'constructor');
    }
    if (!hasCtor) {
      var objCtor = object.constructor,
          othCtor = other.constructor;

      // Non `Object` object instances with different constructors are not equal.
      if (objCtor != othCtor && ('constructor' in object && 'constructor' in other) &&
          !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Gets the appropriate "callback" function. If the `_.callback` method is
   * customized this function returns the custom method, otherwise it returns
   * the `baseCallback` function. If arguments are provided the chosen function
   * is invoked with them and its result is returned.
   *
   * @private
   * @returns {Function} Returns the chosen function or its result.
   */
  function getCallback(func, thisArg, argCount) {
    var result = lodash.callback || callback;
    result = result === callback ? baseCallback : result;
    return argCount ? result(func, thisArg, argCount) : result;
  }

  /**
   * Initializes an array clone.
   *
   * @private
   * @param {Array} array The array to clone.
   * @returns {Array} Returns the initialized clone.
   */
  function initCloneArray(array) {
    var length = array.length,
        result = new array.constructor(length);

    // Add array properties assigned by `RegExp#exec`.
    if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  }

  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneObject(object) {
    var Ctor = object.constructor;
    if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
      Ctor = Object;
    }
    return new Ctor;
  }

  /**
   * Initializes an object clone based on its `toStringTag`.
   *
   * **Note:** This function only supports cloning values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   *
   * @private
   * @param {Object} object The object to clone.
   * @param {string} tag The `toStringTag` of the object to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneByTag(object, tag, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case arrayBufferTag:
        return bufferClone(object);

      case boolTag:
      case dateTag:
        return new Ctor(+object);

      case float32Tag: case float64Tag:
      case int8Tag: case int16Tag: case int32Tag:
      case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
        // Safari 5 mobile incorrectly has `Object` as the constructor of typed arrays.
        if (Ctor instanceof Ctor) {
          Ctor = ctorByTag[tag];
        }
        var buffer = object.buffer;
        return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

      case numberTag:
      case stringTag:
        return new Ctor(object);

      case regexpTag:
        var result = new Ctor(object.source, reFlags.exec(object));
        result.lastIndex = object.lastIndex;
    }
    return result;
  }

  /**
   * Checks if `func` is eligible for `this` binding.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is eligible, else `false`.
   */
  function isBindable(func) {
    var support = lodash.support,
        result = !(support.funcNames ? func.name : support.funcDecomp);

    if (!result) {
      var source = fnToString.call(func);
      if (!support.funcNames) {
        result = !reFuncName.test(source);
      }
      if (!result) {
        // Check if `func` references the `this` keyword and store the result.
        result = reThis.test(source) || isNative(func);
        baseSetData(func, result);
      }
    }
    return result;
  }

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    value = +value;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return value > -1 && value % 1 == 0 && value < length;
  }

  /**
   * Checks if the provided arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
   */
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == 'number') {
      var length = object.length,
          prereq = isLength(length) && isIndex(index, length);
    } else {
      prereq = type == 'string' && index in object;
    }
    return prereq && object[index] === value;
  }

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This function is based on ES `ToLength`. See the
   * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
   * for more details.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   */
  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  /**
   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` if suitable for strict
   *  equality comparisons, else `false`.
   */
  function isStrictComparable(value) {
    return value === value && (value === 0 ? ((1 / value) > 0) : !isObject(value));
  }

  /**
   * A fallback implementation of `_.isPlainObject` which checks if `value`
   * is an object created by the `Object` constructor or has a `[[Prototype]]`
   * of `null`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   */
  function shimIsPlainObject(value) {
    var Ctor,
        support = lodash.support;

    // Exit early for non `Object` objects.
    if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isHostObject(value)) ||
        (!hasOwnProperty.call(value, 'constructor') &&
          (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor))) ||
        (!support.argsTag && isArguments(value))) {
      return false;
    }
    // IE < 9 iterates inherited properties before own properties. If the first
    // iterated property is an object's own property then there are no inherited
    // enumerable properties.
    var result;
    if (support.ownLast) {
      baseForIn(value, function(subValue, key, object) {
        result = hasOwnProperty.call(object, key);
        return false;
      });
      return result !== false;
    }
    // In most environments an object's own properties are iterated before
    // its inherited properties. If the last iterated property is an object's
    // own property then there are no inherited enumerable properties.
    baseForIn(value, function(subValue, key) {
      result = key;
    });
    return typeof result == 'undefined' || hasOwnProperty.call(value, result);
  }

  /**
   * A fallback implementation of `Object.keys` which creates an array of the
   * own enumerable property names of `object`.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns the array of property names.
   */
  function shimKeys(object) {
    var props = keysIn(object),
        propsLength = props.length,
        length = propsLength && object.length,
        support = lodash.support;

    var allowIndexes = length && isLength(length) &&
      (isArray(object) || (support.nonEnumStrings && isString(object)) ||
        (support.nonEnumArgs && isArguments(object)));

    var index = -1,
        result = [];

    while (++index < propsLength) {
      var key = props[index];
      if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Converts `value` to an object if it is not one.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {Object} Returns the object.
   */
  function toObject(value) {
    if (lodash.support.unindexedChars && isString(value)) {
      var index = -1,
          length = value.length,
          result = Object(value);

      while (++index < length) {
        result[index] = value.charAt(index);
      }
      return result;
    }
    return isObject(value) ? value : Object(value);
  }

  /*------------------------------------------------------------------------*/

  /**
   * This method is like `_.find` except that it returns the index of the first
   * element `predicate` returns truthy for, instead of the element itself.
   *
   * If a property name is provided for `predicate` the created "_.property"
   * style callback returns the property value of the given element.
   *
   * If value is also provided for `thisArg` the created "_.matchesProperty"
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created "_.matches" style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to search.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration. If a property name or object is provided it is used to
   *  create a "_.property" or "_.matches" style callback respectively.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {number} Returns the index of the found element, else `-1`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'age': 36, 'active': false },
   *   { 'user': 'fred',    'age': 40, 'active': true },
   *   { 'user': 'pebbles', 'age': 1,  'active': false }
   * ];
   *
   * _.findIndex(users, function(chr) { return chr.age < 40; });
   * // => 0
   *
   * // using the "_.matches" callback shorthand
   * _.findIndex(users, { 'age': 40, 'active': true });
   * // => 1
   *
   * // using the "_.matchesProperty" callback shorthand
   * _.findIndex(users, 'age', 1);
   * // => 2
   *
   * // using the "_.property" callback shorthand
   * _.findIndex(users, 'active');
   * // => 1
   */
  function findIndex(array, predicate, thisArg) {
    var index = -1,
        length = array ? array.length : 0;

    predicate = getCallback(predicate, thisArg, 3);
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Gets the last element of `array`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to query.
   * @returns {*} Returns the last element of `array`.
   * @example
   *
   * _.last([1, 2, 3]);
   * // => 3
   */
  function last(array) {
    var length = array ? array.length : 0;
    return length ? array[length - 1] : undefined;
  }

  /*------------------------------------------------------------------------*/

  /**
   * Iterates over elements of `collection`, returning the first element
   * `predicate` returns truthy for. The predicate is bound to `thisArg` and
   * invoked with three arguments; (value, index|key, collection).
   *
   * If a property name is provided for `predicate` the created "_.property"
   * style callback returns the property value of the given element.
   *
   * If value is also provided for `thisArg` the created "_.matchesProperty"
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created "_.matches" style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @alias detect
   * @category Collection
   * @param {Array|Object|string} collection The collection to search.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration. If a property name or object is provided it is used to
   *  create a "_.property" or "_.matches" style callback respectively.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {*} Returns the matched element, else `undefined`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'age': 36, 'active': true },
   *   { 'user': 'fred',    'age': 40, 'active': false },
   *   { 'user': 'pebbles', 'age': 1,  'active': true }
   * ];
   *
   * _.result(_.find(users, function(chr) { return chr.age < 40; }), 'user');
   * // => 'barney'
   *
   * // using the "_.matches" callback shorthand
   * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
   * // => 'pebbles'
   *
   * // using the "_.matchesProperty" callback shorthand
   * _.result(_.find(users, 'active', false), 'user');
   * // => 'fred'
   *
   * // using the "_.property" callback shorthand
   * _.result(_.find(users, 'active'), 'user');
   * // => 'barney'
   */
  function find(collection, predicate, thisArg) {
    if (isArray(collection)) {
      var index = findIndex(collection, predicate, thisArg);
      return index > -1 ? collection[index] : undefined;
    }
    predicate = getCallback(predicate, thisArg, 3);
    return baseFind(collection, predicate, baseEach);
  }

  /**
   * Iterates over elements of `collection` invoking `iteratee` for each element.
   * The `iteratee` is bound to `thisArg` and invoked with three arguments;
   * (value, index|key, collection). Iterator functions may exit iteration early
   * by explicitly returning `false`.
   *
   * **Note:** As with other "Collections" methods, objects with a `length` property
   * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
   * may be used for object iteration.
   *
   * @static
   * @memberOf _
   * @alias each
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Array|Object|string} Returns `collection`.
   * @example
   *
   * _([1, 2, 3]).forEach(function(n) { console.log(n); }).value();
   * // => logs each value from left to right and returns the array
   *
   * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(n, key) { console.log(n, key); });
   * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
   */
  function forEach(collection, iteratee, thisArg) {
    return (typeof iteratee == 'function' && typeof thisArg == 'undefined' && isArray(collection))
      ? arrayEach(collection, iteratee)
      : baseEach(collection, bindCallback(iteratee, thisArg, 3));
  }

  /**
   * Creates an array of values by running each element in `collection` through
   * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
   * arguments; (value, index|key, collection).
   *
   * If a property name is provided for `predicate` the created "_.property"
   * style callback returns the property value of the given element.
   *
   * If value is also provided for `thisArg` the created "_.matchesProperty"
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created "_.matches" style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * Many lodash methods are guarded to work as interatees for methods like
   * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
   *
   * The guarded methods are:
   * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`, `drop`,
   * `dropRight`, `fill`, `flatten`, `invert`, `max`, `min`, `parseInt`, `slice`,
   * `sortBy`, `take`, `takeRight`, `template`, `trim`, `trimLeft`, `trimRight`,
   * `trunc`, `random`, `range`, `sample`, `uniq`, and `words`
   *
   * @static
   * @memberOf _
   * @alias collect
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [iteratee=_.identity] The function invoked
   *  per iteration. If a property name or object is provided it is used to
   *  create a "_.property" or "_.matches" style callback respectively.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Array} Returns the new mapped array.
   * @example
   *
   * _.map([1, 2, 3], function(n) { return n * 3; });
   * // => [3, 6, 9]
   *
   * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(n) { return n * 3; });
   * // => [3, 6, 9] (iteration order is not guaranteed)
   *
   * var users = [
   *   { 'user': 'barney' },
   *   { 'user': 'fred' }
   * ];
   *
   * // using the "_.property" callback shorthand
   * _.map(users, 'user');
   * // => ['barney', 'fred']
   */
  function map(collection, iteratee, thisArg) {
    var func = isArray(collection) ? arrayMap : baseMap;
    iteratee = getCallback(iteratee, thisArg, 3);
    return func(collection, iteratee);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Checks if `value` is classified as an `arguments` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * (function() { return _.isArguments(arguments); })();
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  function isArguments(value) {
    var length = isObjectLike(value) ? value.length : undefined;
    return (isLength(length) && objToString.call(value) == argsTag) || false;
  }
  // Fallback for environments without a `toStringTag` for `arguments` objects.
  if (!support.argsTag) {
    isArguments = function(value) {
      var length = isObjectLike(value) ? value.length : undefined;
      return (isLength(length) && hasOwnProperty.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee')) || false;
    };
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * (function() { return _.isArray(arguments); })();
   * // => false
   */
  var isArray = nativeIsArray || function(value) {
    return (isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag) || false;
  };

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    // Avoid a Chakra JIT bug in compatibility modes of IE 11.
    // See https://github.com/jashkenas/underscore/issues/1621 for more details.
    return typeof value == 'function' || false;
  }
  // Fallback for environments that return incorrect `typeof` operator results.
  if (isFunction(/x/) || (Uint8Array && !isFunction(Uint8Array))) {
    isFunction = function(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in older versions of Chrome and Safari which return 'function' for regexes
      // and Safari 8 equivalents which return 'object' for typed array constructors.
      return objToString.call(value) == funcTag;
    };
  }

  /**
   * Checks if `value` is the language type of `Object`.
   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * **Note:** See the [ES5 spec](https://es5.github.io/#x8) for more details.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(1);
   * // => false
   */
  function isObject(value) {
    // Avoid a V8 JIT bug in Chrome 19-20.
    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
    var type = typeof value;
    return type == 'function' || (value && type == 'object') || false;
  }

  /**
   * Checks if `value` is a native function.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
   * @example
   *
   * _.isNative(Array.prototype.push);
   * // => true
   *
   * _.isNative(_);
   * // => false
   */
  function isNative(value) {
    if (value == null) {
      return false;
    }
    if (objToString.call(value) == funcTag) {
      return reNative.test(fnToString.call(value));
    }
    return (isObjectLike(value) &&
      (isHostObject(value) ? reNative : reHostCtor).test(value)) || false;
  }

  /**
   * Checks if `value` is classified as a `Number` primitive or object.
   *
   * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
   * as numbers, use the `_.isFinite` method.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isNumber(8.4);
   * // => true
   *
   * _.isNumber(NaN);
   * // => true
   *
   * _.isNumber('8.4');
   * // => false
   */
  function isNumber(value) {
    return typeof value == 'number' || (isObjectLike(value) && objToString.call(value) == numberTag) || false;
  }

  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * **Note:** This method assumes objects created by the `Object` constructor
   * have no inherited enumerable properties.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */
  var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
    if (!(value && objToString.call(value) == objectTag) || (!lodash.support.argsTag && isArguments(value))) {
      return false;
    }
    var valueOf = value.valueOf,
        objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

    return objProto
      ? (value == objProto || getPrototypeOf(value) == objProto)
      : shimIsPlainObject(value);
  };

  /**
   * Checks if `value` is classified as a `String` primitive or object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isString('abc');
   * // => true
   *
   * _.isString(1);
   * // => false
   */
  function isString(value) {
    return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag) || false;
  }

  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  function isTypedArray(value) {
    return (isObjectLike(value) && isLength(value.length) && typedArrayTags[objToString.call(value)]) || false;
  }

  /**
   * Checks if `value` is `undefined`.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
   * @example
   *
   * _.isUndefined(void 0);
   * // => true
   *
   * _.isUndefined(null);
   * // => false
   */
  function isUndefined(value) {
    return typeof value == 'undefined';
  }

  /**
   * Converts `value` to a plain object flattening inherited enumerable
   * properties of `value` to own properties of the plain object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {Object} Returns the converted plain object.
   * @example
   *
   * function Foo() {
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.assign({ 'a': 1 }, new Foo);
   * // => { 'a': 1, 'b': 2 }
   *
   * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
   * // => { 'a': 1, 'b': 2, 'c': 3 }
   */
  function toPlainObject(value) {
    return baseCopy(value, keysIn(value));
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
   * for more details.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */
  var keys = !nativeKeys ? shimKeys : function(object) {
    if (object) {
      var Ctor = object.constructor,
          length = object.length;
    }
    if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
       (typeof object == 'function' ? lodash.support.enumPrototypes : (length && isLength(length)))) {
      return shimKeys(object);
    }
    return isObject(object) ? nativeKeys(object) : [];
  };

  /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */
  function keysIn(object) {
    if (object == null) {
      return [];
    }
    if (!isObject(object)) {
      object = Object(object);
    }
    var length = object.length,
        support = lodash.support;

    length = (length && isLength(length) &&
      (isArray(object) || (support.nonEnumStrings && isString(object)) ||
        (support.nonEnumArgs && isArguments(object))) && length) || 0;

    var Ctor = object.constructor,
        index = -1,
        proto = (isFunction(Ctor) && Ctor.prototype) || objectProto,
        isProto = proto === object,
        result = Array(length),
        skipIndexes = length > 0,
        skipErrorProps = support.enumErrorProps && (object === errorProto || object instanceof Error),
        skipProto = support.enumPrototypes && isFunction(object);

    while (++index < length) {
      result[index] = (index + '');
    }
    // lodash skips the `constructor` property when it infers it is iterating
    // over a `prototype` object because IE < 9 can't set the `[[Enumerable]]`
    // attribute of an existing property and the `constructor` property of a
    // prototype defaults to non-enumerable.
    for (var key in object) {
      if (!(skipProto && key == 'prototype') &&
          !(skipErrorProps && (key == 'message' || key == 'name')) &&
          !(skipIndexes && isIndex(key, length)) &&
          !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
        result.push(key);
      }
    }
    if (support.nonEnumShadows && object !== objectProto) {
      var tag = object === stringProto ? stringTag : object === errorProto ? errorTag : objToString.call(object),
          nonEnums = nonEnumProps[tag] || nonEnumProps[objectTag];

      if (tag == objectTag) {
        proto = objectProto;
      }
      length = shadowProps.length;
      while (length--) {
        key = shadowProps[length];
        var nonEnum = nonEnums[key];
        if (!(isProto && nonEnum) &&
            (nonEnum ? hasOwnProperty.call(object, key) : object[key] !== proto[key])) {
          result.push(key);
        }
      }
    }
    return result;
  }

  /**
   * Recursively merges own enumerable properties of the source object(s), that
   * don't resolve to `undefined` into the destination object. Subsequent sources
   * overwrite property assignments of previous sources. If `customizer` is
   * provided it is invoked to produce the merged values of the destination and
   * source properties. If `customizer` returns `undefined` merging is handled
   * by the method instead. The `customizer` is bound to `thisArg` and invoked
   * with five arguments; (objectValue, sourceValue, key, object, source).
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @param {Function} [customizer] The function to customize merging properties.
   * @param {*} [thisArg] The `this` binding of `customizer`.
   * @returns {Object} Returns `object`.
   * @example
   *
   * var users = {
   *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
   * };
   *
   * var ages = {
   *   'data': [{ 'age': 36 }, { 'age': 40 }]
   * };
   *
   * _.merge(users, ages);
   * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
   *
   * // using a customizer callback
   * var object = {
   *   'fruits': ['apple'],
   *   'vegetables': ['beet']
   * };
   *
   * var other = {
   *   'fruits': ['banana'],
   *   'vegetables': ['carrot']
   * };
   *
   * _.merge(object, other, function(a, b) {
   *   return _.isArray(a) ? a.concat(b) : undefined;
   * });
   * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
   */
  var merge = createAssigner(baseMerge);

  /*------------------------------------------------------------------------*/

  /**
   * Escapes the `RegExp` special characters "\", "^", "$", ".", "|", "?", "*",
   * "+", "(", ")", "[", "]", "{" and "}" in `string`.
   *
   * @static
   * @memberOf _
   * @category String
   * @param {string} [string=''] The string to escape.
   * @returns {string} Returns the escaped string.
   * @example
   *
   * _.escapeRegExp('[lodash](https://lodash.com/)');
   * // => '\[lodash\]\(https://lodash\.com/\)'
   */
  function escapeRegExp(string) {
    string = baseToString(string);
    return (string && reHasRegExpChars.test(string))
      ? string.replace(reRegExpChars, '\\$&')
      : string;
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates a function that invokes `func` with the `this` binding of `thisArg`
   * and arguments of the created function. If `func` is a property name the
   * created callback returns the property value for a given element. If `func`
   * is an object the created callback returns `true` for elements that contain
   * the equivalent object properties, otherwise it returns `false`.
   *
   * @static
   * @memberOf _
   * @alias iteratee
   * @category Utility
   * @param {*} [func=_.identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
   * @returns {Function} Returns the callback.
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36 },
   *   { 'user': 'fred',   'age': 40 }
   * ];
   *
   * // wrap to create custom callback shorthands
   * _.callback = _.wrap(_.callback, function(callback, func, thisArg) {
   *   var match = /^(.+?)__([gl]t)(.+)$/.exec(func);
   *   if (!match) {
   *     return callback(func, thisArg);
   *   }
   *   return function(object) {
   *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
   *   };
   * });
   *
   * _.filter(users, 'age__gt36');
   * // => [{ 'user': 'fred', 'age': 40 }]
   */
  function callback(func, thisArg, guard) {
    if (guard && isIterateeCall(func, thisArg, guard)) {
      thisArg = null;
    }
    return isObjectLike(func)
      ? matches(func)
      : baseCallback(func, thisArg);
  }

  /**
   * Creates a function that returns `value`.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {*} value The value to return from the new function.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var object = { 'user': 'fred' };
   * var getter = _.constant(object);
   * getter() === object;
   * // => true
   */
  function constant(value) {
    return function() {
      return value;
    };
  }

  /**
   * This method returns the first argument provided to it.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'user': 'fred' };
   * _.identity(object) === object;
   * // => true
   */
  function identity(value) {
    return value;
  }

  /**
   * Creates a function which performs a deep comparison between a given object
   * and `source`, returning `true` if the given object has equivalent property
   * values, else `false`.
   *
   * **Note:** This method supports comparing arrays, booleans, `Date` objects,
   * numbers, `Object` objects, regexes, and strings. Objects are compared by
   * their own, not inherited, enumerable properties. For comparing a single
   * own or inherited property value see `_.matchesProperty`.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': true },
   *   { 'user': 'fred',   'age': 40, 'active': false }
   * ];
   *
   * _.filter(users, _.matches({ 'age': 40, 'active': false }));
   * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
   */
  function matches(source) {
    return baseMatches(baseClone(source, true));
  }

  /*------------------------------------------------------------------------*/

  // Add functions that return wrapped values when chaining.
  lodash.callback = callback;
  lodash.constant = constant;
  lodash.forEach = forEach;
  lodash.keys = keys;
  lodash.keysIn = keysIn;
  lodash.map = map;
  lodash.matches = matches;
  lodash.merge = merge;
  lodash.toPlainObject = toPlainObject;

  // Add aliases.
  lodash.collect = map;
  lodash.each = forEach;
  lodash.iteratee = callback;

  /*------------------------------------------------------------------------*/

  // Add functions that return unwrapped values when chaining.
  lodash.escapeRegExp = escapeRegExp;
  lodash.find = find;
  lodash.findIndex = findIndex;
  lodash.identity = identity;
  lodash.isArguments = isArguments;
  lodash.isArray = isArray;
  lodash.isFunction = isFunction;
  lodash.isNative = isNative;
  lodash.isNumber = isNumber;
  lodash.isObject = isObject;
  lodash.isPlainObject = isPlainObject;
  lodash.isString = isString;
  lodash.isTypedArray = isTypedArray;
  lodash.isUndefined = isUndefined;
  lodash.last = last;

  // Add aliases.
  lodash.detect = find;

  /*------------------------------------------------------------------------*/

  /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type string
   */
  lodash.VERSION = VERSION;

  /*--------------------------------------------------------------------------*/

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose lodash to the global object when an AMD loader is present to avoid
    // errors in cases where lodash is loaded by a script tag and not intended
    // as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
    // more details.
    root._ = lodash;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
      return lodash;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {

      freeExports._ = lodash;
  }
  else {
    // Export for a browser or Rhino.
    root._ = lodash;
  }
}.call(this));
 
 ; var requirejs,require,define;!function(global){function isFunction(a){return"[object Function]"===ostring.call(a)}function isArray(a){return"[object Array]"===ostring.call(a)}function each(a,b){if(a){var c;for(c=0;c<a.length&&(!a[c]||!b(a[c],c,a));c+=1);}}function eachReverse(a,b){if(a){var c;for(c=a.length-1;c>-1&&(!a[c]||!b(a[c],c,a));c-=1);}}function hasProp(a,b){return hasOwn.call(a,b)}function getOwn(a,b){return hasProp(a,b)&&a[b]}function eachProp(a,b){var c;for(c in a)if(hasProp(a,c)&&b(a[c],c))break}function mixin(a,b,c,d){return b&&eachProp(b,function(b,e){(c||!hasProp(a,e))&&(!d||"object"!=typeof b||!b||isArray(b)||isFunction(b)||b instanceof RegExp?a[e]=b:(a[e]||(a[e]={}),mixin(a[e],b,c,d)))}),a}function bind(a,b){return function(){return b.apply(a,arguments)}}function scripts(){return document.getElementsByTagName("script")}function defaultOnError(a){throw a}function getGlobal(a){if(!a)return a;var b=global;return each(a.split("."),function(a){b=b[a]}),b}function makeError(a,b,c,d){var e=new Error(b+"\nhttp://requirejs.org/docs/errors.html#"+a);return e.requireType=a,e.requireModules=d,c&&(e.originalError=c),e}function newContext(a){function b(a){var b,c;for(b=0;b<a.length;b++)if(c=a[b],"."===c)a.splice(b,1),b-=1;else if(".."===c){if(0===b||1==b&&".."===a[2]||".."===a[b-1])continue;b>0&&(a.splice(b-1,2),b-=2)}}function c(a,c,d){var e,f,g,h,i,j,k,l,m,n,o,p,q=c&&c.split("/"),r=x.map,s=r&&r["*"];if(a&&(a=a.split("/"),k=a.length-1,x.nodeIdCompat&&jsSuffixRegExp.test(a[k])&&(a[k]=a[k].replace(jsSuffixRegExp,"")),"."===a[0].charAt(0)&&q&&(p=q.slice(0,q.length-1),a=p.concat(a)),b(a),a=a.join("/")),d&&r&&(q||s)){g=a.split("/");a:for(h=g.length;h>0;h-=1){if(j=g.slice(0,h).join("/"),q)for(i=q.length;i>0;i-=1)if(f=getOwn(r,q.slice(0,i).join("/")),f&&(f=getOwn(f,j))){l=f,m=h;break a}!n&&s&&getOwn(s,j)&&(n=getOwn(s,j),o=h)}!l&&n&&(l=n,m=o),l&&(g.splice(0,m,l),a=g.join("/"))}return e=getOwn(x.pkgs,a),e?e:a}function d(a){isBrowser&&each(scripts(),function(b){return b.getAttribute("data-requiremodule")===a&&b.getAttribute("data-requirecontext")===u.contextName?(b.parentNode.removeChild(b),!0):void 0})}function e(a){var b=getOwn(x.paths,a);return b&&isArray(b)&&b.length>1?(b.shift(),u.require.undef(a),u.makeRequire(null,{skipMap:!0})([a]),!0):void 0}function f(a){var b,c=a?a.indexOf("!"):-1;return c>-1&&(b=a.substring(0,c),a=a.substring(c+1,a.length)),[b,a]}function g(a,b,d,e){var g,h,i,j,k=null,l=b?b.name:null,m=a,n=!0,o="";return a||(n=!1,a="_@r"+(F+=1)),j=f(a),k=j[0],a=j[1],k&&(k=c(k,l,e),h=getOwn(C,k)),a&&(k?o=h&&h.normalize?h.normalize(a,function(a){return c(a,l,e)}):-1===a.indexOf("!")?c(a,l,e):a:(o=c(a,l,e),j=f(o),k=j[0],o=j[1],d=!0,g=u.nameToUrl(o))),i=!k||h||d?"":"_unnormalized"+(G+=1),{prefix:k,name:o,parentMap:b,unnormalized:!!i,url:g,originalName:m,isDefine:n,id:(k?k+"!"+o:o)+i}}function h(a){var b=a.id,c=getOwn(y,b);return c||(c=y[b]=new u.Module(a)),c}function i(a,b,c){var d=a.id,e=getOwn(y,d);!hasProp(C,d)||e&&!e.defineEmitComplete?(e=h(a),e.error&&"error"===b?c(e.error):e.on(b,c)):"defined"===b&&c(C[d])}function j(a,b){var c=a.requireModules,d=!1;b?b(a):(each(c,function(b){var c=getOwn(y,b);c&&(c.error=a,c.events.error&&(d=!0,c.emit("error",a)))}),d||req.onError(a))}function k(){globalDefQueue.length&&(apsp.apply(B,[B.length,0].concat(globalDefQueue)),globalDefQueue=[])}function l(a){delete y[a],delete z[a]}function m(a,b,c){var d=a.map.id;a.error?a.emit("error",a.error):(b[d]=!0,each(a.depMaps,function(d,e){var f=d.id,g=getOwn(y,f);!g||a.depMatched[e]||c[f]||(getOwn(b,f)?(a.defineDep(e,C[f]),a.check()):m(g,b,c))}),c[d]=!0)}function n(){var a,b,c=1e3*x.waitSeconds,f=c&&u.startTime+c<(new Date).getTime(),g=[],h=[],i=!1,k=!0;if(!s){if(s=!0,eachProp(z,function(a){var c=a.map,j=c.id;if(a.enabled&&(c.isDefine||h.push(a),!a.error))if(!a.inited&&f)e(j)?(b=!0,i=!0):(g.push(j),d(j));else if(!a.inited&&a.fetched&&c.isDefine&&(i=!0,!c.prefix))return k=!1}),f&&g.length)return a=makeError("timeout","Load timeout for modules: "+g,null,g),a.contextName=u.contextName,j(a);k&&each(h,function(a){m(a,{},{})}),f&&!b||!i||!isBrowser&&!isWebWorker||w||(w=setTimeout(function(){w=0,n()},50)),s=!1}}function o(a){hasProp(C,a[0])||h(g(a[0],null,!0)).init(a[1],a[2])}function p(a,b,c,d){a.detachEvent&&!isOpera?d&&a.detachEvent(d,b):a.removeEventListener(c,b,!1)}function q(a){var b=a.currentTarget||a.srcElement;return p(b,u.onScriptLoad,"load","onreadystatechange"),p(b,u.onScriptError,"error"),{node:b,id:b&&b.getAttribute("data-requiremodule")}}function r(){var a;for(k();B.length;){if(a=B.shift(),null===a[0])return j(makeError("mismatch","Mismatched anonymous define() module: "+a[a.length-1]));o(a)}}var s,t,u,v,w,x={waitSeconds:7,baseUrl:"./",paths:{},bundles:{},pkgs:{},shim:{},config:{}},y={},z={},A={},B=[],C={},D={},E={},F=1,G=1;return v={require:function(a){return a.require?a.require:a.require=u.makeRequire(a.map)},exports:function(a){return a.usingExports=!0,a.map.isDefine?a.exports?C[a.map.id]=a.exports:a.exports=C[a.map.id]={}:void 0},module:function(a){return a.module?a.module:a.module={id:a.map.id,uri:a.map.url,config:function(){return getOwn(x.config,a.map.id)||{}},exports:a.exports||(a.exports={})}}},t=function(a){this.events=getOwn(A,a.id)||{},this.map=a,this.shim=getOwn(x.shim,a.id),this.depExports=[],this.depMaps=[],this.depMatched=[],this.pluginMaps={},this.depCount=0},t.prototype={init:function(a,b,c,d){d=d||{},this.inited||(this.factory=b,c?this.on("error",c):this.events.error&&(c=bind(this,function(a){this.emit("error",a)})),this.depMaps=a&&a.slice(0),this.errback=c,this.inited=!0,this.ignore=d.ignore,d.enabled||this.enabled?this.enable():this.check())},defineDep:function(a,b){this.depMatched[a]||(this.depMatched[a]=!0,this.depCount-=1,this.depExports[a]=b)},fetch:function(){if(!this.fetched){this.fetched=!0,u.startTime=(new Date).getTime();var a=this.map;return this.shim?void u.makeRequire(this.map,{enableBuildCallback:!0})(this.shim.deps||[],bind(this,function(){return a.prefix?this.callPlugin():this.load()})):a.prefix?this.callPlugin():this.load()}},load:function(){var a=this.map.url;D[a]||(D[a]=!0,u.load(this.map.id,a))},check:function(){if(this.enabled&&!this.enabling){var a,b,c=this.map.id,d=this.depExports,e=this.exports,f=this.factory;if(this.inited){if(this.error)this.emit("error",this.error);else if(!this.defining){if(this.defining=!0,this.depCount<1&&!this.defined){if(isFunction(f)){if(this.events.error&&this.map.isDefine||req.onError!==defaultOnError)try{e=u.execCb(c,f,d,e)}catch(g){a=g}else e=u.execCb(c,f,d,e);if(this.map.isDefine&&void 0===e&&(b=this.module,b?e=b.exports:this.usingExports&&(e=this.exports)),a)return a.requireMap=this.map,a.requireModules=this.map.isDefine?[this.map.id]:null,a.requireType=this.map.isDefine?"define":"require",j(this.error=a)}else e=f;this.exports=e,this.map.isDefine&&!this.ignore&&(C[c]=e,req.onResourceLoad&&req.onResourceLoad(u,this.map,this.depMaps)),l(c),this.defined=!0}this.defining=!1,this.defined&&!this.defineEmitted&&(this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=!0)}}else this.fetch()}},callPlugin:function(){var a=this.map,b=a.id,d=g(a.prefix);this.depMaps.push(d),i(d,"defined",bind(this,function(d){var e,f,k,m=getOwn(E,this.map.id),n=this.map.name,o=this.map.parentMap?this.map.parentMap.name:null,p=u.makeRequire(a.parentMap,{enableBuildCallback:!0});return this.map.unnormalized?(d.normalize&&(n=d.normalize(n,function(a){return c(a,o,!0)})||""),f=g(a.prefix+"!"+n,this.map.parentMap),i(f,"defined",bind(this,function(a){this.init([],function(){return a},null,{enabled:!0,ignore:!0})})),k=getOwn(y,f.id),void(k&&(this.depMaps.push(f),this.events.error&&k.on("error",bind(this,function(a){this.emit("error",a)})),k.enable()))):m?(this.map.url=u.nameToUrl(m),void this.load()):(e=bind(this,function(a){this.init([],function(){return a},null,{enabled:!0})}),e.error=bind(this,function(a){this.inited=!0,this.error=a,a.requireModules=[b],eachProp(y,function(a){0===a.map.id.indexOf(b+"_unnormalized")&&l(a.map.id)}),j(a)}),e.fromText=bind(this,function(c,d){var f=a.name,i=g(f),k=useInteractive;d&&(c=d),k&&(useInteractive=!1),h(i),hasProp(x.config,b)&&(x.config[f]=x.config[b]);try{req.exec(c)}catch(l){return j(makeError("fromtexteval","fromText eval for "+b+" failed: "+l,l,[b]))}k&&(useInteractive=!0),this.depMaps.push(i),u.completeLoad(f),p([f],e)}),void d.load(a.name,p,e,x))})),u.enable(d,this),this.pluginMaps[d.id]=d},enable:function(){z[this.map.id]=this,this.enabled=!0,this.enabling=!0,each(this.depMaps,bind(this,function(a,b){var c,d,e;if("string"==typeof a){if(a=g(a,this.map.isDefine?this.map:this.map.parentMap,!1,!this.skipMap),this.depMaps[b]=a,e=getOwn(v,a.id))return void(this.depExports[b]=e(this));this.depCount+=1,i(a,"defined",bind(this,function(a){this.defineDep(b,a),this.check()})),this.errback?i(a,"error",bind(this,this.errback)):this.events.error&&i(a,"error",bind(this,function(a){this.emit("error",a)}))}c=a.id,d=y[c],hasProp(v,c)||!d||d.enabled||u.enable(a,this)})),eachProp(this.pluginMaps,bind(this,function(a){var b=getOwn(y,a.id);b&&!b.enabled&&u.enable(a,this)})),this.enabling=!1,this.check()},on:function(a,b){var c=this.events[a];c||(c=this.events[a]=[]),c.push(b)},emit:function(a,b){each(this.events[a],function(a){a(b)}),"error"===a&&delete this.events[a]}},u={config:x,contextName:a,registry:y,defined:C,urlFetched:D,defQueue:B,Module:t,makeModuleMap:g,nextTick:req.nextTick,onError:j,configure:function(a){a.baseUrl&&"/"!==a.baseUrl.charAt(a.baseUrl.length-1)&&(a.baseUrl+="/");var b=x.shim,c={paths:!0,bundles:!0,config:!0,map:!0};eachProp(a,function(a,b){c[b]?(x[b]||(x[b]={}),mixin(x[b],a,!0,!0)):x[b]=a}),a.bundles&&eachProp(a.bundles,function(a,b){each(a,function(a){a!==b&&(E[a]=b)})}),a.shim&&(eachProp(a.shim,function(a,c){isArray(a)&&(a={deps:a}),!a.exports&&!a.init||a.exportsFn||(a.exportsFn=u.makeShimExports(a)),b[c]=a}),x.shim=b),a.packages&&each(a.packages,function(a){var b,c;a="string"==typeof a?{name:a}:a,c=a.name,b=a.location,b&&(x.paths[c]=a.location),x.pkgs[c]=a.name+"/"+(a.main||"main").replace(currDirRegExp,"").replace(jsSuffixRegExp,"")}),eachProp(y,function(a,b){a.inited||a.map.unnormalized||(a.map=g(b))}),(a.deps||a.callback)&&u.require(a.deps||[],a.callback)},makeShimExports:function(a){function b(){var b;return a.init&&(b=a.init.apply(global,arguments)),b||a.exports&&getGlobal(a.exports)}return b},makeRequire:function(b,e){function f(c,d,i){var k,l,m;return e.enableBuildCallback&&d&&isFunction(d)&&(d.__requireJsBuild=!0),"string"==typeof c?isFunction(d)?j(makeError("requireargs","Invalid require call"),i):b&&hasProp(v,c)?v[c](y[b.id]):req.get?req.get(u,c,b,f):(l=g(c,b,!1,!0),k=l.id,hasProp(C,k)?C[k]:j(makeError("notloaded",'Module name "'+k+'" has not been loaded yet for context: '+a+(b?"":". Use require([])")))):(r(),u.nextTick(function(){r(),m=h(g(null,b)),m.skipMap=e.skipMap,m.init(c,d,i,{enabled:!0}),n()}),f)}return e=e||{},mixin(f,{isBrowser:isBrowser,toUrl:function(a){var d,e=a.lastIndexOf("."),f=a.split("/")[0],g="."===f||".."===f;return-1!==e&&(!g||e>1)&&(d=a.substring(e,a.length),a=a.substring(0,e)),u.nameToUrl(c(a,b&&b.id,!0),d,!0)},defined:function(a){return hasProp(C,g(a,b,!1,!0).id)},specified:function(a){return a=g(a,b,!1,!0).id,hasProp(C,a)||hasProp(y,a)}}),b||(f.undef=function(a){k();var c=g(a,b,!0),e=getOwn(y,a);d(a),delete C[a],delete D[c.url],delete A[a],eachReverse(B,function(b,c){b[0]===a&&B.splice(c,1)}),e&&(e.events.defined&&(A[a]=e.events),l(a))}),f},enable:function(a){var b=getOwn(y,a.id);b&&h(a).enable()},completeLoad:function(a){var b,c,d,f=getOwn(x.shim,a)||{},g=f.exports;for(k();B.length;){if(c=B.shift(),null===c[0]){if(c[0]=a,b)break;b=!0}else c[0]===a&&(b=!0);o(c)}if(d=getOwn(y,a),!b&&!hasProp(C,a)&&d&&!d.inited){if(!(!x.enforceDefine||g&&getGlobal(g)))return e(a)?void 0:j(makeError("nodefine","No define call for "+a,null,[a]));o([a,f.deps||[],f.exportsFn])}n()},nameToUrl:function(a,b,c){var d,e,f,g,h,i,j,k=getOwn(x.pkgs,a);if(k&&(a=k),j=getOwn(E,a))return u.nameToUrl(j,b,c);if(req.jsExtRegExp.test(a))h=a+(b||"");else{for(d=x.paths,e=a.split("/"),f=e.length;f>0;f-=1)if(g=e.slice(0,f).join("/"),i=getOwn(d,g)){isArray(i)&&(i=i[0]),e.splice(0,f,i);break}h=e.join("/"),h+=b||(/^data\:|\?/.test(h)||c?"":".js"),h=("/"===h.charAt(0)||h.match(/^[\w\+\.\-]+:/)?"":x.baseUrl)+h}return x.urlArgs?h+((-1===h.indexOf("?")?"?":"&")+x.urlArgs):h},load:function(a,b){req.load(u,a,b)},execCb:function(a,b,c,d){return b.apply(d,c)},onScriptLoad:function(a){if("load"===a.type||readyRegExp.test((a.currentTarget||a.srcElement).readyState)){interactiveScript=null;var b=q(a);u.completeLoad(b.id)}},onScriptError:function(a){var b=q(a);return e(b.id)?void 0:j(makeError("scripterror","Script error for: "+b.id,a,[b.id]))}},u.require=u.makeRequire(),u}function getInteractiveScript(){return interactiveScript&&"interactive"===interactiveScript.readyState?interactiveScript:(eachReverse(scripts(),function(a){return"interactive"===a.readyState?interactiveScript=a:void 0}),interactiveScript)}var req,s,head,baseElement,dataMain,src,interactiveScript,currentlyAddingScript,mainScript,subPath,version="2.1.16",commentRegExp=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,cjsRequireRegExp=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,jsSuffixRegExp=/\.js$/,currDirRegExp=/^\.\//,op=Object.prototype,ostring=op.toString,hasOwn=op.hasOwnProperty,ap=Array.prototype,apsp=ap.splice,isBrowser=!("undefined"==typeof window||"undefined"==typeof navigator||!window.document),isWebWorker=!isBrowser&&"undefined"!=typeof importScripts,readyRegExp=isBrowser&&"PLAYSTATION 3"===navigator.platform?/^complete$/:/^(complete|loaded)$/,defContextName="_",isOpera="undefined"!=typeof opera&&"[object Opera]"===opera.toString(),contexts={},cfg={},globalDefQueue=[],useInteractive=!1;if("undefined"==typeof define){if("undefined"!=typeof requirejs){if(isFunction(requirejs))return;cfg=requirejs,requirejs=void 0}"undefined"==typeof require||isFunction(require)||(cfg=require,require=void 0),req=requirejs=function(a,b,c,d){var e,f,g=defContextName;return isArray(a)||"string"==typeof a||(f=a,isArray(b)?(a=b,b=c,c=d):a=[]),f&&f.context&&(g=f.context),e=getOwn(contexts,g),e||(e=contexts[g]=req.s.newContext(g)),f&&e.configure(f),e.require(a,b,c)},req.config=function(a){return req(a)},req.nextTick="undefined"!=typeof setTimeout?function(a){setTimeout(a,4)}:function(a){a()},require||(require=req),req.version=version,req.jsExtRegExp=/^\/|:|\?|\.js$/,req.isBrowser=isBrowser,s=req.s={contexts:contexts,newContext:newContext},req({}),each(["toUrl","undef","defined","specified"],function(a){req[a]=function(){var b=contexts[defContextName];return b.require[a].apply(b,arguments)}}),isBrowser&&(head=s.head=document.getElementsByTagName("head")[0],baseElement=document.getElementsByTagName("base")[0],baseElement&&(head=s.head=baseElement.parentNode)),req.onError=defaultOnError,req.createNode=function(a){var b=a.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script");return b.type=a.scriptType||"text/javascript",b.charset="utf-8",b.async=!0,b},req.load=function(a,b,c){var d,e=a&&a.config||{};if(isBrowser)return d=req.createNode(e,b,c),d.setAttribute("data-requirecontext",a.contextName),d.setAttribute("data-requiremodule",b),!d.attachEvent||d.attachEvent.toString&&d.attachEvent.toString().indexOf("[native code")<0||isOpera?(d.addEventListener("load",a.onScriptLoad,!1),d.addEventListener("error",a.onScriptError,!1)):(useInteractive=!0,d.attachEvent("onreadystatechange",a.onScriptLoad)),d.src=c,currentlyAddingScript=d,baseElement?head.insertBefore(d,baseElement):head.appendChild(d),currentlyAddingScript=null,d;if(isWebWorker)try{importScripts(c),a.completeLoad(b)}catch(f){a.onError(makeError("importscripts","importScripts failed for "+b+" at "+c,f,[b]))}},isBrowser&&!cfg.skipDataMain&&eachReverse(scripts(),function(a){return head||(head=a.parentNode),dataMain=a.getAttribute("data-main"),dataMain?(mainScript=dataMain,cfg.baseUrl||(src=mainScript.split("/"),mainScript=src.pop(),subPath=src.length?src.join("/")+"/":"./",cfg.baseUrl=subPath),mainScript=mainScript.replace(jsSuffixRegExp,""),req.jsExtRegExp.test(mainScript)&&(mainScript=dataMain),cfg.deps=cfg.deps?cfg.deps.concat(mainScript):[mainScript],!0):void 0}),define=function(a,b,c){var d,e;"string"!=typeof a&&(c=b,b=a,a=null),isArray(b)||(c=b,b=null),!b&&isFunction(c)&&(b=[],c.length&&(c.toString().replace(commentRegExp,"").replace(cjsRequireRegExp,function(a,c){b.push(c)}),b=(1===c.length?["require"]:["require","exports","module"]).concat(b))),useInteractive&&(d=currentlyAddingScript||getInteractiveScript(),d&&(a||(a=d.getAttribute("data-requiremodule")),e=contexts[d.getAttribute("data-requirecontext")])),(e?e.defQueue:globalDefQueue).push([a,b,c])},define.amd={jQuery:!0},req.exec=function(text){return eval(text)},req(cfg)}}(this); 
 ; /* MooTools: the javascript framework. license: MIT-style license. copyright: Copyright (c) 2006-2015 [Valerio Proietti](http://mad4milk.net/).*/ 
!function(){this.MooTools={version:"1.5.1",build:"0542c135fdeb7feed7d9917e01447a408f22c876"};var t=this.typeOf=function(t){if(null==t)return"null";if(null!=t.$family)return t.$family();if(t.nodeName){if(1==t.nodeType)return"element";if(3==t.nodeType)return/\S/.test(t.nodeValue)?"textnode":"whitespace"}else if("number"==typeof t.length){if("callee"in t)return"arguments";if("item"in t)return"collection"}return typeof t},n=this.instanceOf=function(t,n){if(null==t)return!1;for(var e=t.$constructor||t.constructor;e;){if(e===n)return!0;e=e.parent}return t.hasOwnProperty?t instanceof n:!1},e=this.Function,r=!0;for(var i in{toString:1})r=null;r&&(r=["hasOwnProperty","valueOf","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","constructor"]),e.prototype.overloadSetter=function(t){var n=this;return function(e,i){if(null==e)return this;if(t||"string"!=typeof e){for(var o in e)n.call(this,o,e[o]);if(r)for(var a=r.length;a--;)o=r[a],e.hasOwnProperty(o)&&n.call(this,o,e[o])}else n.call(this,e,i);return this}},e.prototype.overloadGetter=function(t){var n=this;return function(e){var r,i;if("string"!=typeof e?r=e:arguments.length>1?r=arguments:t&&(r=[e]),r){i={};for(var o=0;o<r.length;o++)i[r[o]]=n.call(this,r[o])}else i=n.call(this,e);return i}},e.prototype.extend=function(t,n){this[t]=n}.overloadSetter(),e.prototype.implement=function(t,n){this.prototype[t]=n}.overloadSetter();var o=Array.prototype.slice;e.from=function(n){return"function"==t(n)?n:function(){return n}},Array.from=function(n){return null==n?[]:a.isEnumerable(n)&&"string"!=typeof n?"array"==t(n)?n:o.call(n):[n]},Number.from=function(t){var n=parseFloat(t);return isFinite(n)?n:null},String.from=function(t){return t+""},e.implement({hide:function(){return this.$hidden=!0,this},protect:function(){return this.$protected=!0,this}});var a=this.Type=function(n,e){if(n){var r=n.toLowerCase(),i=function(n){return t(n)==r};a["is"+n]=i,null!=e&&(e.prototype.$family=function(){return r}.hide(),e.type=i)}return null==e?null:(e.extend(this),e.$constructor=a,e.prototype.$constructor=e,e)},s=Object.prototype.toString;a.isEnumerable=function(t){return null!=t&&"number"==typeof t.length&&"[object Function]"!=s.call(t)};var u={},c=function(n){var e=t(n.prototype);return u[e]||(u[e]=[])},h=function(n,e){if(!e||!e.$hidden){for(var r=c(this),i=0;i<r.length;i++){var a=r[i];"type"==t(a)?h.call(a,n,e):a.call(this,n,e)}var s=this.prototype[n];null!=s&&s.$protected||(this.prototype[n]=e),null==this[n]&&"function"==t(e)&&l.call(this,n,function(t){return e.apply(t,o.call(arguments,1))})}},l=function(t,n){if(!n||!n.$hidden){var e=this[t];null!=e&&e.$protected||(this[t]=n)}};a.implement({implement:h.overloadSetter(),extend:l.overloadSetter(),alias:function(t,n){h.call(this,t,this.prototype[n])}.overloadSetter(),mirror:function(t){return c(this).push(t),this}}),new a("Type",a);var f=function(t,n,e){var r=n!=Object,i=n.prototype;r&&(n=new a(t,n));for(var o=0,s=e.length;s>o;o++){var u=e[o],c=n[u],h=i[u];c&&c.protect(),r&&h&&n.implement(u,h.protect())}if(r){var l=i.propertyIsEnumerable(e[0]);n.forEachMethod=function(t){if(!l)for(var n=0,r=e.length;r>n;n++)t.call(i,i[e[n]],e[n]);for(var o in i)t.call(i,i[o],o)}}return f};f("String",String,["charAt","charCodeAt","concat","contains","indexOf","lastIndexOf","match","quote","replace","search","slice","split","substr","substring","trim","toLowerCase","toUpperCase"])("Array",Array,["pop","push","reverse","shift","sort","splice","unshift","concat","join","slice","indexOf","lastIndexOf","filter","forEach","every","map","some","reduce","reduceRight"])("Number",Number,["toExponential","toFixed","toLocaleString","toPrecision"])("Function",e,["apply","call","bind"])("RegExp",RegExp,["exec","test"])("Object",Object,["create","defineProperty","defineProperties","keys","getPrototypeOf","getOwnPropertyDescriptor","getOwnPropertyNames","preventExtensions","isExtensible","seal","isSealed","freeze","isFrozen"])("Date",Date,["now"]),Object.extend=l.overloadSetter(),Date.extend("now",function(){return+new Date}),new a("Boolean",Boolean),Number.prototype.$family=function(){return isFinite(this)?"number":"null"}.hide(),Number.extend("random",function(t,n){return Math.floor(Math.random()*(n-t+1)+t)});var p=Object.prototype.hasOwnProperty;Object.extend("forEach",function(t,n,e){for(var r in t)p.call(t,r)&&n.call(e,t[r],r,t)}),Object.each=Object.forEach,Array.implement({forEach:function(t,n){for(var e=0,r=this.length;r>e;e++)e in this&&t.call(n,this[e],e,this)},each:function(t,n){return Array.forEach(this,t,n),this}});var m=function(n){switch(t(n)){case"array":return n.clone();case"object":return Object.clone(n);default:return n}};Array.implement("clone",function(){for(var t=this.length,n=new Array(t);t--;)n[t]=m(this[t]);return n});var v=function(n,e,r){switch(t(r)){case"object":"object"==t(n[e])?Object.merge(n[e],r):n[e]=Object.clone(r);break;case"array":n[e]=r.clone();break;default:n[e]=r}return n};Object.extend({merge:function(n,e,r){if("string"==t(e))return v(n,e,r);for(var i=1,o=arguments.length;o>i;i++){var a=arguments[i];for(var s in a)v(n,s,a[s])}return n},clone:function(t){var n={};for(var e in t)n[e]=m(t[e]);return n},append:function(t){for(var n=1,e=arguments.length;e>n;n++){var r=arguments[n]||{};for(var i in r)t[i]=r[i]}return t}}),["Object","WhiteSpace","TextNode","Collection","Arguments"].each(function(t){new a(t)});var d=Date.now();String.extend("uniqueID",function(){return(d++).toString(36)});var y=this.Hash=new a("Hash",function(n){"hash"==t(n)&&(n=Object.clone(n.getClean()));for(var e in n)this[e]=n[e];return this});y.implement({forEach:function(t,n){Object.forEach(this,t,n)},getClean:function(){var t={};for(var n in this)this.hasOwnProperty(n)&&(t[n]=this[n]);return t},getLength:function(){var t=0;for(var n in this)this.hasOwnProperty(n)&&t++;return t}}),y.alias("each","forEach"),Object.type=a.isObject;var g=this.Native=function(t){return new a(t.name,t.initialize)};g.type=a.type,g.implement=function(t,n){for(var e=0;e<t.length;e++)t[e].implement(n);return g};var b=Array.type;Array.type=function(t){return n(t,Array)||b(t)},this.$A=function(t){return Array.from(t).slice()},this.$arguments=function(t){return function(){return arguments[t]}},this.$chk=function(t){return!(!t&&0!==t)},this.$clear=function(t){return clearTimeout(t),clearInterval(t),null},this.$defined=function(t){return null!=t},this.$each=function(n,e,r){var i=t(n);("arguments"==i||"collection"==i||"array"==i||"elements"==i?Array:Object).each(n,e,r)},this.$empty=function(){},this.$extend=function(t,n){return Object.append(t,n)},this.$H=function(t){return new y(t)},this.$merge=function(){var t=Array.slice(arguments);return t.unshift({}),Object.merge.apply(null,t)},this.$lambda=e.from,this.$mixin=Object.merge,this.$random=Number.random,this.$splat=Array.from,this.$time=Date.now,this.$type=function(n){var e=t(n);return"elements"==e?"array":"null"==e?!1:e},this.$unlink=function(n){switch(t(n)){case"object":return Object.clone(n);case"array":return Array.clone(n);case"hash":return new y(n);default:return n}}}(),Array.implement({every:function(t,n){for(var e=0,r=this.length>>>0;r>e;e++)if(e in this&&!t.call(n,this[e],e,this))return!1;return!0},filter:function(t,n){for(var e,r=[],i=0,o=this.length>>>0;o>i;i++)i in this&&(e=this[i],t.call(n,e,i,this)&&r.push(e));return r},indexOf:function(t,n){for(var e=this.length>>>0,r=0>n?Math.max(0,e+n):n||0;e>r;r++)if(this[r]===t)return r;return-1},map:function(t,n){for(var e=this.length>>>0,r=Array(e),i=0;e>i;i++)i in this&&(r[i]=t.call(n,this[i],i,this));return r},some:function(t,n){for(var e=0,r=this.length>>>0;r>e;e++)if(e in this&&t.call(n,this[e],e,this))return!0;return!1},clean:function(){return this.filter(function(t){return null!=t})},invoke:function(t){var n=Array.slice(arguments,1);return this.map(function(e){return e[t].apply(e,n)})},associate:function(t){for(var n={},e=Math.min(this.length,t.length),r=0;e>r;r++)n[t[r]]=this[r];return n},link:function(t){for(var n={},e=0,r=this.length;r>e;e++)for(var i in t)if(t[i](this[e])){n[i]=this[e],delete t[i];break}return n},contains:function(t,n){return-1!=this.indexOf(t,n)},append:function(t){return this.push.apply(this,t),this},getLast:function(){return this.length?this[this.length-1]:null},getRandom:function(){return this.length?this[Number.random(0,this.length-1)]:null},include:function(t){return this.contains(t)||this.push(t),this},combine:function(t){for(var n=0,e=t.length;e>n;n++)this.include(t[n]);return this},erase:function(t){for(var n=this.length;n--;)this[n]===t&&this.splice(n,1);return this},empty:function(){return this.length=0,this},flatten:function(){for(var t=[],n=0,e=this.length;e>n;n++){var r=typeOf(this[n]);"null"!=r&&(t=t.concat("array"==r||"collection"==r||"arguments"==r||instanceOf(this[n],Array)?Array.flatten(this[n]):this[n]))}return t},pick:function(){for(var t=0,n=this.length;n>t;t++)if(null!=this[t])return this[t];return null},hexToRgb:function(t){if(3!=this.length)return null;var n=this.map(function(t){return 1==t.length&&(t+=t),parseInt(t,16)});return t?n:"rgb("+n+")"},rgbToHex:function(t){if(this.length<3)return null;if(4==this.length&&0==this[3]&&!t)return"transparent";for(var n=[],e=0;3>e;e++){var r=(this[e]-0).toString(16);n.push(1==r.length?"0"+r:r)}return t?n:"#"+n.join("")}}),Array.alias("extend","append");var $pick=function(){return Array.from(arguments).pick()};Function.extend({attempt:function(){for(var t=0,n=arguments.length;n>t;t++)try{return arguments[t]()}catch(e){}return null}}),Function.implement({attempt:function(t,n){try{return this.apply(n,Array.from(t))}catch(e){}return null},bind:function(t){var n=this,e=arguments.length>1?Array.slice(arguments,1):null,r=function(){},i=function(){var o=t,a=arguments.length;this instanceof i&&(r.prototype=n.prototype,o=new r);var s=e||a?n.apply(o,e&&a?e.concat(Array.slice(arguments)):e||arguments):n.call(o);return o==t?s:o};return i},pass:function(t,n){var e=this;return null!=t&&(t=Array.from(t)),function(){return e.apply(n,t||arguments)}},delay:function(t,n,e){return setTimeout(this.pass(null==e?[]:e,n),t)},periodical:function(t,n,e){return setInterval(this.pass(null==e?[]:e,n),t)}}),delete Function.prototype.bind,Function.implement({create:function(t){var n=this;return t=t||{},function(e){var r=t.arguments;r=null!=r?Array.from(r):Array.slice(arguments,t.event?1:0),t.event&&(r=[e||window.event].extend(r));var i=function(){return n.apply(t.bind||null,r)};return t.delay?setTimeout(i,t.delay):t.periodical?setInterval(i,t.periodical):t.attempt?Function.attempt(i):i()}},bind:function(t,n){var e=this;return null!=n&&(n=Array.from(n)),function(){return e.apply(t,n||arguments)}},bindWithEvent:function(t,n){var e=this;return null!=n&&(n=Array.from(n)),function(r){return e.apply(t,null==n?arguments:[r].concat(n))}},run:function(t,n){return this.apply(n,Array.from(t))}}),Object.create==Function.prototype.create&&(Object.create=null);var $try=Function.attempt;Number.implement({limit:function(t,n){return Math.min(n,Math.max(t,this))},round:function(t){return t=Math.pow(10,t||0).toFixed(0>t?-t:0),Math.round(this*t)/t},times:function(t,n){for(var e=0;this>e;e++)t.call(n,e,this)},toFloat:function(){return parseFloat(this)},toInt:function(t){return parseInt(this,t||10)}}),Number.alias("each","times"),function(t){var n={};t.each(function(t){Number[t]||(n[t]=function(){return Math[t].apply(null,[this].concat(Array.from(arguments)))})}),Number.implement(n)}(["abs","acos","asin","atan","atan2","ceil","cos","exp","floor","log","max","min","pow","sin","sqrt","tan"]),String.implement({contains:function(t,n){return(n?String(this).slice(n):String(this)).indexOf(t)>-1},test:function(t,n){return("regexp"==typeOf(t)?t:new RegExp(""+t,n)).test(this)},trim:function(){return String(this).replace(/^\s+|\s+$/g,"")},clean:function(){return String(this).replace(/\s+/g," ").trim()},camelCase:function(){return String(this).replace(/-\D/g,function(t){return t.charAt(1).toUpperCase()})},hyphenate:function(){return String(this).replace(/[A-Z]/g,function(t){return"-"+t.charAt(0).toLowerCase()})},capitalize:function(){return String(this).replace(/\b[a-z]/g,function(t){return t.toUpperCase()})},escapeRegExp:function(){return String(this).replace(/([-.*+?^${}()|[\]\/\\])/g,"\\$1")},toInt:function(t){return parseInt(this,t||10)},toFloat:function(){return parseFloat(this)},hexToRgb:function(t){var n=String(this).match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);return n?n.slice(1).hexToRgb(t):null},rgbToHex:function(t){var n=String(this).match(/\d{1,3}/g);return n?n.rgbToHex(t):null},substitute:function(t,n){return String(this).replace(n||/\\?\{([^{}]+)\}/g,function(n,e){return"\\"==n.charAt(0)?n.slice(1):null!=t[e]?t[e]:""})}}),String.prototype.contains=function(t,n){return n?(n+this+n).indexOf(n+t+n)>-1:String(this).indexOf(t)>-1},function(){var t=this.Class=new Type("Class",function(r){instanceOf(r,Function)&&(r={initialize:r});var i=function(){if(e(this),i.$prototyping)return this;this.$caller=null;var t=this.initialize?this.initialize.apply(this,arguments):this;return this.$caller=this.caller=null,t}.extend(this).implement(r);return i.$constructor=t,i.prototype.$constructor=i,i.prototype.parent=n,i}),n=function(){if(!this.$caller)throw new Error('The method "parent" cannot be called.');var t=this.$caller.$name,n=this.$caller.$owner.parent,e=n?n.prototype[t]:null;if(!e)throw new Error('The method "'+t+'" has no parent.');return e.apply(this,arguments)},e=function(t){for(var n in t){var r=t[n];switch(typeOf(r)){case"object":var i=function(){};i.prototype=r,t[n]=e(new i);break;case"array":t[n]=r.clone()}}return t},r=function(t,n,e){e.$origin&&(e=e.$origin);var r=function(){if(e.$protected&&null==this.$caller)throw new Error('The method "'+n+'" cannot be called.');var t=this.caller,i=this.$caller;this.caller=i,this.$caller=r;var o=e.apply(this,arguments);return this.$caller=i,this.caller=t,o}.extend({$owner:t,$origin:e,$name:n});return r},i=function(n,e,i){if(t.Mutators.hasOwnProperty(n)&&(e=t.Mutators[n].call(this,e),null==e))return this;if("function"==typeOf(e)){if(e.$hidden)return this;this.prototype[n]=i?e:r(this,n,e)}else Object.merge(this.prototype,n,e);return this},o=function(t){t.$prototyping=!0;var n=new t;return delete t.$prototyping,n};t.implement("implement",i.overloadSetter()),t.Mutators={Extends:function(t){this.parent=t,this.prototype=o(t)},Implements:function(t){Array.from(t).each(function(t){var n=new t;for(var e in n)i.call(this,e,n[e],!0)},this)}}}(),function(){this.Chain=new Class({$chain:[],chain:function(){return this.$chain.append(Array.flatten(arguments)),this},callChain:function(){return this.$chain.length?this.$chain.shift().apply(this,arguments):!1},clearChain:function(){return this.$chain.empty(),this}});var t=function(t){return t.replace(/^on([A-Z])/,function(t,n){return n.toLowerCase()})};this.Events=new Class({$events:{},addEvent:function(n,e,r){return n=t(n),e==$empty?this:(this.$events[n]=(this.$events[n]||[]).include(e),r&&(e.internal=!0),this)},addEvents:function(t){for(var n in t)this.addEvent(n,t[n]);return this},fireEvent:function(n,e,r){n=t(n);var i=this.$events[n];return i?(e=Array.from(e),i.each(function(t){r?t.delay(r,this,e):t.apply(this,e)},this),this):this},removeEvent:function(n,e){n=t(n);var r=this.$events[n];if(r&&!e.internal){var i=r.indexOf(e);-1!=i&&delete r[i]}return this},removeEvents:function(n){var e;if("object"==typeOf(n)){for(e in n)this.removeEvent(e,n[e]);return this}n&&(n=t(n));for(e in this.$events)if(!n||n==e)for(var r=this.$events[e],i=r.length;i--;)i in r&&this.removeEvent(e,r[i]);return this}}),this.Options=new Class({setOptions:function(){var t=this.options=Object.merge.apply(null,[{},this.options].append(arguments));if(this.addEvent)for(var n in t)"function"==typeOf(t[n])&&/^on[A-Z]/.test(n)&&(this.addEvent(n,t[n]),delete t[n]);return this}})}(),function(){var t=Object.prototype.hasOwnProperty;Object.extend({subset:function(t,n){for(var e={},r=0,i=n.length;i>r;r++){var o=n[r];o in t&&(e[o]=t[o])}return e},map:function(n,e,r){var i={};for(var o in n)t.call(n,o)&&(i[o]=e.call(r,n[o],o,n));return i},filter:function(n,e,r){var i={};for(var o in n){var a=n[o];t.call(n,o)&&e.call(r,a,o,n)&&(i[o]=a)}return i},every:function(n,e,r){for(var i in n)if(t.call(n,i)&&!e.call(r,n[i],i))return!1;return!0},some:function(n,e,r){for(var i in n)if(t.call(n,i)&&e.call(r,n[i],i))return!0;return!1},keys:function(n){var e=[];for(var r in n)t.call(n,r)&&e.push(r);return e},values:function(n){var e=[];for(var r in n)t.call(n,r)&&e.push(n[r]);return e},getLength:function(t){return Object.keys(t).length},keyOf:function(n,e){for(var r in n)if(t.call(n,r)&&n[r]===e)return r;return null},contains:function(t,n){return null!=Object.keyOf(t,n)},toQueryString:function(t,n){var e=[];return Object.each(t,function(t,r){n&&(r=n+"["+r+"]");var i;switch(typeOf(t)){case"object":i=Object.toQueryString(t,r);break;case"array":var o={};t.each(function(t,n){o[n]=t}),i=Object.toQueryString(o,r);break;default:i=r+"="+encodeURIComponent(t)}null!=t&&e.push(i)}),e.join("&")}})}(),Hash.implement({has:Object.prototype.hasOwnProperty,keyOf:function(t){return Object.keyOf(this,t)},hasValue:function(t){return Object.contains(this,t)},extend:function(t){return Hash.each(t||{},function(t,n){Hash.set(this,n,t)},this),this},combine:function(t){return Hash.each(t||{},function(t,n){Hash.include(this,n,t)},this),this},erase:function(t){return this.hasOwnProperty(t)&&delete this[t],this},get:function(t){return this.hasOwnProperty(t)?this[t]:null},set:function(t,n){return(!this[t]||this.hasOwnProperty(t))&&(this[t]=n),this},empty:function(){return Hash.each(this,function(t,n){delete this[n]},this),this},include:function(t,n){return null==this[t]&&(this[t]=n),this},map:function(t,n){return new Hash(Object.map(this,t,n))},filter:function(t,n){return new Hash(Object.filter(this,t,n))},every:function(t,n){return Object.every(this,t,n)},some:function(t,n){return Object.some(this,t,n)},getKeys:function(){return Object.keys(this)},getValues:function(){return Object.values(this)},toQueryString:function(t){return Object.toQueryString(this,t)}}),Hash.extend=Object.append,Hash.alias({indexOf:"keyOf",contains:"hasValue"}),function(){var t=this.document,n=t.window=this,e=function(t,n){t=t.toLowerCase(),n=n?n.toLowerCase():"";var e=t.match(/(opera|ie|firefox|chrome|trident|crios|version)[\s\/:]([\w\d\.]+)?.*?(safari|(?:rv[\s\/:]|version[\s\/:])([\w\d\.]+)|$)/)||[null,"unknown",0];return"trident"==e[1]?(e[1]="ie",e[4]&&(e[2]=e[4])):"crios"==e[1]&&(e[1]="chrome"),n=t.match(/ip(?:ad|od|hone)/)?"ios":(t.match(/(?:webos|android)/)||n.match(/mac|win|linux/)||["other"])[0],"win"==n&&(n="windows"),{extend:Function.prototype.extend,name:"version"==e[1]?e[3]:e[1],version:parseFloat("opera"==e[1]&&e[4]?e[4]:e[2]),platform:n}},r=this.Browser=e(navigator.userAgent,navigator.platform);"ie"==r.name&&(r.version=t.documentMode),r.extend({Features:{xpath:!!t.evaluate,air:!!n.runtime,query:!!t.querySelector,json:!!n.JSON},parseUA:e}),r[r.name]=!0,r[r.name+parseInt(r.version,10)]=!0,"ie"==r.name&&r.version>="11"&&delete r.ie;var i=r.platform;"windows"==i&&(i="win"),r.Platform={name:i},r.Platform[i]=!0,r.Request=function(){var t=function(){return new XMLHttpRequest},n=function(){return new ActiveXObject("MSXML2.XMLHTTP")},e=function(){return new ActiveXObject("Microsoft.XMLHTTP")};return Function.attempt(function(){return t(),t},function(){return n(),n},function(){return e(),e})}(),r.Features.xhr=!!r.Request;var o=(Function.attempt(function(){return navigator.plugins["Shockwave Flash"].description},function(){return new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version")})||"0 r0").match(/\d+/g);if(r.Plugins={Flash:{version:Number(o[0]||"0."+o[1])||0,build:Number(o[2])||0}},r.exec=function(e){if(!e)return e;if(n.execScript)n.execScript(e);else{var r=t.createElement("script");r.setAttribute("type","text/javascript"),r.text=e,t.head.appendChild(r),t.head.removeChild(r)}return e},String.implement("stripScripts",function(t){var n="",e=this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi,function(t,e){return n+=e+"\n",""});return t===!0?r.exec(n):"function"==typeOf(t)&&t(n,e),e}),r.extend({Document:this.Document,Window:this.Window,Element:this.Element,Event:this.Event}),this.Window=this.$constructor=new Type("Window",function(){}),this.$family=Function.from("window").hide(),Window.mirror(function(t,e){n[t]=e}),this.Document=t.$constructor=new Type("Document",function(){}),t.$family=Function.from("document").hide(),Document.mirror(function(n,e){t[n]=e}),t.html=t.documentElement,t.head||(t.head=t.getElementsByTagName("head")[0]),t.execCommand)try{t.execCommand("BackgroundImageCache",!1,!0)}catch(a){}if(this.attachEvent&&!this.addEventListener){var s=function(){this.detachEvent("onunload",s),t.head=t.html=t.window=null,n=this.Window=t=null};this.attachEvent("onunload",s)}var u=Array.from;try{u(t.html.childNodes)}catch(a){Array.from=function(t){if("string"!=typeof t&&Type.isEnumerable(t)&&"array"!=typeOf(t)){for(var n=t.length,e=new Array(n);n--;)e[n]=t[n];return e}return u(t)};var c=Array.prototype,h=c.slice;["pop","push","reverse","shift","sort","splice","unshift","concat","join","slice"].each(function(t){var n=c[t];Array[t]=function(t){return n.apply(Array.from(t),h.call(arguments,1))}})}r.Platform.ios&&(r.Platform.ipod=!0),r.Engine={};var l=function(t,n){r.Engine.name=t,r.Engine[t+n]=!0,r.Engine.version=n};if(r.ie)switch(r.Engine.trident=!0,r.version){case 6:l("trident",4);break;case 7:l("trident",5);break;case 8:l("trident",6)}if(r.firefox&&(r.Engine.gecko=!0,r.version>=3?l("gecko",19):l("gecko",18)),r.safari||r.chrome)switch(r.Engine.webkit=!0,r.version){case 2:l("webkit",419);break;case 3:l("webkit",420);break;case 4:l("webkit",525)}if(r.opera&&(r.Engine.presto=!0,r.version>=9.6?l("presto",960):r.version>=9.5?l("presto",950):l("presto",925)),"unknown"==r.name)switch((navigator.userAgent.toLowerCase().match(/(?:webkit|khtml|gecko)/)||[])[0]){case"webkit":case"khtml":r.Engine.webkit=!0;break;case"gecko":r.Engine.gecko=!0}this.$exec=r.exec}();var Cookie=new Class({Implements:Options,options:{path:"/",domain:!1,duration:!1,secure:!1,document:document,encode:!0},initialize:function(t,n){this.key=t,this.setOptions(n)},write:function(t){if(this.options.encode&&(t=encodeURIComponent(t)),this.options.domain&&(t+="; domain="+this.options.domain),this.options.path&&(t+="; path="+this.options.path),this.options.duration){var n=new Date;n.setTime(n.getTime()+24*this.options.duration*60*60*1e3),t+="; expires="+n.toGMTString()}return this.options.secure&&(t+="; secure"),this.options.document.cookie=this.key+"="+t,this},read:function(){var t=this.options.document.cookie.match("(?:^|;)\\s*"+this.key.escapeRegExp()+"=([^;]*)");return t?decodeURIComponent(t[1]):null},dispose:function(){return new Cookie(this.key,Object.merge({},this.options,{duration:-1})).write(""),this}});Cookie.write=function(t,n,e){return new Cookie(t,e).write(n)},Cookie.read=function(t){return new Cookie(t).read()},Cookie.dispose=function(t,n){return new Cookie(t,n).dispose()}; 
 ; // here comes require.js and lodash.custom.js after build task
/*
 * INIT
 */
(function Init() {
    var packadic = (window.packadic = window.packadic || {});

    if(!_.isObject(packadic.config)){
        packadic.config = {};
    }
    packadic.state = 'pre-boot';
    packadic.start = Date.now();
    packadic.__events_fired = [];
    packadic.__event_callbacks = {
        "pre-boot": [],     // before requirejs.config get initialised - before loading the primary dependencies
        "booting" : [],     // after loading up require.js config, before the first require() call
        "booted"  : [],     // after the first require() call when primary dependencies are loaded and booted up packadic base modules
        "starting": [],     // fires right after loading the theme and autoloader dependencies, before any other startup operation
        "started" : []      // fires after the theme module has been initialised and default autoloaders have been added
    };

    packadic.getElapsedTime = function () {
        return (Date.now() - packadic.start) / 1000;
    };

    packadic.bindEventHandler = function (name, cb) {
        if (packadic.__events_fired.indexOf(name) !== -1) {
            return cb();
        }
        packadic.__event_callbacks[name].push(cb);
        return packadic;
    };

    packadic.onPreBoot = function(cb){
        packadic.bindEventHandler('pre-boot', cb);
        return packadic;
    };
    packadic.onBoot = function(req, cb){
        packadic.bindEventHandler('booting', cb);
        return packadic;
    };
    packadic.onBooted = function(req, cb){
        packadic.bindEventHandler('booted', function(){
            if(_.isFunction(req)){
                req();
            } else {
                require(req, cb);
            }
        });
        return packadic;
    };
    packadic.onStart = function(req, cb){
        packadic.bindEventHandler('starting', function(){
            if(_.isFunction(req)){
                req();
            } else {
                require(req, cb);
            }
        });
        return packadic;
    };
    packadic.onStarted = function(req, cb){
        packadic.bindEventHandler('started', function(){
            if(_.isFunction(req)){
                req();
            } else {
                require(req, cb);
            }
        });
        return packadic;
    };

    packadic.fireEvent = function (name) {
        if (!_.isObject(packadic.__event_callbacks[name])) {
            return;
        }
        _.each(packadic.__event_callbacks[name], function (cb) {
            if (typeof cb === 'function') {
                cb();
            }
        });
        packadic.state = name;
        packadic.__events_fired.push(name);
        return packadic;
    };


    packadic.debug = function () {
    };
    packadic.log = function () {
    };

    packadic.mergeConfig = function (newConfig) {
        packadic.config = _.merge(packadic.config, newConfig);
        return packadic;
    }


}.call());

 
 ; 


/*
 * CONFIG
 */
(function Config() {

    var packadic = (window.packadic = window.packadic || {});
    packadic.config = {
        debug                 : false,
        pageLoadedOnAutoloaded: true,
        paths                 : {
            assets : '/assets',
            images : '/assets/images',
            scripts: '/assets/scripts',
            fonts  : '/assets/fonts',
            styles : '/assets/styles'
        },
        requireJS             : {}
    };


    var jqui = ['accordion', 'autocomplete', 'button', 'core', 'datepicker', 'dialog', 'draggable', 'droppable', 'effect-blind', 'effect-bounce', 'effect-clip', 'effect-drop', 'effect-explode', 'effect-fade', 'effect-fold', 'effect-highlight', 'effect', 'effect-puff', 'effect-pulsate', 'effect-scale', 'effect-shake', 'effect-size', 'effect-slide', 'effect-transfer', 'menu', 'mouse', 'position', 'progressbar', 'resizable', 'selectable', 'selectmenu', 'slider', 'sortable', 'spinner', 'tabs', 'tooltip', 'widget'];
    var tweendeps = ['plugins/gsap/css']; //, 'plugins/gsap/ease', 'plugins/gsap/attr', 'plugins/gsap/scroll' ];

    packadic.config.jQueryUI = jqui;

    packadic.config.requireJS = {
        baseUrl: packadic.config.paths.scripts,
        map    : {
            '*': {
                'css': 'plugins/require-css/css'
            }
        },

        paths: {
            // custom build with jsbuild
            'jquery'                     : 'plugins/jquery/dist/jquery.min',
            'plugins/bootstrap'          : 'plugins/bootstrap.custom.min',
            'jquery-ui'                  : 'plugins/jquery-ui/ui',

            // dont prefix jade, template amd loader require it, same as jquery
            'jade'                       : 'plugins/jade/runtime',
            'string'                     : 'plugins/underscore.string/dist/underscore.string.min',
            'code-mirror'                : 'plugins/requirejs-codemirror/src/code-mirror',
            'ace'                        : 'plugins/ace/lib/ace',
            'Q'                          : 'plugins/q/q',

            // custom uglified and moved
            'plugins/bootbox'            : 'plugins/bootbox',
            'plugins/modernizr'          : 'plugins/modernizr',
            'plugins/mscrollbar'         : 'plugins/mscrollbar',

            // default vendor paths
            'plugins/async'              : 'plugins/async/lib/async',
            'plugins/svg'                : 'plugins/svg.js/dist/svg',
            'plugins/moment'             : 'plugins/moment/moment/min/moment.min',
            'plugins/select2'            : 'plugins/select2/select2.min',
            'plugins/marked'             : 'plugins/marked/marked.min',
            'plugins/highlightjs'        : 'plugins/highlightjs/highlight.pack',
            'plugins/cryptojs'           : 'plugins/cryptojslib/components',
            'plugins/toastr'             : 'plugins/toastr/toastr',
            'plugins/events'             : 'plugins/eventEmitter/EventEmitter.min',
            'plugins/github-api'         : 'plugins/github-api/github',
            'plugins/oauth2'             : 'plugins/javascript-oauth2/oauth2/oauth2',
            'plugins/oauth-io'           : 'plugins/oauth.io/dist/oauth.min',
            'plugins/md5'                : 'plugins/blueimp-md5/js/md5.min',
            'plugins/pace'               : 'plugins/pace/pace.min',
            'plugins/speakingurl'        : 'plugins/speakingurl/speakingurl.min',

            // jquery
            'plugins/jquery-rest'        : 'plugins/jquery.rest/dist/1/jquery.rest.min',
            'plugins/jquery-migrate'     : 'plugins/jquery-migrate/jquery-migrate',
            'plugins/jquery-slimscroll'  : 'plugins/jquery-slimscroll/jquery.slimscroll.min',
            'plugins/jquery-slugify'     : 'plugins/jquery-slugify/dist/slugify.min',
            'plugins/mousewheel'         : 'plugins/jquery-mousewheel/jquery.mousewheel.min',
            'plugins/uniform'            : 'plugins/jquery.uniform/jquery.uniform.min',
            'plugins/impromptu'          : 'plugins/jquery-impromptu/dist/jquery-impromptu.min',
            'plugins/cookie'             : 'plugins/jquery-cookie/jquery.cookie',
            'plugins/validation'         : 'plugins/jquery-form-validator/form-validator/jquery.form-validator.min',
            'plugins/tag-it'             : 'plugins/tag-it/js/tag-it.min',

            // bootstrap
            'plugins/bs-datepicker'      : 'plugins/bootstrap-datepicker/js/bootstrap-datepicker',
            'plugins/bs-progressbar'     : 'plugins/bootstrap-progressbar/bootstrap-progressbar',
            'plugins/bs-modal'           : 'plugins/bootstrap-modal/js/bootstrap-modal',
            'plugins/bs-modal-manager'   : 'plugins/bootstrap-modal/js/bootstrap-modalmanager',
            'plugins/bs-switch'          : 'plugins/bootstrap-switch/dist/js/bootstrap-switch.min',
            'plugins/bs-select'          : 'plugins/bootstrap-select/dist/js/bootstrap-select.min',
            'plugins/bs-confirmation'    : 'plugins/bootstrap-confirmation2/bootstrap-confirmation',
            'plugins/bs-maxlength'       : 'plugins/bootstrap-maxlength/bootstrap-maxlength.min',
            'plugins/bs-material'        : 'vendor/material',
            'plugins/bs-material-ripples': 'plugins/bootstrap-material-design/scripts/ripples',
            'plugins/contextmenu'        : 'plugins/bootstrap-contextmenu/bootstrap-contextmenu',
            'plugins/gtreetable'         : "plugins/bootstrap-gtreetable/dist/bootstrap-gtreetable",


            // gsap
            'plugins/gsap/lite'          : 'plugins/gsap/src/minified/TweenLite.min',
            'plugins/gsap/max'           : 'plugins/gsap/src/minified/TweenMax.min',
            'plugins/gsap/ease'          : 'plugins/gsap/src/minified/easing/EasePack.min',
            'plugins/gsap/css'           : 'plugins/gsap/src/minified/plugins/CSSPlugin.min',
            'plugins/gsap/attr'          : 'plugins/gsap/src/minified/plugins/AttrPlugin.min',
            'plugins/gsap/color'         : 'plugins/gsap/src/minified/plugins/ColorPropsPlugin.min',
            'plugins/gsap/scroll'        : 'plugins/gsap/src/minified/plugins/ScrollToPlugin.min',
            'plugins/gsap/text'          : 'plugins/gsap/src/minified/plugins/TextPlugin.min',
            'plugins/gsap/jquery-lite'   : 'plugins/gsap/src/minified/jquery.gsap.min',
            'plugins/gsap/jquery-max'    : 'plugins/gsap/src/minified/jquery.gsap.min',


            // Datatables
            'datatables'                 : 'plugins/datatables/media/js/jquery.dataTables.min',
            'datatables/plugins'         : 'plugins/datatables-plugins',
            'datatables/bs-plugins'      : 'plugins/datatables-plugins',

            // stylesheets
            'plugins/select2css'         : '../styles/components/select2',
            'plugins/highlightjscss'     : 'plugins/highlightjs/styles/zenburn'
        },





        shim: {
            // stand-alone and exports
            'plugins/svg'       : {exports: 'SVG'},
            'jade'              : {exports: 'jade'},
            'string'            : {exports: '_s'},
            'plugins/github-api': {exports: 'Github'},
            'plugins/oauth2'    : {exports: 'oauth2'},
            'plugins/oauth-io'  : {exports: 'OAuth'},

            // jquery
            'jquery'            : {
                exports: '$',
                init   : function () {
                    this.jquery.noConflict();
                }
            },

            'plugins/jquery-migrate'  : ['jquery'],
            'jquery-ui'               : ['jquery'], //, 'jquery-migrate'],
            'plugins/jquery-slugify'  : ['jquery', 'plugins/speakingurl'],
            'plugins/tag-it'          : ['jquery-ui/core', 'jquery-ui/widget', 'jquery-ui/position', 'jquery-ui/menu', 'jquery-ui/autocomplete'],
            // bootstrap
            'plugins/bootstrap'       : ['jquery'],
            'plugins/gtreetable'      : ['plugins/jquery-migrate', 'plugins/jquery-ui/core', 'plugins/jquery-ui/draggable', 'plugins/jquery-ui/droppable'],
            'plugins/mscrollbar'      : ['plugins/bootstrap', 'plugins/mousewheel'],
            'plugins/bs-modal'        : ['plugins/bootstrap', 'plugins/bs-modal-manager'],
            'plugins/bs-material'     : ['plugins/bootstrap', 'plugins/bs-material-ripples'],
            'plugins/bs-confirmation' : ['plugins/bootstrap'],

            // misc
            'plugins/gsap/lite'       : ['plugins/gsap/scroll'],
            'plugins/gsap/max'        : {exports: 'TweenMax', deps: ['plugins/gsap/scroll']},
            'plugins/gsap/jquery-lite': ['jquery', 'plugins/gsap/lite'],
            'plugins/gsap/jquery-max' : ['jquery', 'plugins/gsap/max'],

            'vendor/dataTables.bootstrap': ['datatables'],

            'plugins/select2'    : ['css!plugins/select2css'],
            'plugins/highlightjs': ['css!plugins/highlightjscss'],

            // packadic scripts
            'config'             : ['jquery'],
            'eventer'            : ['jquery', 'plugins/events'],
            'autoload'           : ['jquery'],
            'theme'              : ['plugins/bootstrap', 'jade', 'plugins/cookie', 'plugins/events'],
            'demo'               : ['theme']
        },


        waitSeconds: 5,

        config: {
            debug: true
        },

        cm: {
            // baseUrl to CodeMirror dir
            baseUrl: 'plugins/codemirror/',
            // path to CodeMirror lib
            path   : 'lib/codemirror',
            // path to CodeMirror css file
            css    : packadic.config.requireJS.basePath + '/lib/codemirror.css',
            // define themes
            themes : {
                monokai : '/path/to/theme/monokai.css',
                ambiance: '/path/to/theme/ambiance.css',
                eclipse : '/path/to/theme/eclipse.css'
            },
            modes  : {
                // modes dir structure
                path: 'mode/{mode}/{mode}'
            }
        }


    };

    jqui.forEach(function (name) {
        packadic.config.requireJS.paths['plugins/jquery-ui/' + name] = 'plugins/jquery-ui/ui/minified/' + name + '.min'
    });
}.call());
