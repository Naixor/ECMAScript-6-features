var sum1 = (a) => (a !== 1) ? (sum1(a-1)+a) : 1;
console.log(sum1(5));

console.log($traceurRuntime.call.toString()) 