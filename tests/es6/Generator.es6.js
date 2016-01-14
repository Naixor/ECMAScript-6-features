{
  function*(){};
  let a = f(); // 或a = new f();
  console.log(a[Symbol.iterator]() === a);
}
{
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
}
{
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
}
{
  // 由于function*本身返回一个iterator对象
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
}
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
  console.log(g.next(2).value); // output: 1
  console.log(g.next(2).value); // output: 3  (1+2)
  console.log(g.next(3).value); // output: 6  (3+3)
  console.log(g.next(4).value); // output: 10  (6+4)
}
{
  function* ErrorHandler(){
    try {
      yield v;
    }catch(e) {
      console.log('inside: ', e);
      if(e === 'error') throw e;
    }
  }
  let eh = ErrorHandler();
  try {
    eh.next();
    eh.throw('error');
  }catch(e) {
    console.log('outside: ', e);
  }
}
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
}
{
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
}
{  
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
}
{
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
}