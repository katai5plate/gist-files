// 四柱計算
// localClockToUTC({
//   year, month, day, hour, minute, second,
//   longitudeCorrectionMinutes=明石市との時差,
// }, {
//   applyJapanHistoricalDST=サマータイム自動考慮(true),
//   historicalDstOverride=サマータイム強制適用(null/false/true),
// })

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
  const longitudeCorrectionMinutes = input.longitudeCorrectionMinutes ?? 0;
  const corrected = new Date(
    Date.UTC(
      normalized.year,
      normalized.month - 1,
      normalized.day,
      normalized.hour,
      normalized.minute + longitudeCorrectionMinutes,
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
    longitudeCorrectionMinutes,
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
