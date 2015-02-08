/**
 @fileOverview

 @toc

 */

'use strict';

var matsuo_js_util = {};

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
    uncapitalize: function(string) {
      return string.charAt(0).toLowerCase() + string.substring(1);
    },
    capitalize: function(string) {
      return string.charAt(0).toUpperCase() + string.substring(1);
    },
    isDefined: function(object) {
      return !_.isUndefined(object);
    },
    strContains: function(str, it) {
      return str.indexOf(it) != -1;
    },
    endsWith: function(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    },

    lpad: function (n, p, c) {
      var pad_char = typeof c !== 'undefined' ? c : '0';
      var pad = new Array(1 + p).join(pad_char);
      return (pad + n).slice(-pad.length);
    },

    /**
     * Value is considered empty if it is undefined, it is null, or (trimmed)
     * matches ''. Function matches broader - 0 is empty too.
     */
    empty: function(value) {
      return (!(typeof value !== 'undefined')) || (!value || !!value.trim());
    },

    lastUrlElement: function(headers) {
      var url = headers('Location');
      return url.substring(url.lastIndexOf('/') + 1);
    },

    clearObject: function (object) {
      _.keys(object).forEach(function (key) {
        delete object[key];
      });
      return object;
    },


    /**
     * If string starts from number, "_" prefix will be added. Each dot is converted to underscore.
     */
    normalizeToI18nCode: function(text) {
      return (/^[0-9]/.test(text) ? '_' : '') + text.replace(/\./g, '_');
    },


    getIdFromLocation: function(headers) { return parseInt(_.lastUrlElement(headers)); },

    /**
     * Removes from passed object all properties that value is empty string, null or undefined. Additionally removes
     * all properties which name start from '$' - that are angular internal properties.
     */
    filterRequestData: function(obj) {
      for(var x in obj) {
        if (obj[x] === ''
            || obj[x] === null
            || obj[x] === undefined
            // angular properties
            || x.indexOf('$') === 0) {
          var toRemove = obj[x];
          delete obj[x];
        }
      }

      return obj;
    },


    /**
     * Returns object that all properties are serialized to string.
     */
    paramsObject: function(obj) {
      function serialize(value) {
        if (value instanceof Date) {
          return value.toISOString();
        } else if (moment && moment.isMoment(value)) {
          return value.valueOf();
        } else {
          return value.toString();
        }
      }

      var result = {};
      for(var x in _.filterRequestData(obj)) {
        result[x] = serialize(obj[x]);
      }

      return result;
    },

    /**
     * Transforms object to url query part.
     */
    toUrlParams: function (obj) {
      var result = '';
      obj = _.paramsObject(obj);
      for(var x in obj) {
        result = result + x + '=' + obj[x] + '&';
      }
      return _.endsWith(result, '&') ? result.substr(0, result.length - 1) : result;
    },

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
  });


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

  matsuo_js_util.array_filter = function(fun) {
    var len = this.length;
    if (!_.isFunction(fun)) {
      throw new TypeError();
    }

    var res = new Array();
    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in this) {
        var val = this[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, this))
          res.push(val);
      }
    }

    return res;
  };

  // array.filter
  Array.prototype.filter = Array.prototype.filter || matsuo_js_util.array_filter;


  // Date

  function pad(number) {
    var r = String(number);
    if ( r.length === 1 ) {
      r = '0' + r;
    }
    return r;
  }

  matsuo_js_util.date_toISOString = function() {
    return this.getUTCFullYear()
        + '-' + pad( this.getUTCMonth() + 1 )
        + '-' + pad( this.getUTCDate() )
        + 'T' + pad( this.getUTCHours() )
        + ':' + pad( this.getUTCMinutes() )
        + ':' + pad( this.getUTCSeconds() )
        + '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
        + 'Z';
  };

  Date.prototype.toISOString = Date.prototype.toISOString || matsuo_js_util.date_toISOString;
})();
