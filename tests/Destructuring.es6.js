// 解构报错，类似的写法都会导致这个问题
// var [a, b] = undefined;
// var [a, b] = Object.create(null);
// var [a, b] = null;

// 不完全模式匹配
var {toString: a} = [0, 1];
console.log(a === Array.prototype.toString); // true
console.log(toString); // undefined

var {toString} = [1, 2];
console.log(toString === Array.prototype.toString); // true

var [a, b] = "12";
console.log(a, b); // 1 2

var [a, b] = [function(){console.log(this)}, function(){return a}];
a();  // undefined
console.log(a === b()); // true

var func = function(){console.log(this)};
var [a, b] = [func, function(){return a}];
func();
a();  // undefined
console.log(a === b()); // true

var [{ name }] = [function funa(){console.log(this)}, function(){return fa}];
funa(); // TypeError: funa is not defined
console.log(name); // funa

var length;
[length] = [2];
console.log(length); // 2
({length} = [2]); // 这里注意：{length} = [2]和({length}) = [2] 这两种写法都会导致解释器将{}误以为是代码块而报错
console.log(length); // 1

/*
 * 
 */ 