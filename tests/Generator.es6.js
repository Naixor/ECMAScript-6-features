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
// {
//   let arr = [0, 1, 2, 3, 4, 5, 6, 7];
//   Array.prototype[Symbol.iterator] = function*() {
//     let index = 0, len = this.length;
//     while(index < len){
//       yield this[index++];
//     }
//   }
//   for (let i of arr) {
//     console.log(i)
//   }
// }
// {
//   // 由于function*本身返回一个iterator对象
//   let arr = [0, 1, 2, 3, 4, 5, 6, 7];
//   function* f(){
//     let index = 0, len = this.length;
//     while(index < len){
//       yield this[index++];
//     }
//     throw true;
//   }
//   let iterator = f.call(arr);
//   while(1){
//     try {
//       console.log(iterator.next());    
//     }catch(e){
//       console.log(e);
//       break;
//     }
//   }
// }