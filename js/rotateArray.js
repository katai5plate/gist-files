Array.prototype.rotate = function(n) {
  const mod = (a, b) => (a % b + b) % b;
  return this.map((_, i, a) => a[mod(n + i, this.length)]);
}
