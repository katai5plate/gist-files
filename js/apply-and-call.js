var f = function(){
  this.res = Object.values(arguments)
                   .reduce((p, c) => p + c, 0)
  return this;
}

var x = {};
f.apply(x, [1,2,3,4,5]);
console.log(x); // <- {res: 15}

f.call(x, 1,2,3,4,5);
console.log(x); // <- {res: 15}

f.call(x, ...[1,2,3,4,5]);
console.log(x); // <- {res: 15}
