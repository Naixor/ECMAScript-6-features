$traceurRuntime.options.symbols = true;
var $__0 = this;
var bob = {
  _name: "Bob",
  _friends: ["Tom", "Jerry"],
  printFriends: function() {
    var $__0 = this;
    this._friends.forEach(($traceurRuntime.initTailRecursiveFunction(function(f) {
      return $traceurRuntime.call(function(f) {
        return $traceurRuntime.continuation(console.log, console, [$__0._name + " knows " + f]);
      }, this, arguments);
    })));
  }
};
bob.printFriends();
var tom = {
  _name: "Tom",
  _friends: ["Bob", "Jerry"],
  printFriends: (function() {
    console.log($__0 === global);
  })
};
tom.printFriends();
var test = (function(i) {
  return ++i;
});
console.log(test(2));
console.log($traceurRuntime);
