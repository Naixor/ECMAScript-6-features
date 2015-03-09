var name = "a"
var Car = {
	name,
	toString(){
		return this.name;
	},
	[ 'prop_' + ((a) => ++a)(41) ]: 42
}

var name = "b";
var Benz = {
	__proto__: Car,
	name,
	toString() {
		return super.toString();
		// return this['prop_42'];
		// return this.__proto__;
	} 
}

var Position = (x, y) => {
	return { x, y };
};

console.log(Car);
console.log(Car.toString());
console.log(Benz);
console.log(Benz.toString());
console.log(Position(0, 0))