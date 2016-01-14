class Car {
	constructor(name) {
		this.name = name;
	}
	printName() {
		console.log("im a Car, my name is " + this.name);
	}
	static defaultPro() {
		console.log("Car")
	}
}

class Benz extends Car {
	constructor(name) {
		super(name);
	}
	printName() {
		console.log("im a Benz Car, my name is " + this.name);
	}
}

var a = new Car("a");
a.printName();
Car.defaultPro();

var b = new Benz("b");
b.printName();
Benz.defaultPro();

console.log(b)
console.log(Benz.prototype)