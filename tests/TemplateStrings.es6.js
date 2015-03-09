// 基本用法
console.log(`Hello Template Strings!`);
// output: Hello Template  Strings!

// 多行表达
console.log(`Hello
  Template
Strings!`);
/* output: |Hello
 *       |  Template  
 *       |Strings!
 */        

// 变量插值
var who = "Template Strings"; // var who = `Template Strings`; 这俩结果一样
console.log(`Hello ${who}!`);
// output: Hello Template  Strings!

// 函数插值
function what() {
  return "Template Strings";
}
console.log(`Hello ${ what() }!`);
// output: Hello Template  Strings!

// 属性插值
var which = {
  value: "Template Strings"
}
console.log(`Hello ${ which.value }!`);
// output: Hello Template  Strings!

// 模板字符串的前缀，这里构造一个请求天气情况的GET函数，帮助大家感受一下这个特性
// var url = "http://php.weather.sina.com.cn/iframe/index/w_cl.php";
// var city = "北京";
// GET`${ url }?code=js&city=${ city }`(handler);

// function GET(strArgs, url, city) {
//   // console.log(Array.prototype.slice.call(arguments)); // output:  [[ '', '?code=js&city=', '' ], 'http://php.weather.sina.com.cn/iframe/index/w_cl.php', '北京' ]  
//   return function (handler) {
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', `${ url }${ strArgs.join('') }${ city }`, false);
//     xhr.onreadystatechange = handler.bind(xhr);
//     xhr.send();
//   }
// }
// function handler() {
//   if (this.readyState === 4) {
//     console.log(this.responseText);
//   }
// }
/*  output(在浏览其中运行):
 *    (function(){var w=[];w['北京']=[{s1:'晴',s2:'晴',f1:'qing',f2:'qing',t1:'4',t2:'-4',p1:'5-6',p2:'3-4',d1:'北风',d2:'北风'}];var add={now:'2015-03-03 13:06:46',time:'1425359206',update:'北京时间03月03日08:05更新',error:'0',total:'1'};window.SWther={w:w,add:add};})();//0
 */

// 在模板字符串前缀表达函数内部还原初始字符串
var url = "php.weather.sina.com.cn/iframe/index/w_cl.php";
var city = "北京";

console.log( FUN`http://${ url }?code=js&city=${ city }` );

function FUN() {
  var args = Array.prototype.slice.call(arguments);
  console.log(args)
  var strArr = [];
  var i = 0;
  return Array.prototype.join.call((args[0].forEach((function(length){
  	return function(el, index) {
	    strArr.push(el);
	    if (index !== length-1) {
	    	strArr.push(args[++i])
	    }
	}
  })(args[0].length)), strArr), '');
}