function f(x, y=12) {
	return x + y;
}
f(3); // 15

function f(x, ...y) {
  	return x * y.length;
}
f(3, "hello", true); // 6

function f(x, y, z) {
  	return x + y + z;
}
f(...[1,2,3]); // 6

class Vector  {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	equal(...v) {
		var x = v[0], y= v[1];
		return (!!(''+x) && !!(''+y)) ?  this.x === x && this.y === y : false;
	}
}

var v1 = new Vector();
console.log(v1.equal(...[0, 0]));