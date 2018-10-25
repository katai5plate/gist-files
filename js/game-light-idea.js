let simu = {};

simu._blank = 0;

simu._vec = { x: 0, y: -1 };

simu._tileData = [
  "",
  "0,0>1,0>1,1>0,1",
  "0,1>1,0>1,1",
  "0,0>1,1>0,1",
  "0,0>1,1>1,0",
  "0,0>1,1>0,1",
  "0,0>0,.5>.25,1>.75,1>1,.5>1,0"
].map(w =>
  w.split(">").map(v => {
    const vv = v.split(",");
    return v !== "" ? { x: Number(vv[0]), y: Number(vv[1]) } : null;
  })
);

simu._tiles = [
  [2, 1, 3],
  [1, 1, 1],
  [1, 1, 1],
  [4, 1, 5],
  [0, 6, 0]
];
simu._cols = [
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [0, 1, 0]
];
simu._walls = [
  [1, 0, 0],
  [0, 0, 0],
  [0, 0, 1],
  [0, 0, 0],
  [0, 0, 0]
];

simu.light = simu._tiles.map(y => [...y.map(x => ({ shape: simu._tileData[x] }))])

simu._cols.forEach((v, y) =>
  v.forEach((w, x) => (simu.light[y][x].col = w))
)
simu._walls.forEach((v, y) =>
  v.forEach((w, x) => (simu.light[y][x].wall = w))
);

simu.light.map((v, y) => v.map((w, x) => {
  console.log("\t".repeat(x) + simu.light[y][x].col)
}))

