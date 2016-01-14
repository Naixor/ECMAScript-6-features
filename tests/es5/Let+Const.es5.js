$traceurRuntime.options.symbols = true;
(function() {
  for (var n = 0; n < 10; n++) {}
  console.log(n);
  var arr = [];
  for (var n = 0; n < 10; n++) {
    arr[$traceurRuntime.toProperty(n)] = function() {
      console.log(n);
    };
  }
  arr[0]();
  var n = 11;
  arr[0]();
  var arr = [];
  var $__0 = function(i) {
    arr[$traceurRuntime.toProperty(i)] = function() {
      console.log(i);
    };
  };
  for (var i = 0; i < 10; i++) {
    $__0(i);
  }
  arr[2]();
})();
(function() {
  {
    console.log(m$__1);
    var m$__1 = "m";
  }
  {
    var func1$__4 = function() {
      console.log(m$__2);
      console.log(n$__3);
      m$__2 = n$__3 + 1;
      console.log(m$__2);
      console.log(n$__3);
    };
    var m$__2;
    var n$__3 = 0;
    func1$__4();
  }
  console.log(m, n);
  function func2() {
    console.log(m, n);
  }
  func2();
})();
(function() {
  var v = "Hello";
  (function() {
    console.log(v);
  })();
  var v = "Hello";
  (function() {
    console.log(v);
    var v = "World";
    console.log(v);
  })();
  console.log(v);
  var v = "Hello";
  (function() {
    console.log(v);
    var v = "World";
    console.log(v);
  })();
  console.log(v);
})();
