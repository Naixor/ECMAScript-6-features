$traceurRuntime.options.symbols = true;
var $__0;
var name = "a";
var Car = ($__0 = {}, Object.defineProperty($__0, "name", {
  value: name,
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__0, "toString", {
  value: function() {
    return this.name;
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__0, 'prop_' + ((function(a) {
  return ++a;
}))(41), {
  value: 42,
  configurable: true,
  enumerable: true,
  writable: true
}), $__0);
var name = "b";
var Benz = {
  __proto__: Car,
  name: name,
  toString: function() {
    return this.__proto__;
  }
};
var Position = (function(x, y) {
  return {
    x: x,
    y: y
  };
});
console.log(Car);
console.log(Car.toString());
console.log(Benz);
console.log(Benz.toString());
console.log(Position(0, 0));
