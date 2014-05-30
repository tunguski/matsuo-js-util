/**
 @fileOverview

 @toc

 */

'use strict';


(function() {
  /**
   * Base object tree processing function. Used in others.
   */
  function processObject(object, path, fn) {
    path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    path = path.replace(/^\./, '');           // strip a leading dot
    var a = path.split('.');
    while (a.length) {
      var n = a.shift();
      object = fn(object, n, a.length);
      if (!object) {
        return;
      }
    }
    return object;
  }

  _.mixin({
    uncapitalize: function(string) { return string.charAt(0).toLowerCase() + string.substring(1); },
    capitalize: function(string) { return string.charAt(0).toUpperCase() + string.substring(1); },
    isDefined: function(object) { return !_.isUndefined(object); },
    strContains: function(str, it) { return str.indexOf(it) != -1; },
    endsWith: function(str, suffix) { return str.indexOf(suffix, str.length - suffix.length) !== -1; },

    /**
     * Returns object that 'path' leads to in 'object' properties.
     */
    getByPath: function(object, path) {
      return processObject(object, path, function (object, n) {
        if (object && n in object) {
          return object[n];
        }
      });
    },

    /**
     * Sets 'value' to 'path' in scope of 'object'.
     */
    setByPath: function(object, path, value) {
      return processObject(object, path, function (object, n, aLength) {
        if (aLength) {
          if (object && n in object) {
            return object[n];
          }
        } else {
          object[n] = value;
        }
      });
    },

    /**
     * Retrieves object from 'path' in scope of 'object'. If any part of 'path' does not exist, it will be created as
     * objects.
     */
    getOrCreate: function(object, path) {
      return processObject(object, path, function (object, n) {
        if (!(n in object)) {
          object[n] = {};
        }
        return object[n];
      });
    },

    // serialize DOM fragment to string
    serializeObject: function(dom) {
      var o = {};
      var a = dom.serializeArray();
      $.each(a, function() {
        if (o[dom.name] !== undefined) {
          if (!o[dom.name].push) {
            o[dom.name] = [o[dom.name]];
          }
          o[dom.name].push(dom.value || '');
        } else {
          o[dom.name] = dom.value || '';
        }
      });
      return o;
    }
  });

})();


// Array

Array.prototype.pushArray = function(arr) {
  this.push.apply(this, arr);
  return this;
};

Array.prototype.byProp = function(property, id) {
  return _.find(this, function(element) {
    return element[property] === id;
  });
};

Array.prototype.remove = function(element) {
  var index = this.indexOf(element);
  if (index >= 0) {
    this.splice(index, 1);
  }
};

// array.filter
if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array();
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
      {
        var val = this[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, this))
          res.push(val);
      }
    }

    return res;
  };
}
