# ECMAScript 6
翻译自[lukehoban/es6features](http://git.io/es6features)，附带了一些方便理解的代码和个人的见解

## 介绍
ECMAScript6是即将更新的下一个ECMAScript标准，预期将于2015年6月获得批准。ES6首次针对2009年实现标准化了的ES5进行了明显的改进和升级。正在在主流的JavaScript引擎中实现这些新的特性，对于新特性的支持请看[这里](http://kangax.github.io/es5-compat-table/es6/)。

了解ECMAScript 6全部特性请查看[ES6标准草案](https://people.mozilla.org/~jorendorff/es6-draft.html)

ES6较ES5增加了下述新特性:

- [=>](#=>)
- [class](#class)
- [强化对象字面量](#强化对象字面量)
- [模板字符串](#模板字符串)
- [解构](#解构)
- [默认值 + `...`语法](#默认值+...语法)
- [let和const](#let和const)
- [迭代器和for..of](#迭代器和for..of)
- [生成器](#生成器)
- [unicode](#unicode)
- [模块](#模块)
- [模块加载器](#模块加载器)
- [map + set + weakmap + weakset](#map--set--weakmap--weakset)
- [proxies](#proxies)
- [symbols](#symbols)
- [子类化内建插件](#子类化内建插件)
- [promises](#promises)
- [math + number + string + object APIs](#math--number--string--object-apis)
- [binary and octal literals](#binary-and-octal-literals)
- [reflect api](#reflect-api)
- [tail calls](#tail-calls)

## ECMAScript 6新特性

### =>
`=>`是一种`function`缩写语法。这种语法类似于C#、Java 8和CoffeeScript。`=>`支持表达式写法和函数语句语句写法。与`function`不同，`=>`分享其周围代码相同的`this`。

```JavaScript
// Expression bodies
var odds = evens.map(v => v + 1);
var nums = evens.map((v, i) => v + i);
var pairs = evens.map(v => ({even: v, odd: v + 1}));

// Statement bodies
nums.forEach(v => {
  if (v % 5 === 0)
    fives.push(v);
});

// Lexical this
var bob = {
  _name: "Bob",
  _friends: ["Tom", "Jerry"], // 为了方便理解这里稍作修改
  printFriends() {
    this._friends.forEach(f =>
      console.log(this._name + " knows " + f));
  }
}
// bob.printFriends() output:
// Bob knows Tom
// Bob knows Jerry
```
##### 译者注：想更好的理解`=>`语法中的this，可以对比一下ES6翻译成ES5的版本：
```JavaScript
// ES6
var bob = {
  _name: "Bob",
  _friends: ["Tom", "Jerry"], // 为了方便理解这里稍作修改
  printFriends() {
    this._friends.forEach(f =>
      console.log(this._name + " knows " + f));
  }
}

// ES5
// traceur compile
var bob = {
  _name: "Bob",
  _friends: ["Tom", "Jerry"],
  printFriends: function() {
    var $__0 = this;
    this._friends.forEach(($traceurRuntime.initTailRecursiveFunction(function(f){
      return $traceurRuntime.call(function(f) {
        return $traceurRuntime.continuation(console.log, console, [$__0._name + " knows " + f]);
      }, this, arguments);
    })));
  }

};
```
##### 译者注：这里我们发现traceur-compiler帮助我们做了一较多的工作，换个角度可能更容易的理解他到底做了什么工作：
```JavaScript
// ES6
var tom = {
  _name: "Tom",
  _friends: ["Bob", "Jerry"],
  printFriends: () => {
    console.log(this === global)
  }
};
var bob = {
  _name: "Bob",
  _friends: ["Tom", "Jerry"],
  printFriends() {
    this._friends.forEach(f => { // 注意这里使用的是statement的表达方式(=> {})
      console.log(this._name + " knows " + f)
    });
  }
}

// ES5
// traceur compile
$traceurRuntime.options.symbols = true; // 这里编译器每次都会添加这个标记变量，后续ES6->ES5的翻译例子中略
var $__0 = this; // 由tom中的 =>
var tom = {
  _name: "Tom",
  _friends: ["Bob", "Jerry"],
  printFriends: (function() {
    console.log($__0 === global);
  })
};
var bob = {
  _name: "Bob",
  _friends: ["Tom", "Jerry"],
  printFriends: function() {
    var $__0 = this;
    this._friends.forEach((function(f) {
      console.log($__0._name + " knows " + f);
    }));
  }
};

```

##### 译者注：非常类似CoffeeScript中的`->`，需要注意的是假如你希望`() => {value: 1}`这样返回一个对象，需要让traceur不要将`{}`理解为代码块，因此这样写即可`() => ({value: 1})`。
```JavaScript
// CoffeeScript 1.7.1
func = (input) ->
    input

// ES5
(function(){
    var func;
    func = function(input){
        return input;
    }
}).call(this)
```
##### 译者总结：通俗来讲ES6中的`=>`最类似于CoffeeScript中的`->`(C#与Java中的匿名函数，但是译者对于C#和Java中能否清晰的展现出this的影响有点不清楚，只好以Coffee做例，欢迎大家帮忙补充加深理解)，this直接指向包围`=>`结构的代码的外侧一级。但是`=>{}`并不会产生像`->`一样的自带`return`的效果，`=>`则与`->`一样，默认对语句块中的最后一行执行`return`操作。这也是为什么`=>{}`这样的写法不会导致traceur帮助我们做一些额外的工作的原因，由于`return`操作可能会导致递归，这样`=>{return ...}`一样会迫使traceur产生一些处理，细节的处理过程可以阅读[traceur-runtime.js](https://github.com/google/traceur-compiler/blob/master/src/runtime/runtime.js)来了解。

### class
在ES6中，`class`是一种基于prototype实现面向对象模式的语法糖。`class`可以简单方便的声明、创建和使用类，并且鼓励互通性(这里译者理解是相对ES5中种类繁多的实现类的方法，有了一个统一的写法和规范，因此更具有通用性)。`class`支持继承、super函数调用(父类方法调用)、实例、静态方法(static)以及构造函数。

```JavaScript
class SkinnedMesh extends THREE.Mesh {
  constructor(geometry, materials) {
    super(geometry, materials);

    this.idMatrix = SkinnedMesh.defaultMatrix();
    this.bones = [];
    this.boneMatrices = [];
    //...
  }
  update(camera) {
    //...
    super.update();
  }
  static defaultMatrix() {
    return new THREE.Matrix4();
  }
}
```
##### 译者注：这里的例子让人好奇它到底采用的哪一种实现继承、静态方法、类方法等特性的，这里做个简单的es6中class的翻译实验：
```JavaScript
// ES 6
class Car {
    constructor (name) {
    this.name = name;
  }
  printName () {
    console.log("im a Car, my name is "+ this.name);
  }
  static defaultPro(){
    console.log("Car")
  }
}

class Benz extends Car {
  constructor (name) {
    super(name);
  }
  printName () {
    console.log("im a Benz Car, my name is "+ this.name);
  }
}

var a = new Car("a");
a.printName(); // im a Car, my name is a
Car.defaultPro(); // Car

var b = new Benz("b");
b.printName(); // im a Benz Car, my name is b
Benz.defaultPro(); // Car

// ES 5
// traceur compile
var Car = function Car(name) {
  "use strict";
  this.name = name;
};
($traceurRuntime.createClass)(Car, {printName: function() {
    "use strict";
    console.log("im a Car, my name is " + this.name);
  }}, {defaultPro: function() {
    "use strict";
    console.log("Car");
  }});
var Benz = function Benz(name) {
  "use strict";
  $traceurRuntime.superConstructor($Benz).call(this, name); // 注解见下，这里相当于Car.call(this, name)
};
var $Benz = Benz;
($traceurRuntime.createClass)(Benz, {printName: function() {
    "use strict";
    console.log("im a Benz Car, my name is " + this.name);
  }}, {}, Car);
var a = new Car("a");
a.printName();
Car.defaultPro();
var b = new Benz("b");
b.printName();
Benz.defaultPro();
```
##### 译者注：通过traceur源码的阅读，我们按照它的逻辑可以还原出一个简单直白的createClass(其真实的实现要严谨的多)：
```JavaScript
function createClass(ctor, object, staticObject, superClass) {
    Object.defineProperty(object, 'constructor', {
    value: ctor,
    configurable: true,
    enumerable: false,
    writable: true
  });
  if (arguments.length > 3) {
    if (typeof superClass === 'function')
      ctor.__proto__ = superClass;
    ctor.prototype = Object.create(superClass.prototype, Object.getDescriptors(object));
  } else {
    ctor.prototype = object;
  }
  Object.defineProperty(ctor, 'prototype', {
    configurable: false,
    writable: false
  });
  return Object.defineProperties(ctor, Object.getDescriptors(staticObject));
}
function superConstructor(ctor) {
    return ctor.__proto__;
}
```
##### 译者注：是一个很好的实现方案之一，与正常的原型继承实现的思路一致，和CoffeeScript利用__extends()的实现相比，并没有给子类产生额外的__super__，而且相对更安全：
```JavaScript
// CoffeeScript 1.7.1
class Car
    constructor: (name)->
    @name = name
  printName: () ->
    console.log "im a Car, my name is #{@name}"

class Benz extends Car
  constructor: (name)->
    super(name)
  printName: () ->
    console.log "im a Benz Car, my name is #{@name}"

// ES 5
(function() {
    var Benz, Car,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

    Car = (function() {
        function Car(name) {
            this.name = name;
        }
        Car.prototype.printName = function() {
            return console.log("im a Car, my name is " + this.name);
        };
        return Car;
    })();

    Benz = (function(_super) {
        __extends(Benz, _super);
        function Benz(name) {
            Benz.__super__.constructor.call(this, name);
        }
        Benz.prototype.printName = function() {
            return console.log("im a Benz Car, my name is " + this.name);
        };

        return Benz;
    })(Car);
}).call(this);
```

### 强化对象字面量
新版的`对象字面量`支持：在对象构造体中设置原型变量(`__proto__`)、简写版`foo: foo`赋值语句、函数定义、super(父指针)调用以及表达式表示属性名。这些属性也让`对象字面量`和`class`声明走的更近，并让基于对象的设计能够从这些相同的便利中获益。

```JavaScript
var obj = {
    // __proto__
    __proto__: theProtoObj,
    // Shorthand for ‘handler: handler’
    handler,
    // Methods
    toString() {
     // Super calls
     return "d " + super.toString();
    },
    // Computed (dynamic) property names
    [ 'prop_' + (() => 42)() ]: 42
};
```

##### 译者注：上面的例子让我们感觉到了这个新特性的强大，但事实并非如此：
```JavaScript
var name = "a";
var Car = {
    name, // foo : foo的简化赋值，可以使用变量，也可以写成
  toString(){  // 函数也可以 foo : foo
    return this.name;
  },
  [ 'prop_' + ((a) => ++a)(41) ]: 42 //属性名可以由表达式构成，如匿名函数
}

var name = "b";
var Benz = {
  __proto__: Car, // 由于译者的例子在node(v0.11.16和v0.12.x都测试过)环境下无法使用Object定义中的super关键字，因此这个__proto__属性就未知是否有想象中的那么神奇了，不过Car这个对象内的属性确实会被挂在Benz的原型链上
  name,
  toString() {
        // return super.toString(); // 这个super关键字确实在规范中有所定义，但是测试报错："Unexpected reserved word"，也许是还未实现把，who knows...
        // return this['prop_42']; // 正如所想，这里会成功返回Car中的['prop_42']即42
        return this.__proto__;
  }
}

console.log(Car); // { name: 'a', toString: [Function], prop_42: 42 }
console.log(Car.toString()); // a
console.log(Benz); // { name: 'b', toString: [Function] }
console.log(Benz.toString()); //{ name: 'a', toString: [Function], prop_42: 42 }
```

##### 译者注：同样我们贴上上述代码的ES5版本，以供大家感受这期中的奥妙：
```JavaScript
// ES 5
var $__0;
var name = "a";
var Car = ($__0 = {}, Object.defineProperty($__0, "name", {
    value: name,
    configurable: true,
    enumerable: true,
    writable: true
}), Object.defineProperty($__0, "toString", {
    value: function() {
        return this.name;
    },
    configurable: true,
    enumerable: true,
    writable: true
}), Object.defineProperty($__0, 'prop_' + ((function(a) {
        return ++a;
    }))(41), {
    value: 42,
    configurable: true,
    enumerable: true,
    writable: true
}), $__0);

var name = "b";
var Benz = {
    __proto__: Car,
    name: name,
    toString: function() {
        return this.__proto__;
    }
};
```

##### 译者总结：对象定义中的`__proto__`属性，在ES6规范中确实[存在](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-other-additional-features)，对象中函数内的`super`(感觉更像是super指针)的描述也[存在](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-super-keyword)。目前版本能继承父Object的异名属性，同名属性由于JS原型链的机制无法取到，正如翻译过后的ES5代码，要达到能使用super的版本还是蛮容易的，看traceur何时更新了。不过总的来说ES6针对对象定义做的改变是很方便的，比如我们就可以更优雅的写一个`Position`方法来返回坐标：
```JavaScript
var Position = (x, y) => {
    return { x, y };
};
```

##### 译者补充：通过在github与traceur作者的沟通，对象中的`super`无法使用是由于traceur-compiler团队还未增加这部分的处理，并无大碍，等待下个版本就好了。

### 模板字符串
模板字符串(template strings)提供拼接字符串所使用的语法糖。这个语法类似于Perl、Python或其他一些语言中的字符串插值语法。你可以选择添加任意的标记以便订制字符串结构、避免字符串注入攻击或者依据字符串的内容构建更高阶的数据结构。

```JavaScript
// 基本的字符串字面量创建(Basic literal string creation)
`In JavaScript '\n' is a line-feed.`

// 多行字符串(Multiline strings)
`In JavaScript this is
 not legal.`

// 字符串插值(String interpolation)
var name = "Bob", time = "today";
`Hello ${name}, how are you ${time}?`

// 构造一个GET前缀来解释其中的替换部分和结构(Construct an HTTP request prefix is used to interpret the replacements and construction)
GET`http://foo.org/bar?a=${a}&b=${b}
    Content-Type: application/json
    X-Credentials: ${credentials}
    { "foo": ${foo},
      "bar": ${bar}}`(myOnReadyStateChangeHandler);
```

##### 译者注：我们来详细的揣摩一下这个新的特性究竟能带来什么吧。
```JavaScript
// 基本用法
console.log(`Hello Template Strings!`);
// output: Hello Template  Strings!

// 多行表达
console.log(`Hello
    Template
Strings!`);
/* output:  |Hello
 *          |  Template  
 *          |Strings!
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
var url = "http://php.weather.sina.com.cn/iframe/index/w_cl.php";
var city = "北京";
GET`${ url }?code=js&city=${ city }`(handler)

function GET(strArgs, url, city) {
    // console.log(Array.prototype.slice.call(arguments)); // output:  [[ '', '?code=js&city=', '' ], 'http://php.weather.sina.com.cn/iframe/index/w_cl.php', '北京' ]  
    return function (handler) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `${ url }${ strArgs.join('') }${ city }`, false);
        xhr.onreadystatechange = handler.bind(xhr);
        xhr.send();
    }
}
function handler() {
    if (this.readyState === 4) {
        console.log(this.responseText);
    }
}
/*  output(在浏览其中运行):
 *    (function(){var w=[];w['北京']=[{s1:'晴',s2:'晴',f1:'qing',f2:'qing',t1:'4',t2:'-4',p1:'5-6',p2:'3-4',d1:'北风',d2:'北风'}];var add={now:'2015-03-03 13:06:46',time:'1425359206',update:'北京时间03月03日08:05更新',error:'0',total:'1'};window.SWther={w:w,add:add};})();//0
 */
```

##### 译者注：基本用法也就这样，前缀函数这个特性还真是让人觉得眼前一亮，它的原理也不难猜出，直接对比一下上述代码的ES5版本，很容易的知道这一特性的真面目
```JavaScript
// ES 5
var $__0 = Object.freeze(Object.defineProperties(["", "?code=js&city=", ""], {raw: {value: Object.freeze(["", "?code=js&city=", ""])}}));

console.log("Hello Template Strings!");

console.log("Hello\n\tTemplate\nStrings!");

var who = "Template Strings";
console.log(("Hello " + who + "!"));

function what() {
    return "Template Strings";
}
console.log(("Hello " + what() + "!"));

var which = {value: "Template Strings"};
console.log(("Hello " + which.value + "!"));

var url = "http://php.weather.sina.com.cn/iframe/index/w_cl.php";
var city = "北京";
GET($__0, url, city)(handler);
function GET(strArgs, url, city) {
    return function(handler) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', ("" + url + strArgs.join('') + city), false);
        xhr.onreadystatechange = handler.bind(xhr);
        xhr.send();
    };
}
function handler() {
    if (this.readyState === 4) {
        console.log(this.responseText);
    }
}
```

##### 译者注：\`...\`简单来说被当做\(...\)来翻译了，其余部分一次替换就好了。需要额外说明的是字符串模板的前缀函数接受n个参数，第一个参数为字符串构成数组(如上述例子中的[ '', '?code=js&city=', '' ])，剩余参数依次是被替换的字符变量(如上述例子中的'http://php.weather.sina.com.cn/iframe/index/w_cl.php', '北京')。下面我们提供一种在前缀函数中还原原字符串的方法，方便大家理解其中的对应关系
```JavaScript
// 首先对应的位置关系为：func(strArg, arg1, arg2, arg3...)
// 原字符串 = strArg[0] + arg1 + strArg[1] + arg2 + strArg[2] + arg3 + strArg[3]...
// 即将参数strArg后的arg一次填到strArg的数组间隙中，为原来字符串的对应位置顺序

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
```

##### 译者总结：这个特性着实方便，32个赞。用法简单，功能强大，不太会出其他问题，很容易理解。对于新增的前缀函数也是蛮有意思的，观察它翻译成ES5的代码，我们可以扩展出很多别的写法。

### 解构
解构(Destructuring)允许JS通过数组匹配和对象匹配这两种方式进行模式匹配赋值。解构失败也是安全，这类似于标准的对象属性获取`foo["bar"]`，如果对象中没能找到对应值则产生`undefined`。

```JavaScript
// 列表匹配(list matching)
var [a, , b] = [1,2,3];

// 对象匹配(object matching)
var { op: a, lhs: { op: b }, rhs: c }
       = getASTNode()

// 简化版对象匹配(object matching shorthand)
// binds `op`, `lhs` and `rhs` in scope
var {op, lhs, rhs} = getASTNode()

// 可以在参数对位上发挥作用(Can be used in parameter position)
function g({name: x}) {
  console.log(x);
}
g({name: 5})

// 解构失败(Fail-soft destructuring)
var [a] = [];
a === undefined;

// 带有默认值的失败的解构(Fail-soft destructuring with defaults)
var [a = 1] = [];
a === 1;
```

##### 译者注：借鉴了CoffeeScript的写法，也是一个非常方便的新特性。规则比较容易理解，排除上述那些基本规则，这个新的语法还有一些地方需要人们注意。
```JavaScript
// 解构报错，类似的写法都会导致这个问题
// var [a, b] = undefined;
// var [a, b] = Object.create(null);
// var [a, b] = null;

// 不完全模式匹配
var {toString: a} = [0, 1];
console.log(a === Array.prototype.toString); // true
console.log(toString); // undefined

/*
 * 注意这里的异同
 */
var {toString} = [1, 2];
console.log(toString === Array.prototype.toString); // true

/*
 * 字符串由于本身带有与数组相同的属性(索引、length等)，因此这里会被理解成 var [a, b] = ['1', '2']。
 * 究其根本原因是由于traceur将这类写法的等号右侧使用迭代器(iterators)来匹配相同属性。
 */
var [a, b] = "12";
console.log(a, b); // 1 2

/*
 * 这个特性可以很方便的用来抽取某个对象中的几个的函数，比如`var [eval, log, sqrt] = require('mathjs')`;
 */
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

/*
 * 使用对象模式匹配时若`{}`并未跟在`var`后面，会导致traceur将`{}`理解为代码块而产生语法错误。
 * 注意：`{length} = [2]`和`({length}) = [2]` 这两种写法都会导致解释器将{}误以为是代码块而报错
 */
var length;
[length] = [2];
console.log(length); // 2
({length} = [2]);
console.log(length); // 1
```

##### 译者注：同样我们帖上转义成ES5的代码，方便大家理解起原理
```JavaScript
var $__3,
    $__4,
    $__6,
    $__7,
    $__9,
    $__10,
    $__12,
    $__13,
    $__14,
    $__15,
    $__17,
    $__18,
    $__19,
    $__20;
var a = [0, 1].toString;
console.log(a === Array.prototype.toString);
var toString = [1, 2].toString;
console.log(toString === Array.prototype.toString);
var $__2 = "12",
    a = ($__3 = $__2[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](), ($__4 = $__3.next()).done ? void 0 : $__4.value),
    b = ($__4 = $__3.next()).done ? void 0 : $__4.value;
console.log(a, b);
var $__5 = [function() {
  console.log(this);
}, function() {
  return a;
}],
    a = ($__6 = $__5[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](), ($__7 = $__6.next()).done ? void 0 : $__7.value),
    b = ($__7 = $__6.next()).done ? void 0 : $__7.value;
a();
console.log(a === b());
var func = function() {
  console.log(this);
};
var $__8 = [func, function() {
  return a;
}],
    a = ($__9 = $__8[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](), ($__10 = $__9.next()).done ? void 0 : $__10.value),
    b = ($__10 = $__9.next()).done ? void 0 : $__10.value;
func();
a();
console.log(a === b());
var name = ($__14 = [function funa() {
  console.log(this);
}, function() {
  return fa;
}][$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](), ($__15 = $__14.next()).done ? void 0 : $__15.value).name;
funa();
console.log(name);
var length;
($__17 = [2], length = ($__18 = $__17[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](), ($__19 = $__18.next()).done ? void 0 : $__19.value), $__17);
console.log(length);
(($__20 = [2], length = $__20.length, $__20));
console.log(length);
```

##### 译者总结：解构的ES5转义版本有些让人摸不到头脑，感觉是它构造了一个迭代器遍历访问对应的属性，有就返回没有就返回undefined。

### 默认值+...语法
默认值(Default)可以决定被调函数的默认参数数值。在函数调用过程中将连续的参数放入一个数组中或者将某个参数之后的后续参数放入一个数组中，`...`(Rest + Spreed)就是那个数组(`...`有两种使用属性：Rest和Spread)。`...`(Rest)可以替换原先对于`arguments`的需求，相比`arguments`它更直接的针对通常的使用需求。`...`(Spread)则将一个数组中的数值按顺序直接安插到函数的参数中或者是安插到某一个参数的后续参数中，就好比`...`(Rest)逆过程。

```JavaScript
function f(x, y=12) {
  // y is 12 if not passed (or passed as undefined)
  return x + y;
}
f(3) == 15
```
```JavaScript
function f(x, ...y) {
  // y is an Array
  return x * y.length;
}
f(3, "hello", true) == 6
```
```JavaScript
function f(x, y, z) {
  return x + y + z;
}
// Pass each elem of array as argument
f(...[1,2,3]) == 6
```

##### 译者注：这个语法特性针对的是函数的实参，其实我们可以将这三种特性总结为ES6中的实参用法。这三种特性可以让我们在对于函数参数的处理上省去一部分代码和时间。大家也很容易就能猜到究竟省去的是哪一部分代码。
```JavaScript
function f(x) {
    var y = arguments[1] !== (void 0) ? arguments[1] : 12;
    return x + y;
}
f(3);

function f(x) {
    for (var y = [],$__0 = 1; $__0 < arguments.length; $__0++)
        y[$traceurRuntime.toProperty($__0 - 1)] = arguments[$traceurRuntime.toProperty($__0)];
    return x * y.length;
}
f(3, "hello", true);

function f(x, y, z) {
    return x + y + z;
}
f.apply((void 0), $traceurRuntime.spread([1, 2, 3])); // 这个spread函数会返回一个参数数组(类似Array.prototype.slice.call(arguments))，不过其内部是由迭代器(详见[迭代器和for..of](#迭代器和for..of))实现，遍历arguments并将其内容放入数组中
```

##### 译者注：关于这个属性的实现使用中了`apply`不免让人担心`this`是否能保持原有不变，事实上这个不必担心，traceur在实现这个的过程中会标记当前上下文的变化copy一份供`apply`使用。
```JavaScript
// ES 6
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
console.log(v1.equal(...[0, 0])); // true

// ES 5
var $__3;
var Vector = function Vector() {
    "use strict";
    var x = arguments[0] !== (void 0) ? arguments[0] : 0;
    var y = arguments[1] !== (void 0) ? arguments[1] : 0;
    this.x = x;
    this.y = y;
};
($traceurRuntime.createClass)(Vector, {equal: function() {
    "use strict";
    for (var v = [], $__2 = 0; $__2 < arguments.length; $__2++)
        v[$traceurRuntime.toProperty($__2)] = arguments[$traceurRuntime.toProperty($__2)];
    var x = v[0],
        y = v[1];
    return (!!('' + x) && !!('' + y)) ? this.x === x && this.y === y : false;
  }}, {});
var v1 = new Vector();
console.log(($__3 = v1).equal.apply($__3, $traceurRuntime.spread([0, 0])));
```

##### 译者总结：原版中将这个属性归为三类(Default, Rest, Spread)。但其本质相当于对`arguments`的二次封装，为了方便编码时形参和实参的处理，使用上并未发现有坑，不过在翻译上期待完美的汉译方案。

### Let和Const
`let`和`const`是针对块级作用域绑定的。`let`与`var`一样，只不过`let`声明的变量只在`let`所在的代码块内有效。`const`是单一赋值，经过一次赋值的变量将无法再次被赋值或修改。变量在赋值前不可用(这段话需要一些特殊的理解详见译者注)。

```JavaScript
function f() {
  {
    let x;
    {
      // okay, block scoped name
      const x = "sneaky";
      // error, const
      x = "foo";
    }
    // error, already declared in block
    let x = "inner";
  }
}
```

##### 译者注：参照`let`的[规范定义](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-let-and-const-declarations)，使用`let`和`const`声明的变量在没有呗赋值德清况下无法被访问，但是已经被创建，这意味着`let`以及`const`在本质上具备JS变量提前的特质，但是`let`并没有明显的表现出来。
```JavaScript
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
  console.log(m, n); // ReferenceError: m, n is not defined

  function func2() {
    console.log(m);
    console.log(n);
  }
  func2(); // ReferenceError: m, n is not defined
})();
```

##### 译者注：这里还有几个简单例子可以展示`let`的这个特别之处。
```JavaScript
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
  console.log(v); // ReferenceError，若v未提前则此处应该会打印Hello
  let v = "World";
  console.log(v); // output: World
})();
console.log(v); // output: Hello
```

##### 译者注：不过使用traceur来运行上述代码就会产生不一致性，毕竟traceur是在用ES5来解释ES6，毕竟ES5还无法实现`let`和`const`这种变量实质被提前但是在赋值出现前不可访问的性质，因此这种差异，大家了解就好。
```JavaScript
// ES 6
(function(){
  {
    console.log(m); // undefined
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
  console.log(m, n); // ReferenceError: m, n is not defined

  function func2() {
    console.log(m, n);
  }
  func2(); // ReferenceError: m, n is not defined
})();

// ES 5
(function() {
  {
    console.log(m);
    var m = "m";
  }
  {
    var func1$__1 = function() {
      console.log(m$__0);
      console.log(n);
      m$__0 = n + 1;
      console.log(m$__0);
      console.log(n);
    };
    var m$__0;
    var n = 0;
    func1$__1();
  }
  function func2() {
    console.log(m, n);
  }
  func2();
})();
```

##### 译者注：`let`可以避免内存泄露以及变量污染，它的很常见的用法就是在`for`循环中使用。
```JavaScript
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
```

##### 译者注：`let`还可以用作表达式写法，`let (var1 [= value1] [, var2 [= value2]] [, ..., varN [= valueN]]) [statement | expression]`;
```JavaScript
var a = 5;
let(a = 6) console.log(a); // 6
console.log(a); // 5

var x = 5;
var y = 0;
let (x = x+10, y = 12) {
  console.log(x+y); // 27
}
console.log(x + y); // 5
```

##### 译者注：在文档中`const`与`let`机制相似，也是作用在块内，同样会变量提前，但在未赋值前不可被访问。你无从知道`const`究竟有没有提前变量，因为你必须给一个`const`变量赋初始值，否则会语法报错。作用上`const`则是防止变量被修改的，与其他语言中的`const`一样。
```JavaScript
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

// const保护的其实是引用，而非真实的值
const Math = {PI: PI};
console.log(Math); // {PI: 3}
Math.PI = 3.14;
console.log(Math); // {PI: 3.14}
Math.PI2 = 2 * Math.PI;
console.log(Math); // {PI: 3.14, PI2: 6.28}
```

##### 译者总结：`let`声明的变量会发生变量提前，但只不过在未发生赋值行为前无法被访问，因此会造成`let`作用于其后代码的假象；`const`(文档描述中也有变量提前，实际无法验证)在声明时必须出现对应赋值行为，并且`const`是引用保护而非值保护，因此数组和对象内部的成员变量或者值无法得到保护。

### 迭代器和For..Of
迭代器对象(Iterator)为ECMAScript提供了通用的迭代器，就像***CLR IEnumerable***还有Java中的***Iterable***。如果想像`for..in`那样遍历迭代器，可以使用`for..of`。并不需要使用任何数组，实现了一个懒人版设计模式，就像***LINQ***一样。

```JavaScript
let fibonacci = {
  [Symbol.iterator]() {
    let pre = 0, cur = 1;
    return {
      next() {
        [pre, cur] = [cur, pre + cur];
        return { done: false, value: cur }
      }
    }
  }
}

for (var n of fibonacci) {
  // truncate the sequence at 1000
  if (n > 1000)
    break;
  console.log(n);
}
```

迭代的设计是基于鸭子类型(duck-type)的接口(下面是使用[TypeScript](http://typescriptlang.org)的语法对此接口的描述)：
```TypeScript
interface IteratorResult {
  done: boolean;
  value: any;
}
interface Iterator {
  next(): IteratorResult;
}
interface Iterable {
  [Symbol.iterator](): Iterator
}
```

##### 译者注：`Iterator`对于ECMAScript来说是个新的数据结构，数据结构需要规范的接口描述和定义以方便原有对象(Array,Object)和新增对象的使用。上述接口描述是[规范](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-iteration)对于`Iterator`接口的定义(规范中`@@iterator`函数的名字由`Symbol.iterator`表示)，由于其鸭子类型的设计，任何具备该接口描述的对象或变量均可使用`for..of`来遍历。
```JavaScript
{
  let Iterator = function(val) {
    let proto = Object.create(null);
    proto[Symbol.iterator] = {
      enumerable: true,
        configurable: true,
      value: function() {
        var cur = this;
        return {
          next: function() {
            if (!!cur) {
              let value = cur.value;
              cur = cur.next;
              return {
                value: value,
                done: false
              }
            }else {
              return {
                done: true
              }
            }
          }
        }
      }
    };
    let __proto__ = Object.create({}, proto);
    return Object.create(__proto__, {
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
    });
  }

  var a = Iterator(0), b = Iterator(1), c = Iterator(2);
  a.next = b;
  b.next = c ;
  c.next = null;

  for (var i of a) {
    console.log(i)
  }
  // output: 0 1 2
}
{
  var Iterator = function(val){
    this.val = val;
    this.next = null;
  }
  Iterator.prototype[Symbol.iterator] = function(){
    let cur = this;
    return {
      next: function(){
        if (!!cur) {
          let value = cur.val;
          cur = cur.next;
          return {
            value: value,
            done: false
          }
        }else {
          return {
            done: true
          }
        }
      }
    }
  }
  let a = new Iterator(0), b = new Iterator(1), c = new Iterator(2);
  a.next = b;
  b.next = c ;
  c.next = null;

  for (var i of a) {
    console.log(i)
  }
  // output: 0 1 2
}
```

##### 译者注：规范定义的ES6中原生支持`Iterator`的有`String`，`Array`，`Map`和`Set`(详见[map + set + weakmap + weakset](#map--set--weakmap--weakset))这四种数据结构。
```JavaScript
let arr = [0, 1, 2, 3, 4, 5, 6, 7];
for (let i of arr) {
  console.log(i);
}
// output: 0 1 2 3 4 5 6 7

let str = "01234567";
for (let i of str) {
  console.log(i);
}
// output: 0 1 2 3 4 5 6 7

let set = new Set([0, 1, 2, 3, 4, 5, 6, 7]);
for (let i of set) {
  console.log(i);
}
// output: 0 1 2 3 4 5 6 7

let map = new Map([[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]]);
for (let i of map.values()) {
  console.log(i);
}
// output: 0 1 2 3 4 5 6 7
for (let i of map.keys()) {
  console.log(i);
}
// output: 0 1 2 3 4 5 6 7
```

##### 译者注：具备`Iterator`接口描述的任何对象都可通过修改`[@@iterator]`方法来改变迭代方式。
```JavaScript
{
  // 下面是按照斐波纳挈数列迭代的实现
  let arr = [0, 1, 2, 3, 4, 5, 6, 7];
  arr[Symbol.iterator] = function() {
    let self = this;
    let index = 0;
    let pre = 0,
      value = 0;
    return {
      next: function() {
        let done = index === self.length;
        if (!done) {
          let tmp = self[index++];
          value = pre + tmp;
          pre = value;
          return {
            value: value,
            done: done
          }
        } else {
          return {
            done: done
          }
        }
      }
    }
  }
  for (let i of arr) {
    console.log(i)
  }
  // output: 0 1 3 6 10 15 21 28
}
{
  // 或者这里还可以修改Array本身迭代器的@@iterator，这个修改是针对所有Array对象
  Array.prototype[Symbol.iterator] = function() {
    let self = this;
    let index = 0;
    let pre = 0,
      value = 0;
    return {
      next: function() {
        let done = index === self.length;
        if (!done) {
          let tmp = self[index++];
          value = pre + tmp;
          pre = value;
          return {
            value: value,
            done: done
          }
        } else {
          return {
            done: done
          }
        }
      }
    }
  }
  let arr = [0, 1, 2, 3, 4, 5, 6, 7];
  for (let i of arr) {
    console.log(i)
  }
  // output: 0 1 3 6 10 15 21 28
}
```

##### 译者注：`for..of`每次遍历的是`Iterator`对象的`next()`方法，因此在重写`[@@iterator]`时要注意自己的判断以及浮标的处理一定要放在`next()`中。
```JavaScript
{
  // 这个例子永远也无法遍历完毕，他会一直输出，因为index永远都是1
  let arr = [0, 1, 2, 3, 4, 5, 6, 7];
  arr[Symbol.iterator] = function() {
    let self = this;
    let index = 0;
    index++;
    console.log('im hear'); // 这里只打印一次
    return {
      next: function() {
        console.log('im thear'); // 这里打印n次
        return {
          done: index === self.length ? true : false,
          value: self[index-1]
        }
      }
    }
  }
  for (let i of arr) {
    console.log(i)
  }
}
{
  // 这个例子可以正常工作
  let arr = [0, 1, 2, 3, 4, 5, 6, 7];
  arr[Symbol.iterator] = function() {
    let self = this;
    let index = 0;
    return {
      next: function() {
        return {
          done: index === self.length ? true : false,
          value: self[index++]
        }
      }
    }
  }
  for (let i of arr) {
    console.log(i)
  }
}
```

##### 译者总结：具体特性已经说明，唯一令人比较感兴趣的就是***traceur***是如何处理这部分的翻译的，这部分几句话并不能讲清楚，我会另开地址分析***traceur***中比较有趣的转义实现。

### 生成器
生成器(Generator)使用`function*`和`yield`来简化迭代器的使用。一个使用`function*`方式声明的函数会返回一个生成器的实例。生成器是包含有`next`和`throw`这两种新增属性的迭代器的子类型。这些特性使得变量可以在生成器内形成回流，`yield`就是用来return一个数值(或者throw)的表达式。

提示：也可以期待***await***-就像异步编程，可以查看ES7中的`await`议案。

```JavaScript
var fibonacci = {
  [Symbol.iterator]: function*() {
    var pre = 0, cur = 1;
    for (;;) {
      var temp = pre;
      pre = cur;
      cur += temp;
      yield cur;
    }
  }
}

for (var n of fibonacci) {
  // truncate the sequence at 1000
  if (n > 1000)
    break;
  console.log(n);
}
// output: 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987
```

生成器的接口描述(使用[TypeScript](http://typescriptlang.org)语法表述)：
```TypeScript
interface Generator extends Iterator {
    next(value?: any): IteratorResult;
    throw(exception: any);
}
```

##### 译者注：`function*`本身是Generator的构造函数，它可以返回一个Gernator实例，Generator则是Iterator的子类，因此Gennerator本身也具备迭代器属性也具备@@iterator，因此我们可以简单的理解为`function*`所返回的Generator实例的[@@iterator]方法就是`function*`本身，这个论证可以参见下方例子。如何理解生成器，可以参见规范中给出Generator-Iterator-Function之间的类图
![](http://people.mozilla.org/~jorendorff/figure-2.png)
```JavaScript
function*(){};
let a = f(); // 或a = new f();
console.log(a[Symbol.iterator]() === a); // true
```

##### 译者注：在使用上，可以把生成器(Generator)可以当做是迭代器(Iterator)的另一种简化方式。
```JavaScript
let arr = [0, 1, 2, 3, 4, 5, 6, 7];
Array.prototype[Symbol.iterator] = function*() {
  let index = 0, len = this.length;
  while(index < len){
    yield this[index++];
  }
}
for (let i of arr) {
  console.log(i)
}
// output: 0 1 2 3 4 5 6 7
```

##### 译者注：由于`function*`本身返回一个继承自iterator的对象，你还可以通过不断的使用`next()`来遍历。
```JavaScript
let arr = [0, 1, 2, 3, 4, 5, 6, 7];
function* f(){
  let index = 0, len = this.length;
  while(index < len){
    yield this[index++];
  }
}
let iterator = f.call(arr);
while(1){
  let i = iterator.next();
  if (i.done) {
    break;
  }
  console.log(i.value);
}
// output: 0 1 2 3 4 5 6 7
```

##### 译者注：生成器中的`next()`还可以接受传参。`next()`所接受的参数会体现在上一次`yield`的返回值上，因此对第一次`next()`传参不会造成任何影响。
```JavaScript
{
  function* f(num){
    while(!(yield num));
  }
  let g = f(1);
  console.log(g.next());  // { value: 1, done: false }
  console.log(g.next()); // { value: 1, done: false }
  console.log(g.next(true)); // { value: undefined, done: true }
}
{
  function* addition(num){
    let r = num;
    while(1) {
      r += yield r;
    }
  }
  let g = addition(1);
  console.log(g.next(1).value); // output: 1
  console.log(g.next(2).value); // output: 3  (1+2)
  console.log(g.next(3).value); // output: 6  (3+3)
  console.log(g.next(4).value); // output: 10  (6+4)
}
```

##### 译者注：如果生成器内部的`yield`发生了异常，则不会继续触发执行后续的`yield`。生成器内的异常即可以在生成器外抛出异常，还可以在生成器体内捕获外部异常。
```JavaScript
{
  function* g(){
    yield 1;
    yield a;
    yield b;
  }
  function check(g) {
    let a;
    try {
      a = g.next();
      a = g.next();
      a = g.next();
    }catch(e){
      console.log(e);
    }
  }
  check(g());
  /* output: [ReferenceError: a is not defined]
   *  由于yield会顺序执行，因此异常也是由上而下抛出，当一个yield分支发生异常，则状态机停留在当前状态，
   *  后续得到next并不会继续触发继续执行后续的yield
   */
}
{
  function* ErrorHandler(){
    try {
      yield v;
    }catch(e) {
      console.log('inside: ', e);
      if(e !== 'error') throw e;
    }
  }
  let eh = ErrorHandler();
  try {
    eh.next();
    eh.throw('error'); // 通过使用throw方法让生成器体内捕获异常
  }catch(e) {
    console.log('outside: ', e);
  }
  /* output: inside:  [ReferenceError: v is not defined]
   *         outside:  error
   */
}
```

##### 译者注：生成器还有另一个很实用的特性，可以利用其`yield`的顺序执行和异常阻断的能力来处理异步毁掉陷阱，即使用生成器进行异步流程控制。
```JavaScript
// 这是一个常见的嵌套回调
function a (callback, time){
  setTimeout(function(){
    console.log('im function a');
    callback()
  }, time);
}
function b (callback, time){
  setTimeout(function(){
    console.log('im function b');
    callback()
  }, time);
}
function c (callback, time){
  setTimeout(function(){
    console.log('im function c');
    callback()
  }, time);
}
a(function(){
  b(function(){
    c(function(){
      console.log('ok finished');
    }, 500);
  }, 1000)
}, 500);

// 下面我们使用Generator实现一个类似async的函数来解决异步回调
let g;
function tc(err, result) {
  if (err) throw err;
  g.next(result);
}

function* AsyncGernerator(funcs, callback){
  let v = yield funcs[0](tc);
  for(let i = 1, l = funcs.length;i < l;i++) {
    try {
      v = yield funcs[i](v, tc);
    }catch(e) {
      callback(e, v);
    }
  }
  yield callback(null, v);
}

function async(funcs, callback) {
  g = AsyncGernerator(funcs, callback);
  g.next();
}

async([
  function (callback){ // a
    setTimeout(function(){
      console.log('im function a');
      callback(null, 1000)
    }, 500);
  }
, function (result, callback){ // b
    setTimeout(function(){
      console.log('im function b');
      callback(null, 500)
    }, result);
  }
, function (result, callback){ // c
    setTimeout(function(){
      console.log('im function c');
      callback(null, 'ok finished')
    }, result);
  }
], function(err, result) {
  if(err) console.log(err);
  console.log(result);
});
```

##### 译者注：`yield`还可以返回迭代器(Iterator)，不过需要在***yield***后面加上一个*(`yield*`)，以表示其后是一个迭代器。
```JavaScript
let arr = [1, 2, [3, [4, [5], 6], [7]], [8, 9], 10];
function* printAllGenerator() {
  let l = this.length, i = 0;
  while(i < l) {
    v = this[i++];
    if (Object.prototype.toString.call(v) === '[object Array]') {
      yield* printAllGenerator.call(v);
    }else {
      yield v;      
    }
  }
}
let printAll = printAllGenerator.call(arr);
let v = {};
while(1) {
  v = printAll.next();
  if (v.done) break;
  console.log(v.value);
}
// output: 1 2 3 4 5 6 7 8 9 10
```

##### 译者注：译者认为生成器(Generator)和迭代器(Iterator)是ECMAScript 6新增语法中最为灵活和实用的新特性了，很多更犀利的写法还有待进一步发觉。

### Unicode
ECMAScript 6中还新增了对Unicode字符集更强大的支持。这些新特性包含下面两点：正则对象中新增了`u`模式用来处理码点大于`0xFFFF`的字符；字符串中也增加了对码点大于`0xFFFF`的处理，包括码点大于`0xFFFF`的字符不会再被当做两个字符和`\u{}`的表示方式。这些新特性有助于我们使用JavaScript进行全平台开发。

```JavaScript
// same as ES5.1
"𠮷".length == 2

// new RegExp behaviour, opt-in ‘u’
"𠮷".match(/./u)[0].length == 2

// new form
"\u{20BB7}"=="𠮷"=="\uD842\uDFB7"

// new String ops
"𠮷".codePointAt(0) == 0x20BB7

// for-of iterates code points
for(var c of "𠮷") {
  console.log(c);
}
```

##### 译者注：这里是少有的目前对ECMAScript的支持比较有差异的，在node(0.11.*和0.12.0)环境下测试还不支持正则中的`u`模式，对于四位不能表示全的字符还是会认为它的长度是2，因此这里不做过多介绍了。
```JavaScript
{
  // node 0.12.0
  console.log("𠮷".length); // 2

  console.log("𠮷".match(/./u)[0].length); // 报错不支持正则u模式

  console.log("\u{20BB7}"); // 报错不支持\u{}
  console.log("\uD842\uDFB7"); //

  console.log("𠮷".codePointAt(0)); // 134071
  console.log("𠮷".codePointAt(1)); // 57271

  for(var c of "𠮷") {
    console.log(c);
  }
  // 𠮷
}
```

##### 译者总结：目前的规范中是明确说明[ECMAScript 6使用UTF-16](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-source-text)，并且[支持`\u{}`](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-literals-string-literals)来直接表示占位大于四位的字符，期待正式定稿后的结果。不过[Mozilla说明自己不会实现的ES6特性包含了\u{}和正则u模式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_6_support_in_Mozilla)

### 模块
ECMAScript 6在语法层面上提供了对模块组件定义的支持。模式的设计参考非常受开发者喜爱的JavaScript模块加载器(AMD, CommonJS)，运行时的环境由一个主机定义的默认加载器决定。隐式异步模式 —— 只有引用模块可用并且加载完成时代码才会被执行。

```JavaScript
// lib/math.js
export function sum(x, y) {
  return x + y;
}
export var pi = 3.141593;
```
```JavaScript
// app.js
import * as math from "lib/math";
alert("2π = " + math.sum(math.pi, math.pi));
```
```JavaScript
// otherApp.js
import {sum, pi} from "lib/math";
alert("2π = " + sum(pi, pi));
```

一些额外的新特性还有有`export default`和`export *`:

```JavaScript
// lib/mathplusplus.js
export * from "lib/math";
export var e = 2.71828182846;
export default function(x) {
    return Math.exp(x);
}
```
```JavaScript
// app.js
import exp, {pi, e} from "lib/mathplusplus";
alert("2π = " + exp(pi, e));
```

##### 译者注：这个特性虽然感觉很好，traceur未翻译实现这部分的转义，浏览器方面[firefox已经声明这个特性他们尚不支持](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_6_support_in_Mozilla)，safari也不支持。这样这个特性也就仅仅是个规范而已，我们还是要使用我们所熟悉的类似**requirejs**的库来实现我们的模块化编程。

### 模块加载器
模块加载器支持以下特性：
- 动态加载
- 状态隔离
- 全局命名空间隔离
- 编译钩子
- 多重嵌套虚拟化(循环调用了文件的处理)

模块加载器默认可以配置，新的加载器可以被构建成通过动态或者受限上下文两种方式来执行和加载代码。

```JavaScript
// Dynamic loading – ‘System’ is default loader
System.import('lib/math').then(function(m) {
  alert("2π = " + m.sum(m.pi, m.pi));
});

// Create execution sandboxes – new Loaders
var loader = new Loader({
  global: fixup(window) // replace ‘console.log’
});
loader.eval("console.log('hello world!');");

// Directly manipulate module cache
System.get('jquery');
System.set('jquery', Module({$: $})); // WARNING: not yet finalized
```

### Map + Set + WeakMap + WeakSet
这是常见算法中的几种有效率的数据结构。`WeakMap`实现了无泄露的的对象建端的表结构。

```JavaScript
// Sets
var s = new Set();
s.add("hello").add("goodbye").add("hello");
s.size === 2;
s.has("hello") === true;

// Maps
var m = new Map();
m.set("hello", 42);
m.set(s, 34);
m.get(s) == 34;

// Weak Maps
var wm = new WeakMap();
wm.set(s, { extra: 42 });
wm.size === undefined

// Weak Sets
var ws = new WeakSet();
ws.add({ data: 42 });
// Because the added object has no other references, it will not be held in the set
```

##### 译者注：`WeakMap`是专门为了解决`Map`在使用对象作为key值时导致对象的引用增加的问题，因此在使用对象作为key值时，建议使用`WeakMap`。也因此`WeakMap`并不支持使用非对象作为key值。`WeakSet`与`WeakMap`类似。

### Proxies
`Proxies`能够为新对象提供基于原始对象的全方位方法代理。这个特性可以用于拦截，对象虚拟化，日志/分析等。

```JavaScript
// Proxying a normal object
var target = {};
var handler = {
  get: function (receiver, name) {
    return `Hello, ${name}!`;
  }
};

var p = new Proxy(target, handler);
p.world === 'Hello, world!';
```

```JavaScript
// Proxying a function object
var target = function () { return 'I am the target'; };
var handler = {
  apply: function (receiver, ...args) {
    return 'I am the proxy';
  }
};

var p = new Proxy(target, handler);
p() === 'I am the proxy';
```

下面是所有可以被代理的运行级别的原操作。

```JavaScript
var handler =
{
  get:...,
  set:...,
  has:...,
  deleteProperty:...,
  apply:...,
  construct:...,
  getOwnPropertyDescriptor:...,
  defineProperty:...,
  getPrototypeOf:...,
  setPrototypeOf:...,
  enumerate:...,
  ownKeys:...,
  preventExtensions:...,
  isExtensible:...
}
```

### Symbols
`Symbols`可以控制对象的状态。它允许对象属性的key值可以是`string`或者`symbol`。`Symbol`是新增的原始类型。可选参数`description`。`Symbol`是唯一的，但并不能私有，因为他可以通过使用`Object.getOwnPropertySymbols`这类方法暴露出来。

```JavaScript
var MyClass = (function() {

  // module scoped symbol
  var key = Symbol("key");

  function MyClass(privateData) {
    this[key] = privateData;
  }

  MyClass.prototype = {
    doStuff: function() {
      ... this[key] ...
    }
  };

  return MyClass;
})();

var c = new MyClass("hello")
c["key"] === undefined
```

### 子类化内建插件
ES6诸如`Array`，`Date`和`DOM Element`都可以原生实现子类化功能。

对象通过两种方式来构造`Ctor`函数：
- 调用`Ctor[@@create]`来分配对象，实现其他行为
- 唤醒新的实例上的构造函数来完成初始化

通过`Symbol.create`可以使用`@@create`这个内建信号变量。`@@create`现在能够被内建插件暴露。

```JavaScript
// Pseudo-code of Array
class Array {
    constructor(...args) { /* ... */ }
    static [Symbol.create]() {
        // Install special [[DefineOwnProperty]]
        // to magically update 'length'
    }
}

// User code of Array subclass
class MyArray extends Array {
    constructor(...args) { super(...args); }
}

// Two-phase 'new':
// 1) Call @@create to allocate object
// 2) Invoke constructor on new instance
var arr = new MyArray();
arr[1] = 12;
arr.length == 2
```

### Math + Number + String + Object APIs
Many new library additions, including core Math libraries, Array conversion helpers, and Object.assign for copying.

```JavaScript
Number.EPSILON
Number.isInteger(Infinity) // false
Number.isNaN("NaN") // false

Math.acosh(3) // 1.762747174039086
Math.hypot(3, 4) // 5
Math.imul(Math.pow(2, 32) - 1, Math.pow(2, 32) - 2) // 2

"abcde".includes("cd") // true
"abc".repeat(3) // "abcabcabc"

Array.from(document.querySelectorAll('*')) // Returns a real Array
Array.of(1, 2, 3) // Similar to new Array(...), but without special one-arg behavior
[0, 0, 0].fill(7, 1) // [0,7,7]
[1,2,3].findIndex(x => x == 2) // 1
["a", "b", "c"].entries() // iterator [0, "a"], [1,"b"], [2,"c"]
["a", "b", "c"].keys() // iterator 0, 1, 2
["a", "b", "c"].values() // iterator "a", "b", "c"

Object.assign(Point, { origin: new Point(0,0) })
```

### Binary and Octal Literals
Two new numeric literal forms are added for binary (`b`) and octal (`o`).

```JavaScript
0b111110111 === 503 // true
0o767 === 503 // true
```

### Promises
Promises are a library for asynchronous programming.  Promises are a first class representation of a value that may be made available in the future.  Promises are used in many existing JavaScript libraries.

```JavaScript
function timeout(duration = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    })
}

var p = timeout(1000).then(() => {
    return timeout(2000);
}).then(() => {
    throw new Error("hmm");
}).catch(err => {
    return Promise.all([timeout(100), timeout(200)]);
})
```

### Reflect API
Full reflection API exposing the runtime-level meta-operations on objects.  This is effectively the inverse of the Proxy API, and allows making calls corresponding to the same meta-operations as the proxy traps.  Especially useful for implementing proxies.

```JavaScript
// No sample yet
```

### Tail Calls
Calls in tail-position are guaranteed to not grow the stack unboundedly.  Makes recursive algorithms safe in the face of unbounded inputs.

```JavaScript
function factorial(n, acc = 1) {
    'use strict';
    if (n <= 1) return acc;
    return factorial(n - 1, n * acc);
}

// Stack overflow in most implementations today,
// but safe on arbitrary inputs in ES6
factorial(100000)
```
