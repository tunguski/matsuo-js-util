/// <reference path="counter.js">
"use strict";


describe("Object", function() {

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

