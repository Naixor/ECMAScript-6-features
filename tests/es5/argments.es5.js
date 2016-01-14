$traceurRuntime.options.symbols = true;
var $__3;
function f(x) {
  var y = arguments[1] !== (void 0) ? arguments[1] : 12;
  return x + y;
}
f(3);
function f(x) {
  for (var y = [],
      $__1 = 1; $__1 < arguments.length; $__1++)
    y[$traceurRuntime.toProperty($__1 - 1)] = arguments[$traceurRuntime.toProperty($__1)];
  return x * y.length;
}
f(3, "hello", true);
function f(x, y, z) {
  return x + y + z;
}
f.apply((void 0), $traceurRuntime.spread([1, 2, 3]));
var Vector = function Vector() {
  "use strict";
  var x = arguments[0] !== (void 0) ? arguments[0] : 0;
  var y = arguments[1] !== (void 0) ? arguments[1] : 0;
  this.x = x;
  this.y = y;
};
($traceurRuntime.createClass)(Vector, {equal: function() {
    "use strict";
    for (var v = [],
        $__2 = 0; $__2 < arguments.length; $__2++)
      v[$traceurRuntime.toProperty($__2)] = arguments[$traceurRuntime.toProperty($__2)];
    var x = v[0],
        y = v[1];
    return (!!('' + x) && !!('' + y)) ? this.x === x && this.y === y : false;
  }}, {});
var v1 = new Vector();
console.log(($__3 = v1).equal.apply($__3, $traceurRuntime.spread([0, 0])));
