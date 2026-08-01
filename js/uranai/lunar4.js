// 四柱計算＋節月式梅花心易時間運判定
//
// localClockToUTC({
//   year, month, day, hour, minute, second,
//   offset=明石市との時差,
// }, {
//   applyJapanHistoricalDST=サマータイム自動考慮(true),
//   historicalDstOverride=サマータイム強制適用(null/false/true),
// })
//
// const offset = XX;
// const birth = {
//   year: XXXX,
//   month: XX,
//   day: XX,
//   hour: XX,
//   minute: XX,
//   offset,
// };
// const today = {
//   year: XXXX,
//   month: XX,
//   day: XX,
//   hour: XX,
//   minute: XX,
//   offset,
// };
// const { fourPillars, destiny } = calculateDestiny(birth);
// console.log(fourPillars.text);
// console.log(calculateLuck(today, destiny.body.element));
// console.log(generateDayHours(today, destiny.body.element));

// 日本標準時の時差分数
const UTC_OFFSET_MINUTES = 540;

export const SKY = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
export const GROUND = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
];
export const SOLAR_MONTH_GROUND = [
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
  "子",
  "丑",
];
export const ELEMENT = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
  子: "水",
  亥: "水",
  寅: "木",
  卯: "木",
  巳: "火",
  午: "火",
  辰: "土",
  戌: "土",
  丑: "土",
  未: "土",
  申: "金",
  酉: "金",
};

export const mod = (n, m) => ((n % m) + m) % m;
const normalizeDegrees = (deg) => mod(deg, 360);
const degToRad = (deg) => (deg * Math.PI) / 180;

// グレゴリオ暦 -> JDN
const gregorianToJDN = (y, m, d) => {
  const k = Math.floor((14 - m) / 12);
  return (
    Math.floor(((-k + y + 4800) * 1461) / 4) +
    Math.floor(((12 * k + m - 2) * 367) / 12) -
    Math.floor((Math.floor((-k + y + 4900) / 100) * 3) / 4) +
    d -
    32075
  );
};
// Date -> ユリウス日
const dateToJD = (date) => {
  return date.getTime() / 86400000 + 2440587.5;
};
// // ユリウス日 -> Date
// const jdToDate = (jd) => {
//   return new Date((jd - 2440587.5) * 86400000);
// };

// 節月判定用 アメリカ海軍天文台式 太陽位置計算
const solarLongitude = (jd) => {
  const d = jd - 2451545.0;
  const g = normalizeDegrees(357.529 + 0.98560028 * d);
  const q = normalizeDegrees(280.459 + 0.98564736 * d);
  const longitude =
    q + 1.915 * Math.sin(degToRad(g)) + 0.02 * Math.sin(degToRad(2 * g));
  return normalizeDegrees(longitude);
};
// 太陽黄経 -> 月建 (立春315°を寅月開始点＝0とする)
const solarLongitudeToMonthGround = (longitude) => {
  const offset = normalizeDegrees(longitude - 315);
  const index = Math.floor(offset / 30);
  return SOLAR_MONTH_GROUND[index];
};

// 月の何番目の週の曜日か
const nthWeekdayOfMonth = (y, m, wd, nth) => {
  // 日曜=0
  const first = new Date(Date.UTC(y, m - 1, 1));
  const firstWeekday = first.getUTCDay();
  const delta = mod(wd - firstWeekday, 7);
  return 1 + delta + (nth - 1) * 7;
};

// サマータイム計算
const getJapanDSTPeriod = (year) => {
  // 1948 = 5月開始
  // 1949 = 4月開始
  // 1950/51 = 5月開始
  if (year < 1948 || year > 1951) return null;
  const startMonth = year === 1949 ? 4 : 5;
  const startDay = nthWeekdayOfMonth(year, startMonth, 0, 1);
  const endMonth = 9;
  const endDay = nthWeekdayOfMonth(year, endMonth, 0, 2);
  return {
    year,
    start: {
      month: startMonth,
      day: startDay,
    },
    end: {
      month: endMonth,
      day: endDay,
    },
  };
};

// 年月日時の単純比較
const localSerial = ({ year, month, day, hour = 0, minute = 0, second = 0 }) =>
  Date.UTC(year, month - 1, day, hour, minute, second);

// サマータイム判定
const isJapanHistoricalDST = (input) => {
  const period = getJapanDSTPeriod(input.year);
  if (!period) return false;

  // 実用上、開始日の01:00以降をDSTとする。
  const start = localSerial({
    year: input.year,
    month: period.start.month,
    day: period.start.day,
    hour: 1,
  });

  // 終了日の00:00以降は標準時側とする。
  // 境界の重複時刻は historicalDstOverride で手動指定する想定。
  const end = localSerial({
    year: input.year,
    month: period.end.month,
    day: period.end.day,
    hour: 0,
  });

  const value = localSerial(input);
  return value >= start && value < end;
};

// DST補正
const getJapanHistoricalDSTMinutes = (
  input,
  {
    enabled = true,
    override = null, // null=自動判定/true=強制サマータイム/false=強制標準
  } = {},
) => {
  if (!enabled) return 0;
  let active;
  if (override === true) {
    active = true;
  } else if (override === false) {
    active = false;
  } else {
    active = isJapanHistoricalDST(input);
  }
  return active ? 60 : 0;
};

// 表示時刻 -> 標準時
const normalizeHistoricalClock = (input, options = {}) => {
  const dstMinutes = getJapanHistoricalDSTMinutes(input, {
    enabled: options.applyJapanHistoricalDST ?? true,
    override: options.historicalDstOverride ?? null,
  });
  // 当時時計が1時間進んでいた
  const corrected = new Date(
    Date.UTC(
      input.year,
      input.month - 1,
      input.day,
      input.hour ?? 0,
      (input.minute ?? 0) - dstMinutes,
      input.second ?? 0,
    ),
  );
  return {
    year: corrected.getUTCFullYear(),
    month: corrected.getUTCMonth() + 1,
    day: corrected.getUTCDate(),
    hour: corrected.getUTCHours(),
    minute: corrected.getUTCMinutes(),
    second: corrected.getUTCSeconds(),
    dstApplied: dstMinutes !== 0,
    dstMinutes,
  };
};

// 実際の物理瞬間 -> UTC (JST:UTC+9/DST中:UTC+10)
const localClockToUTC = (input, options = {}) => {
  const dstMinutes = getJapanHistoricalDSTMinutes(input, {
    enabled: options.applyJapanHistoricalDST ?? true,
    override: options.historicalDstOverride ?? null,
  });
  const totalOffset = UTC_OFFSET_MINUTES + dstMinutes;
  const nominal = Date.UTC(
    input.year,
    input.month - 1,
    input.day,
    input.hour ?? 0,
    input.minute ?? 0,
    input.second ?? 0,
  );
  return {
    date: new Date(nominal - totalOffset * 60000),
    standardOffsetMinutes: UTC_OFFSET_MINUTES,
    dstMinutes,
    totalOffsetMinutes: totalOffset,
  };
};

// 占術上の地方時 (時計表示->サマータイムなら-1時間->地方時補正)
const getAstrologicalLocalTime = (input, options = {}) => {
  const normalized = normalizeHistoricalClock(input, options);
  const offset = input.offset ?? 0;
  const corrected = new Date(
    Date.UTC(
      normalized.year,
      normalized.month - 1,
      normalized.day,
      normalized.hour,
      normalized.minute + offset,
      normalized.second,
    ),
  );
  return {
    year: corrected.getUTCFullYear(),
    month: corrected.getUTCMonth() + 1,
    day: corrected.getUTCDate(),
    hour: corrected.getUTCHours(),
    minute: corrected.getUTCMinutes(),
    second: corrected.getUTCSeconds(),
    dstApplied: normalized.dstApplied,
    dstMinutes: normalized.dstMinutes,
    offset,
  };
};

const getPillarYear = (y, m, solarLon) => {
  // 1月は必ず前年干支年。
  if (m === 1) return y - 1;
  // 2月の立春前だけ前年。
  if (m === 2 && solarLon >= 300 && solarLon < 315) return y - 1;
  return y;
};

// 年柱計算
const getYearPillar = (localDate, solarLon) => {
  const pillarYear = getPillarYear(localDate.year, localDate.month, solarLon);
  const stemIndex = mod(pillarYear - 4, 10);
  const groundIndex = mod(pillarYear - 4, 12);
  return {
    pillarYear,
    stemIndex,
    groundIndex,
    sky: SKY[stemIndex],
    ground: GROUND[groundIndex],
    text: SKY[stemIndex] + GROUND[groundIndex],
  };
};

// 月柱計算
const getMonthPillar = (yp, solarLon) => {
  const ground = solarLongitudeToMonthGround(solarLon);
  const monthOffset = SOLAR_MONTH_GROUND.indexOf(ground);
  // 五虎遁
  const tigerStartStem = mod(yp.stemIndex * 2 + 2, 10);
  const stemIndex = mod(tigerStartStem + monthOffset, 10);
  return {
    stemIndex,
    groundIndex: GROUND.indexOf(ground),
    sky: SKY[stemIndex],
    ground,
    solarLongitude: solarLon,
    text: SKY[stemIndex] + ground,
  };
};

// 日柱計算
const getDayPillar = (y, m, d) => {
  const jdn = gregorianToJDN(y, m, d);
  const cycleIndex = mod(jdn + 49, 60);
  const stemIndex = cycleIndex % 10;
  const groundIndex = cycleIndex % 12;
  return {
    jdn,
    cycleIndex,
    stemIndex,
    groundIndex,
    sky: SKY[stemIndex],
    ground: GROUND[groundIndex],
    text: SKY[stemIndex] + GROUND[groundIndex],
  };
};

// 時支
const getHourgroundIndex = (h, m = 0, s = 0) => {
  const decimal = h + m / 60 + s / 3600;
  return Math.floor(mod(decimal + 1, 24) / 2);
};

// 時柱計算
const getHourPillar = (dp, h, m = 0, s = 0) => {
  const groundIndex = getHourgroundIndex(h, m, s);
  // 五鼠遁
  const ratStartStem = (dp.stemIndex % 5) * 2;
  const stemIndex = mod(ratStartStem + groundIndex, 10);
  return {
    stemIndex,
    groundIndex,
    sky: SKY[stemIndex],
    ground: GROUND[groundIndex],
    text: SKY[stemIndex] + GROUND[groundIndex],
  };
};

// 四柱計算
export function calculateFourPillars(input, options = {}) {
  const physicalTime = localClockToUTC(input, options);
  const actualJD = dateToJD(physicalTime.date);
  const solarLon = solarLongitude(actualJD);
  const astrologicalTime = getAstrologicalLocalTime(input, options);
  const year = getYearPillar(astrologicalTime, solarLon);
  const month = getMonthPillar(year, solarLon);
  const day = getDayPillar(
    astrologicalTime.year,
    astrologicalTime.month,
    astrologicalTime.day,
  );
  const hour = getHourPillar(
    day,
    astrologicalTime.hour,
    astrologicalTime.minute,
    astrologicalTime.second,
  );
  return {
    physicalUTC: physicalTime.date,
    actualJD,
    solarLongitude: solarLon,
    astrologicalLocalTime: astrologicalTime,
    daylightSaving: {
      applied: astrologicalTime.dstApplied,
      minutes: astrologicalTime.dstMinutes,
    },
    year,
    month,
    day,
    hour,
    text:
      `${year.text}年 ` +
      `${month.text}月 ` +
      `${day.text}日 ` +
      `${hour.text}時`,
  };
}

// ============================================================

const SKY_NUMBER = {
  甲: 1,
  乙: 2,
  丙: 3,
  丁: 4,
  戊: 5,
  己: 6,
  庚: 7,
  辛: 8,
  壬: 9,
  癸: 10,
};
const GROUND_NUMBER = {
  子: 1,
  丑: 2,
  寅: 3,
  卯: 4,
  辰: 5,
  巳: 6,
  午: 7,
  未: 8,
  申: 9,
  酉: 10,
  戌: 11,
  亥: 12,
};

// 八卦
const TRIGRAM = {
  1: {
    number: 1,
    name: "乾",
    element: "金",
    mark: "☰",
  },
  2: {
    number: 2,
    name: "兌",
    element: "金",
    mark: "☱",
  },
  3: {
    number: 3,
    name: "離",
    element: "火",
    mark: "☲",
  },
  4: {
    number: 4,
    name: "震",
    element: "木",
    mark: "☳",
  },
  5: {
    number: 5,
    name: "巽",
    element: "木",
    mark: "☴",
  },
  6: {
    number: 6,
    name: "坎",
    element: "水",
    mark: "☵",
  },
  7: {
    number: 7,
    name: "艮",
    element: "土",
    mark: "☶",
  },
  8: {
    number: 8,
    name: "坤",
    element: "土",
    mark: "☷",
  },
};

// 相生
const GENERATES = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};
// 相剋
const CONTROLS = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木",
};

// 数値 -> 八卦
const numberToTrigram = (n) => {
  let value = mod(n, 8);
  if (value === 0) value = 8;
  return TRIGRAM[value];
};

// 命卦計算
// 四柱の天干合計 -> 上卦
// 四柱の地支合計 -> 下卦
// 天干合計+地支合計 -> 動爻
const calculateDestinyHexagram = (fourPillars) => {
  const pillars = [
    fourPillars.year,
    fourPillars.month,
    fourPillars.day,
    fourPillars.hour,
  ];
  const skyTotal = pillars.reduce(
    (sum, pillar) => sum + SKY_NUMBER[pillar.sky],
    0,
  );
  const groundTotal = pillars.reduce(
    (sum, pillar) => sum + GROUND_NUMBER[pillar.ground],
    0,
  );
  const upper = numberToTrigram(skyTotal);
  const lower = numberToTrigram(groundTotal);
  let movingLine = mod(skyTotal + groundTotal, 6);
  if (movingLine === 0) movingLine = 6;
  // 初～三爻が動く -> 下卦が用、上卦が体
  // 四～上爻が動く -> 上卦が用、下卦が体
  const upperMoves = movingLine >= 4;
  const body = upperMoves ? lower : upper;
  const use = upperMoves ? upper : lower;
  return {
    skyTotal,
    groundTotal,
    upper,
    lower,
    movingLine,
    movingPart: upperMoves ? "上卦" : "下卦",
    body,
    use,
  };
};

// 生年月日時 -> 四柱 -> 命卦
export function calculateDestiny(input, options = {}) {
  const fourPillars = calculateFourPillars(input, options);
  const destiny = calculateDestinyHexagram(fourPillars);
  return { fourPillars, destiny };
}

// 五行関係判定
// bodyElement = 本人の体卦五行
// targetElement = 年支・月支・日支・時支の五行
export function getLuckRelation(bodyElement, targetElement) {
  // 比和
  if (bodyElement === targetElement)
    return {
      code: "比和",
      score: 1,
      kido: "旺",
      season: "相",
      life: "青",
      element: "金",
      meaning: "調和・同調・安定",
    };
  // 用が体を生む
  if (GENERATES[targetElement] === bodyElement)
    return {
      code: "加護",
      score: 2,
      kido: "廟",
      season: "旺",
      life: "成",
      element: "土",
      meaning: "補給・援助・回復",
    };
  // 体が用を剋す
  if (CONTROLS[bodyElement] === targetElement)
    return {
      code: "制剋",
      score: -1,
      kido: "弱",
      season: "囚",
      life: "童",
      element: "水",
      meaning: "制御・獲得・成果",
    };
  // 体が用を生む
  if (GENERATES[bodyElement] === targetElement)
    return {
      code: "発洩",
      score: 0,
      kido: "利",
      season: "休",
      life: "親",
      element: "火",
      meaning: "出力・消耗",
    };
  // 用が体を剋す
  if (CONTROLS[targetElement] === bodyElement)
    return {
      code: "受剋",
      score: -2,
      kido: "陥",
      season: "死",
      life: "老",
      element: "木",
      meaning: "圧力・障害",
    };
  throw new Error("五行関係判定に失敗しました");
}

// 柱 -> 運勢判定
const pillarToLuck = (pillar, bodyElement) => {
  const element = ELEMENT[pillar.ground];
  return {
    pillar: pillar.text,
    sky: pillar.sky,
    ground: pillar.ground,
    element,
    gc: getLuckRelation(bodyElement, element),
  };
};

// 年月日時運判定
export const calculateLuck = (input, dbe, options = {}) => {
  const fourPillars = calculateFourPillars(input, options);
  return {
    fourPillars,
    year: pillarToLuck(fourPillars.year, dbe),
    month: pillarToLuck(fourPillars.month, dbe),
    day: pillarToLuck(fourPillars.day, dbe),
    hour: pillarToLuck(fourPillars.hour, dbe),
  };
};

// 一日分の十二時辰運
export const generateDayHours = (
  { year, month, day, offset },
  dbe,
  { applyJapanHistoricalDST = true, historicalDstOverride = null } = {},
) => {
  const hours = [
    0, // 子
    2, // 丑
    4, // 寅
    6, // 卯
    8, // 辰
    10, // 巳
    12, // 午
    14, // 未
    16, // 申
    18, // 酉
    20, // 戌
    22, // 亥
  ];
  return hours.map((hour) => {
    const luck = calculateLuck(
      {
        year,
        month,
        day,
        hour,
        minute: 0,
        second: 0,
        offset,
      },
      dbe,
      {
        applyJapanHistoricalDST,
        historicalDstOverride,
      },
    );
    return {
      hour,
      pillar: luck.hour.pillar,
      ground: luck.hour.ground,
      element: luck.hour.element,
      gc: luck.hour.gc,
    };
  });
};
