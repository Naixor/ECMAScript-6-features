$traceurRuntime.options.symbols = true;
var $__3,
    $__4,
    $__6,
    $__7,
    $__9,
    $__10,
    $__12,
    $__13,
    $__14,
    $__15,
    $__17,
    $__18,
    $__19,
    $__20;
var a = [0, 1].toString;
console.log(a === Array.prototype.toString);
var toString = [1, 2].toString;
console.log(toString === Array.prototype.toString);
var $__2 = "12",
    a = ($__3 = $__2[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](), ($__4 = $__3.next()).done ? void 0 : $__4.value),
    b = ($__4 = $__3.next()).done ? void 0 : $__4.value;
console.log(a, b);
var $__5 = [function() {
  console.log(this);
}, function() {
  return a;
}],
    a = ($__6 = $__5[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](), ($__7 = $__6.next()).done ? void 0 : $__7.value),
    b = ($__7 = $__6.next()).done ? void 0 : $__7.value;
a();
console.log(a === b());
var func = function() {
  console.log(this);
};
var $__8 = [func, function() {
  return a;
}],
    a = ($__9 = $__8[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](), ($__10 = $__9.next()).done ? void 0 : $__10.value),
    b = ($__10 = $__9.next()).done ? void 0 : $__10.value;
func();
a();
console.log(a === b());
var name = ($__14 = [function funa() {
  console.log(this);
}, function() {
  return fa;
}][$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](), ($__15 = $__14.next()).done ? void 0 : $__15.value).name;
funa();
console.log(name);
var length;
($__17 = [2], length = ($__18 = $__17[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](), ($__19 = $__18.next()).done ? void 0 : $__19.value), $__17);
console.log(length);
(($__20 = [2], length = $__20.length, $__20));
console.log(length);
