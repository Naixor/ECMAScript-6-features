// =>语法的this指针
var bob = {
  _name: "Bob",
  _friends: ["Tom", "Jerry"],
  printFriends() {
    this._friends.forEach(f =>
		console.log(this._name + " knows " + f)
	);
  }
}
bob.printFriends();

var tom = {
  _name: "Tom",
  _friends: ["Bob", "Jerry"],
  printFriends:() => {
    console.log(this === global)
  }
}
tom.printFriends();

var test = (i) => ++i;
console.log(test(2));

console.log($traceurRuntime);