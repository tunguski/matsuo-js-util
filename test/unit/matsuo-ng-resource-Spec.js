
"use strict";


describe("Matsuo IT JS Util", function() {

  describe("Underscore extensions", function() {
    var obj = {
      prop: {
        value: 'test'
      }
    };

    it("filterRequestData works", function() {
      var obj = {
        a: "is",
        b: "",
        c: null
      };

      var result = _.filterRequestData(obj);

      expect(result.a).toBe('is');
      expect(result.b).toBe(undefined);
      expect(result.c).toBe(undefined);
    });

    it("paramsObject works", function() {
      var obj = {
        // not all browser compatible, but it's only for testing purposes
        date: new Date('2013-03-01T00:10:00.000Z'),
        obj: { id: 3 },
        str: "str"
      };

      var result = _.paramsObject(obj);

      expect(result.date).toBe('2013-03-01T00:10:00.000Z');
      expect(result.obj).toBe('[object Object]');
      expect(result.str).toBe('str');
    });

    it("toUrlParams works", function() {
      var obj = {
        // not all browser compatible, but it's only for testing purposes
        date: new Date('2013-03-01T00:10:00.000Z'),
        obj: { id: 3 },
        str: "str"
      };

      expect(_.toUrlParams(obj)).toBe('date=2013-03-01T00:10:00.000Z&obj=[object Object]&str=str');
    });

    it("capitalize works", function() {
      expect(_.capitalize('xx')).toBe('Xx');
    });

    it("uncapitalize works", function() {
      expect(_.uncapitalize('XX')).toBe('xX');
    });

    it("isDefined works", function() {
      expect(_.isDefined({})).toBe(true);
      expect(_.isDefined()).toBe(false);
    });

    it("strContains works", function() {
      expect(_.strContains('kosmos', 'smo')).toBe(true);
    });


    it("lpad works", function() {
      expect(_.lpad('xx', 4, '0')).toBe('00xx');
    });

    it("empty works", function() {
      expect(_.empty('x')).toBe(true);
      expect(_.empty(' ')).toBe(false);
    });

    it("lastUrlElement works", function() {
      expect(_.lastUrlElement(function () {
        return '/api/test/7'
      })).toBe('7');
    });

    it("clearObject works", function() {
      expect(_.clearObject({ a: 7 }).a).toBe(undefined);
    });

    it("normalizeToI18nCode works", function() {
      expect(_.normalizeToI18nCode('7.x.5')).toBe('_7_x_5');
    });

    it("getIdFromLocation works", function() {
      expect(_.getIdFromLocation(function () {
        return '/api/test/7'
      })).toBe(7);
    });


    it("getByPath works", function() {
      expect(_.getByPath(obj, 'prop.value')).toBe('test');
    });

    it("setByPath works", function() {
      _.setByPath(obj, 'prop.value2', 7);
      expect(obj.prop.value2).toBe(7);
    });

    it("getOrCreate works", function() {
      expect(_.getOrCreate(obj, 'prop.value3.x.y')).toBeDefined();
      expect(obj.prop.value3.x.y).toBeDefined();
    });
  });

  describe("Array extensions", function() {
    it("pushArray", function() {
      var arr = ['a', 'b'].pushArray(['c', 'd']);
      expect(arr[0]).toBe('a');
      expect(arr[1]).toBe('b');
      expect(arr[2]).toBe('c');
      expect(arr[3]).toBe('d');
    });

    it("byProp", function() {
      var arr = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' }
      ];

      expect(arr.byProp('id', 1).name).toBe('a');
      expect(arr.byProp('name', 'b').id).toBe(2);
    });

    it("remove", function() {
      var obj = { id: 7 };
      var arr = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        obj
      ];

      arr.remove(obj);

      expect(arr.length).toBe(2);
    });

    it("filter", function() {
      var arr = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 3, name: 'a' }
      ];

      expect(arr.filter(function (element) { return element.name === 'a'; }).length).toBe(2);
      expect(arr.filter(function (element) { return element.id === 1; }).length).toBe(1);
    });
  });

  it("array_filter works", function() {
    var arr = matsuo_js_util.array_filter.call([0, 1, 2, 3], function (val) { return val > 1; });
    expect(arr.length).toBe(2);
    expect(arr[0]).toBe(2);
    expect(arr[1]).toBe(3);
  });

  it("date_toISOString works", function() {
    expect(matsuo_js_util.date_toISOString.call(new Date(2014, 3, 3))).toBe('2014-04-02T22:00:00.000Z');
  });
});

