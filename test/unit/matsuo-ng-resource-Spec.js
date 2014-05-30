
"use strict";


describe("Matsuo IT JS Util", function() {

  describe("Underscore extensions", function() {
    var obj = {
      prop: {
        value: 'test'
      }
    };

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
    describe("pushArray", function() {
      var arr = ['a', 'b'].pushArray(['c', 'd']);
      expect(arr[0]).toBe('a');
      expect(arr[1]).toBe('b');
      expect(arr[2]).toBe('c');
      expect(arr[3]).toBe('d');
    });

    describe("byProp", function() {
      var arr = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' }
      ];

      expect(arr.byProp('id', 1).name).toBe('a');
      expect(arr.byProp('name', 'b').id).toBe(2);
    });

    describe("remove", function() {
      var obj = { id: 7 };
      var arr = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        obj
      ];

      arr.remove(obj);

      expect(arr.length).toBe(2);
    });

    describe("filter", function() {
      var arr = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 3, name: 'a' }
      ];

      expect(arr.filter(function (element) { return element.name === 'a'; }).length).toBe(2);
      expect(arr.filter(function (element) { return element.id === 1; }).length).toBe(1);
    });
  });
});

