$traceurRuntime.options.symbols = true;
{
  var Iterator = $traceurRuntime.initTailRecursiveFunction(function(val) {
    return $traceurRuntime.call(function(val) {
      var proto = Object.create(null);
      proto[$traceurRuntime.toProperty(Symbol.iterator)] = {
        enumerable: true,
        configurable: true,
        value: function() {
          var cur = this;
          return {next: function() {
              if (!!cur) {
                var value = cur.value;
                cur = cur.next;
                return {
                  value: value,
                  done: false
                };
              } else {
                return {done: true};
              }
            }};
        }
      };
      var __proto__ = Object.create({}, proto);
      return $traceurRuntime.continuation(Object.create, Object, [__proto__, {
        value: {
          enumerable: true,
          configurable: true,
          value: val
        },
        next: {
          writable: true,
          enumerable: true,
          configurable: true,
          value: null
        }
      }]);
    }, this, arguments);
  });
  var a = Iterator(0),
      b = Iterator(1),
      c = Iterator(2);
  a.next = b;
  b.next = c;
  c.next = null;
  var $__3 = true;
  var $__4 = false;
  var $__5 = undefined;
  try {
    for (var $__1 = void 0,
        $__0 = (a)[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](); !($__3 = ($__1 = $__0.next()).done); $__3 = true) {
      var i = $__1.value;
      {
        console.log(i);
      }
    }
  } catch ($__6) {
    $__4 = true;
    $__5 = $__6;
  } finally {
    try {
      if (!$__3 && $__0.return != null) {
        $__0.return();
      }
    } finally {
      if ($__4) {
        throw $__5;
      }
    }
  }
}
{
  var Iterator = function(val) {
    this.val = val;
    this.next = null;
  };
  Iterator.prototype[$traceurRuntime.toProperty(Symbol.iterator)] = function() {
    var cur = this;
    return {next: function() {
        if (!!cur) {
          var value = cur.val;
          cur = cur.next;
          return {
            value: value,
            done: false
          };
        } else {
          return {done: true};
        }
      }};
  };
  var a$__70 = new Iterator(0),
      b$__71 = new Iterator(1),
      c$__72 = new Iterator(2);
  a$__70.next = b$__71;
  b$__71.next = c$__72;
  c$__72.next = null;
  var $__10 = true;
  var $__11 = false;
  var $__12 = undefined;
  try {
    for (var $__8 = void 0,
        $__7 = (a$__70)[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](); !($__10 = ($__8 = $__7.next()).done); $__10 = true) {
      var i = $__8.value;
      {
        console.log(i);
      }
    }
  } catch ($__13) {
    $__11 = true;
    $__12 = $__13;
  } finally {
    try {
      if (!$__10 && $__7.return != null) {
        $__7.return();
      }
    } finally {
      if ($__11) {
        throw $__12;
      }
    }
  }
}
{
  var arr = [0, 1, 2, 3, 4, 5, 6, 7];
  var $__17 = true;
  var $__18 = false;
  var $__19 = undefined;
  try {
    for (var $__15 = void 0,
        $__14 = (arr)[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](); !($__17 = ($__15 = $__14.next()).done); $__17 = true) {
      var i$__73 = $__15.value;
      {
        console.log(i$__73);
      }
    }
  } catch ($__20) {
    $__18 = true;
    $__19 = $__20;
  } finally {
    try {
      if (!$__17 && $__14.return != null) {
        $__14.return();
      }
    } finally {
      if ($__18) {
        throw $__19;
      }
    }
  }
  var str = "01234567";
  var $__24 = true;
  var $__25 = false;
  var $__26 = undefined;
  try {
    for (var $__22 = void 0,
        $__21 = (str)[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](); !($__24 = ($__22 = $__21.next()).done); $__24 = true) {
      var i$__74 = $__22.value;
      {
        console.log(i$__74);
      }
    }
  } catch ($__27) {
    $__25 = true;
    $__26 = $__27;
  } finally {
    try {
      if (!$__24 && $__21.return != null) {
        $__21.return();
      }
    } finally {
      if ($__25) {
        throw $__26;
      }
    }
  }
  var set = new Set([0, 1, 2, 3, 4, 5, 6, 7]);
  var $__31 = true;
  var $__32 = false;
  var $__33 = undefined;
  try {
    for (var $__29 = void 0,
        $__28 = (set)[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](); !($__31 = ($__29 = $__28.next()).done); $__31 = true) {
      var i$__75 = $__29.value;
      {
        console.log(i$__75);
      }
    }
  } catch ($__34) {
    $__32 = true;
    $__33 = $__34;
  } finally {
    try {
      if (!$__31 && $__28.return != null) {
        $__28.return();
      }
    } finally {
      if ($__32) {
        throw $__33;
      }
    }
  }
  var map = new Map([[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]]);
  var $__38 = true;
  var $__39 = false;
  var $__40 = undefined;
  try {
    for (var $__36 = void 0,
        $__35 = (map.values())[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](); !($__38 = ($__36 = $__35.next()).done); $__38 = true) {
      var i$__76 = $__36.value;
      {
        console.log(i$__76);
      }
    }
  } catch ($__41) {
    $__39 = true;
    $__40 = $__41;
  } finally {
    try {
      if (!$__38 && $__35.return != null) {
        $__35.return();
      }
    } finally {
      if ($__39) {
        throw $__40;
      }
    }
  }
  var $__45 = true;
  var $__46 = false;
  var $__47 = undefined;
  try {
    for (var $__43 = void 0,
        $__42 = (map.keys())[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](); !($__45 = ($__43 = $__42.next()).done); $__45 = true) {
      var i$__77 = $__43.value;
      {
        console.log(i$__77);
      }
    }
  } catch ($__48) {
    $__46 = true;
    $__47 = $__48;
  } finally {
    try {
      if (!$__45 && $__42.return != null) {
        $__42.return();
      }
    } finally {
      if ($__46) {
        throw $__47;
      }
    }
  }
}
{
  var arr$__78 = [0, 1, 2, 3, 4, 5, 6, 7];
  arr$__78[$traceurRuntime.toProperty(Symbol.iterator)] = function() {
    var self = this;
    var index = 0;
    return {next: function() {
        return {
          done: index === self.length ? true : false,
          value: self[$traceurRuntime.toProperty(index++)]
        };
      }};
  };
  var $__52 = true;
  var $__53 = false;
  var $__54 = undefined;
  try {
    for (var $__50 = void 0,
        $__49 = (arr$__78)[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](); !($__52 = ($__50 = $__49.next()).done); $__52 = true) {
      var i$__79 = $__50.value;
      {
        console.log(i$__79);
      }
    }
  } catch ($__55) {
    $__53 = true;
    $__54 = $__55;
  } finally {
    try {
      if (!$__52 && $__49.return != null) {
        $__49.return();
      }
    } finally {
      if ($__53) {
        throw $__54;
      }
    }
  }
}
{
  var arr$__80 = [0, 1, 2, 3, 4, 5, 6, 7];
  arr$__80[$traceurRuntime.toProperty(Symbol.iterator)] = function() {
    var self = this;
    var index = 0;
    var pre = 0,
        value = 0;
    return {next: function() {
        var done = index === self.length;
        if (!done) {
          var tmp = self[$traceurRuntime.toProperty(index++)];
          value = pre + tmp;
          pre = value;
          return {
            value: value,
            done: done
          };
        } else {
          return {done: done};
        }
      }};
  };
  var $__59 = true;
  var $__60 = false;
  var $__61 = undefined;
  try {
    for (var $__57 = void 0,
        $__56 = (arr$__80)[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](); !($__59 = ($__57 = $__56.next()).done); $__59 = true) {
      var i$__81 = $__57.value;
      {
        console.log(i$__81);
      }
    }
  } catch ($__62) {
    $__60 = true;
    $__61 = $__62;
  } finally {
    try {
      if (!$__59 && $__56.return != null) {
        $__56.return();
      }
    } finally {
      if ($__60) {
        throw $__61;
      }
    }
  }
}
{
  Array.prototype[$traceurRuntime.toProperty(Symbol.iterator)] = function() {
    var self = this;
    var index = 0;
    var pre = 0,
        value = 0;
    return {next: function() {
        var done = index === self.length;
        if (!done) {
          var tmp = self[$traceurRuntime.toProperty(index++)];
          value = pre + tmp;
          pre = value;
          return {
            value: value,
            done: done
          };
        } else {
          return {done: done};
        }
      }};
  };
  var arr$__82 = [0, 1, 2, 3, 4, 5, 6, 7];
  var $__66 = true;
  var $__67 = false;
  var $__68 = undefined;
  try {
    for (var $__64 = void 0,
        $__63 = (arr$__82)[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](); !($__66 = ($__64 = $__63.next()).done); $__66 = true) {
      var i$__83 = $__64.value;
      {
        console.log(i$__83);
      }
    }
  } catch ($__69) {
    $__67 = true;
    $__68 = $__69;
  } finally {
    try {
      if (!$__66 && $__63.return != null) {
        $__63.return();
      }
    } finally {
      if ($__67) {
        throw $__68;
      }
    }
  }
}
