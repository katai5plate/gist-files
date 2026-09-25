// 干支
const SKY = [..."甲乙丙丁戊己庚辛壬癸"];
const GROUND = [..."子丑寅卯辰巳午未申酉戌亥"];
// 九数列
const MATRIXES = {
  // 先天盤
  NATURE: [7, 6, 4, 9, 5, 1, 3, 2, 8],
  // 後天盤
  ACTION: [4, 9, 2, 3, 5, 7, 8, 1, 6],
};
// 規則
const RULES = {
  // 寅月中宮：子卯午酉年、丑辰未戌年、寅巳申亥年
  MONTH: [8, 5, 2],
  // 黄経270°から60°ごとの日盤中宮
  DAY: [1, 7, 4, 9, 3, 6],
  // 本命1・4・7、2・5・8、3・6・9の立春時点の月命
  SOUL: [8, 2, 5],
};
// 九星
const NINES = [
  {
    id: 1,
    material: { kazu: "一", color: "白", element: "水" },
    sky: { light: "壬", dark: "癸" },
    ground: { light: "子", dark: "亥" },
    eight: { name: "坎", mark: "☵" },
    compass: { nature: "西", action: "北" },
  },
  {
    id: 2,
    material: { kazu: "二", color: "黒", element: "土" },
    sky: { light: "戊", dark: "己" },
    ground: { light: "辰戌", dark: "丑未" },
    eight: { name: "坤", mark: "☷" },
    compass: { nature: "北", action: "南西" },
  },
  {
    id: 3,
    material: { kazu: "三", color: "碧", element: "木" },
    sky: { light: "甲", dark: "乙" },
    ground: { light: "寅", dark: "卯" },
    eight: { name: "震", mark: "☳" },
    compass: { nature: "北東", action: "東" },
  },
  {
    id: 4,
    material: { kazu: "四", color: "緑", element: "木" },
    sky: { light: "甲", dark: "乙" },
    ground: { light: "寅", dark: "卯" },
    eight: { name: "巽", mark: "☴" },
    compass: { nature: "南西", action: "南東" },
  },
  {
    id: 5,
    material: { kazu: "五", color: "黄", element: "土" },
    sky: { light: "戊", dark: "己" },
    ground: { light: "辰戌", dark: "丑未" },
    eight: { name: "", mark: "" },
    compass: { nature: "中央", action: "中央" },
  },
  {
    id: 6,
    material: { kazu: "六", color: "白", element: "金" },
    sky: { light: "庚", dark: "辛" },
    ground: { light: "申", dark: "酉" },
    eight: { name: "乾", mark: "☰" },
    compass: { nature: "南", action: "北西" },
  },
  {
    id: 7,
    material: { kazu: "七", color: "赤", element: "金" },
    sky: { light: "庚", dark: "辛" },
    ground: { light: "申", dark: "酉" },
    eight: { name: "兌", mark: "☱" },
    compass: { nature: "南東", action: "西" },
  },
  {
    id: 8,
    material: { kazu: "八", color: "白", element: "土" },
    sky: { light: "戊", dark: "己" },
    ground: { light: "辰戌", dark: "丑未" },
    eight: { name: "艮", mark: "☶" },
    compass: { nature: "北西", action: "北東" },
  },
  {
    id: 9,
    material: { kazu: "九", color: "紫", element: "火" },
    sky: { light: "丙", dark: "丁" },
    ground: { light: "午", dark: "巳" },
    eight: { name: "離", mark: "☲" },
    compass: { nature: "東", action: "南" },
  },
];

const mod = (n, m) => ((n % m) + m) % m;
const isYang = (longitude) => {
  longitude = mod(longitude, 360);
  return longitude >= 270 || longitude < 90;
};

// 64年を一白として、年ごとに一つ逆行する。
const yearCenter = (y) => mod(64 - y, NINES.length) + NINES[0].id;

const nineById = (id) => NINES.find((nine) => nine.id === id);
const assignNines = (ids) => ids.map(nineById);

// 中宮から、表示順の平坦な盤を返す。
const matrixByCenter = (center) => {
  const firstStarId = NINES[0].id;
  const fixedCenterStarId = MATRIXES.ACTION.find(
    (id) => nineById(id).compass.action === "中央",
  );

  return MATRIXES.ACTION.map(
    (fixedStarId) =>
      mod(
        fixedStarId - fixedCenterStarId + center - firstStarId,
        NINES.length,
      ) + firstStarId,
  );
};

const yearMatrix = (y) => matrixByCenter(yearCenter(y));

const yearGround = (y) => GROUND[mod(y - 64, GROUND.length)];

const monthCenter = (yearGround, monthGround) => {
  const yearGroundIndex = GROUND.indexOf(yearGround);
  const monthOffset = mod(
    GROUND.indexOf(monthGround) - GROUND.indexOf("寅"),
    GROUND.length,
  );
  const tigerCenter = RULES.MONTH[yearGroundIndex % RULES.MONTH.length];
  const firstStarId = NINES[0].id;

  return (
    mod(tigerCenter - monthOffset - firstStarId, NINES.length) + firstStarId
  );
};

const monthMatrix = (yearGround, monthGround) =>
  matrixByCenter(monthCenter(yearGround, monthGround));

const dayCenter = (solarLongitude, daySky, dayGround) => {
  const solarIndex = Math.floor(
    mod(solarLongitude - 270, 360) / (360 / RULES.DAY.length),
  );
  const skyIndex = SKY.indexOf(daySky);
  const groundIndex = GROUND.indexOf(dayGround);
  const sexagenaryCount = (SKY.length * GROUND.length) / 2;
  let sexagenaryIndex;

  for (
    sexagenaryIndex = skyIndex;
    sexagenaryIndex < sexagenaryCount;
    sexagenaryIndex += SKY.length
  ) {
    if (sexagenaryIndex % GROUND.length === groundIndex) break;
  }

  const adjustment =
    solarIndex < RULES.DAY.length / 2 ? sexagenaryIndex : -sexagenaryIndex;
  const firstStarId = NINES[0].id;

  return (
    mod(RULES.DAY[solarIndex] + adjustment - firstStarId, NINES.length) +
    firstStarId
  );
};

const dayMatrix = (solarLongitude, daySky, dayGround) =>
  matrixByCenter(dayCenter(solarLongitude, daySky, dayGround));

const timeCenter = (solarLongitude, dayGround, hourGround) => {
  const dayGroup = GROUND.indexOf(dayGround) % 3;
  const hourIndex = GROUND.indexOf(hourGround);
  const yang = isYang(solarLongitude);
  const step = NINES.length / 3;
  const value = yang
    ? NINES[0].id + dayGroup * step + hourIndex
    : NINES.length - dayGroup * step - hourIndex;
  const firstStarId = NINES[0].id;

  return mod(value - firstStarId, NINES.length) + firstStarId;
};

const timeMatrix = (solarLongitude, dayGround, hourGround) =>
  matrixByCenter(timeCenter(solarLongitude, dayGround, hourGround));

const getBoard = (matrix, longitude, centerGround) => {
  const board = assignNines(matrix).map((star) => ({ star, grounds: [] }));
  const fixedCenterStarId = MATRIXES.ACTION.find(
    (id) => nineById(id).compass.action === "中央",
  );
  const centerGroundIndex = GROUND.indexOf(centerGround);
  const direction = isYang(longitude) ? 1 : -1;

  GROUND.forEach((ground, index) => {
    const offset = mod(
      direction * mod(index - centerGroundIndex, GROUND.length),
      NINES.length,
    );
    const matrixIndex = MATRIXES.ACTION.findIndex(
      (fixedStarId) =>
        mod(fixedStarId - fixedCenterStarId, NINES.length) === offset,
    );

    board[matrixIndex].grounds.push(ground);
  });

  return board;
};

const getSouls = ({
  year,
  monthGround,
  solarLongitude,
  daySky,
  dayGround,
  hourGround,
}) => {
  const firstStarId = NINES[0].id;
  const yearValue = yearCenter(year);
  const tigerSoul = RULES.SOUL[(yearValue - firstStarId) % RULES.SOUL.length];
  const monthOffset = mod(
    GROUND.indexOf(monthGround) - GROUND.indexOf("寅"),
    GROUND.length,
  );

  return {
    year: yearValue,
    month:
      mod(tigerSoul - monthOffset - firstStarId, NINES.length) + firstStarId,
    day: dayCenter(solarLongitude, daySky, dayGround),
    time: timeCenter(solarLongitude, dayGround, hourGround),
  };
};

const getMatrixes = ({
  year,
  monthGround,
  solarLongitude,
  daySky,
  dayGround,
  hourGround,
}) => ({
  year: yearMatrix(year),
  month: monthMatrix(yearGround(year), monthGround),
  day: dayMatrix(solarLongitude, daySky, dayGround),
  time: timeMatrix(solarLongitude, dayGround, hourGround),
});

const getBoards = (values) => {
  const { year, monthGround, solarLongitude, dayGround, hourGround } = values;
  const matrixes = getMatrixes(values);

  return {
    year: getBoard(matrixes.year, solarLongitude, yearGround(year)),
    month: getBoard(matrixes.month, solarLongitude, monthGround),
    day: getBoard(matrixes.day, solarLongitude, dayGround),
    time: getBoard(matrixes.time, solarLongitude, hourGround),
  };
};
