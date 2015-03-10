// Let
(function(){
	{
		console.log(m); // ReferenceError: m is not defined
		let m = "m";
	}
	{
		let m;
		const n = 0;
		function func1() {
			console.log(m); // undefined
			console.log(n); // 0
			m = n + 1;
			// n = 1; // n is read-only
			console.log(m); // 1
			console.log(n); // 0
		}
		func1();
	}
	console.log(m, n); // ModuleEvaluationError: m, n is not defined

	function func2() {
		console.log(m, n);
	}
	func2(); // ES6: ReferenceError: m, n is not defined; traceur: m 0
})();

(function(){
	// case 1
	var v = "Hello";
	(function(){
	  // 这里代码块内未找到v，只好去当前代码块的上一层查找病引用
	  console.log(v); // output: Hello
	})();

	// case 2
	var v = "Hello";
	(function(){
	  // 由于JS的变量提前机制，这里的结果比较好理解
	  console.log(v); // output: undefined
	  var v = "World";
	  console.log(v); // output: World
	})();
	console.log(v); // output: Hello

	// case 3
	var v = "Hello";
	(function(){
	  // let还是会遵循变量提前，但是其提前的变量在未发生赋值行为前无法访问，因此出现下面情况
	  console.log(v); // ReferenceError
	  let v = "World"; 
	  console.log(v); // output: World
	})();
	console.log(v); // output: Hello
})();

(function(){
	for (var n = 0; n < 10; n++) {}
	console.log(n); // output: 10

	for (let i = 0; i < 10; i++) {}
	console.log(i); // ReferenceError: i is not defined

	var arr = [];
	for (var n = 0; n < 10; n++) {
		arr[n] = function(){
			console.log(n);
		}
	}
	arr[2](); // output: 10
	var n = 11;
	arr[2](); // output: 11

	var arr = [];
	for (let i = 0; i < 10; i++) {
		arr[i] = function(){
			console.log(i);
		};
	}
	arr[2](); // output: 2
})();

(function(){
	var a = 5;
	let(a = 6) console.log(a); // 6
	console.log(a); // 5

	var x = 5;
	var y = 0;
	let (x = x+10, y = 12) {
		console.log(x+y); // 27
	}
	console.log(x + y); // 5
})();

// Const
(function(){
	var PI = 3;
	const v; // SyntaxError，必须要给const变量一个初始值
	{
		const PI = 3.14;
		const PI2 = PI*2;
		var PI = "PI"; let PI = "PI"; // SyntaxError: Identifier 'PI' has already been declared
		console.log(PI, PI2); // 3.14 6.28
		PI = 'PI'; // SyntaxError: Assignment to constant variable.
	}
	console.log(PI); // 3

	const Math = {PI: PI};
	console.log(Math);
	Math.PI = 3.14;
	console.log(Math);
	Math.PI2 = 2 * Math.PI;
	console.log(Math);
})();