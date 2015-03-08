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
- [默认值 + `...`语法](#默认值 + `...`语法)
- [let + const](#let--const)
- [iterators + for..of](#iterators--forof)
- [generators](#generators)
- [unicode](#unicode)
- [modules](#modules)
- [module loaders](#module-loaders)
- [map + set + weakmap + weakset](#map--set--weakmap--weakset)
- [proxies](#proxies)
- [symbols](#symbols)
- [subclassable built-ins](#subclassable-built-ins)
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

### 默认值 + `...`语法
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
f.apply((void 0), $traceurRuntime.spread([1, 2, 3])); // 这个spread函数会返回一个参数数组(类似Array.prototype.slice.call(arguments))，不过其内部是由迭代器实现，遍历arguments并将其内容放入数组中
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

##### 译者总结：原版中将这个属性归为三类(Default, Rest, Spread)。但其本质均为对`arguments`的二次封装，为了方便编码时形参和实参的处理，使用上并未发现有坑，不过在翻译上期待完美的汉译方案。

### Let + Const
Block-scoped binding constructs.  `let` is the new `var`.  `const` is single-assignment.  Static restrictions prevent use before assignment.


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

### Iterators + For..Of
Iterator objects enable custom iteration like CLR IEnumerable or Java Iterable.  Generalize `for..in` to custom iterator-based iteration with `for..of`.  Don’t require realizing an array, enabling lazy design patterns like LINQ.

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

Iteration is based on these duck-typed interfaces (using [TypeScript](http://typescriptlang.org) type syntax for exposition only):
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

### Generators
Generators simplify iterator-authoring using `function*` and `yield`.  A function declared as function* returns a Generator instance.  Generators are subtypes of iterators which include additional  `next` and `throw`.  These enable values to flow back into the generator, so `yield` is an expression form which returns a value (or throws).

Note: Can also be used to enable ‘await’-like async programming, see also ES7 `await` proposal.

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
```

The generator interface is (using [TypeScript](http://typescriptlang.org) type syntax for exposition only):

```TypeScript
interface Generator extends Iterator {
    next(value?: any): IteratorResult;
    throw(exception: any);
}
```

### Unicode
Non-breaking additions to support full Unicode, including new Unicode literal form in strings and new RegExp `u` mode to handle code points, as well as new APIs to process strings at the 21bit code points level.  These additions support building global apps in JavaScript.

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

### Modules
Language-level support for modules for component definition.  Codifies patterns from popular JavaScript module loaders (AMD, CommonJS). Runtime behaviour defined by a host-defined default loader.  Implicitly async model – no code executes until requested modules are available and processed.

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

Some additional features include `export default` and `export *`:

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

### Module Loaders
Module loaders support:
- Dynamic loading
- State isolation
- Global namespace isolation
- Compilation hooks
- Nested virtualization

The default module loader can be configured, and new loaders can be constructed to evaluate and load code in isolated or constrained contexts.

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
Efficient data structures for common algorithms.  WeakMaps provides leak-free object-key’d side tables.

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

### Proxies
Proxies enable creation of objects with the full range of behaviors available to host objects.  Can be used for interception, object virtualization, logging/profiling, etc.

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

There are traps available for all of the runtime-level meta-operations:

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
Symbols enable access control for object state.  Symbols allow properties to be keyed by either `string` (as in ES5) or `symbol`.  Symbols are a new primitive type. Optional `name` parameter used in debugging - but is not part of identity.  Symbols are unique (like gensym), but not private since they are exposed via reflection features like `Object.getOwnPropertySymbols`.


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

### Subclassable Built-ins
In ES6, built-ins like `Array`, `Date` and DOM `Element`s can be subclassed.

Object construction for a function named `Ctor` now uses two-phases (both virtually dispatched):
- Call `Ctor[@@create]` to allocate the object, installing any special behavior
- Invoke constructor on new instance to initialize

The known `@@create` symbol is available via `Symbol.create`.  Built-ins now expose their `@@create` explicitly.

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
