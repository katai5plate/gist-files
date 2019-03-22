Array.prototype.rotate = function(n) {
  if(n === 0 || typeof n !== "number") return this;
  if(n > 0) return this.map((_,i,a) => a[(i+n) % a.length]);
  return this.reverse().map((_,i,a) => a[(i-n) % a.length]).reverse();
}
