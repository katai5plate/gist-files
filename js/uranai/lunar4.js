// 四柱 + 十二節気/二十四節気 + 季節区分
// Usage:
//   const today = new Date();
//   const offsetMinute = +16;
//   const japaneseSummerTime = true;
//   const result = lunar4(
//     today,
//     offsetMinute,
//     japaneseSummerTime
//   );
// Args:
//   date: JavaScript Date（絶対時刻）
//   offsetMinute: 明石（JST標準子午線）からの地方時補正［分］
//   japaneseSummerTime:
//     true: 1948-1951年の日本夏時間を標準時へ補正
//     false: 当時の表示時計をそのまま使用
// Notes:
// - 年柱は立春（太陽黄経315°）で切り替える。
// - 月柱は節月（立春315°を寅月起点、以後30°ごと）で切り替える。
// - 日柱は地方時補正後の暦日を用い、日界は00:00。
// - 時支は子=23:00-00:59, 丑=01:00-02:59 ... とする。
// - 太陽黄経はUSNOの近似式を使用。
//
// 霊数
// Usage:
//   const today = lunar4(...);
//   ton3(today);
//   ton6(
//     身宮干支,
//     命宮干支,
//     大限干支,
//     today
//   );
//   xxx: [天干, 五干, 天霊数, 五霊数]

const SKY = [..."甲乙丙丁戊己庚辛壬癸"];
const GROUND = [..."子丑寅卯辰巳午未申酉戌亥"];
const SOLAR_MONTH_GROUND = [..."寅卯辰巳午未申酉戌亥子丑"];
// 0°, 15°, 30° ... の区間名。
// 例: 135° <= 黄経 < 150° → 立秋
const SEKKI24 = [
  "春分",
  "清明",
  "穀雨",
  "立夏",
  "小満",
  "芒種",
  "夏至",
  "小暑",
  "大暑",
  "立秋",
  "処暑",
  "白露",
  "秋分",
  "寒露",
  "霜降",
  "立冬",
  "小雪",
  "大雪",
  "冬至",
  "小寒",
  "大寒",
  "立春",
  "雨水",
  "啓蟄",
];

// 十二の「節」。
// 各節から次の節の直前までを、その節の名称とする。
// 小寒285°, 立春315°, 啓蟄345°, 清明 15°, 立夏 45°, 芒種 75°
// 小暑105°, 立秋135°, 白露165°, 寒露195°, 立冬225°, 大雪255°
const SEKKI12 = [
  "小寒",
  "立春",
  "啓蟄",
  "清明",
  "立夏",
  "芒種",
  "小暑",
  "立秋",
  "白露",
  "寒露",
  "立冬",
  "大雪",
];
const MS_PER_MINUTE = 60_000;
const MS_PER_DAY = 86_400_000;
const JST_OFFSET_MINUTE = 540;

// ============================================================
// 基本ユーティリティ
// ============================================================

const mod = (n, m) => ((n % m) + m) % m;
const normalizeDegrees = (deg) => mod(deg, 360);
const degToRad = (deg) => (deg * Math.PI) / 180;
const assertValidDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError("lunar4(): date must be a valid Date");
  }
};
const assertFiniteNumber = (value, name) => {
  if (!Number.isFinite(value)) {
    throw new TypeError(`lunar4(): ${name} must be a finite number`);
  }
};

// ============================================================
// Julian Date / 太陽黄経
// ============================================================

// Date -> Julian Date
// Date自身は絶対時刻なので、そのままUTC瞬間として扱う。
const dateToJD = (date) => date.getTime() / MS_PER_DAY + 2440587.5;
// USNO式による太陽黄経近似。
const solarLongitude = (jd) => {
  const d = jd - 2451545.0;
  const g = normalizeDegrees(357.529 + 0.98560028 * d);
  const q = normalizeDegrees(280.459 + 0.98564736 * d);
  return normalizeDegrees(
    q + 1.915 * Math.sin(degToRad(g)) + 0.02 * Math.sin(degToRad(2 * g)),
  );
};

// ============================================================
// Gregorian -> JDN
// ============================================================

const gregorianToJDN = (year, month, day) => {
  const k = Math.floor((14 - month) / 12);
  return (
    Math.floor(((-k + year + 4800) * 1461) / 4) +
    Math.floor(((12 * k + month - 2) * 367) / 12) -
    Math.floor((Math.floor((-k + year + 4900) / 100) * 3) / 4) +
    day -
    32075
  );
};

// ============================================================
// 日本時間
// ============================================================

// Asia/Tokyo の歴史的な表示時計を取得する。
// Intl / IANA timezone database を使うため、
// JavaScript実行環境のローカルタイムゾーンには依存しない。
const TOKYO_CLOCK_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});
const getTokyoClock = (date) => {
  const parts = Object.create(null);
  for (const part of TOKYO_CLOCK_FORMATTER.formatToParts(date)) {
    if (part.type !== "literal") {
      parts[part.type] = part.value;
    }
  }
  const clock = {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
  // 「東京の壁時計」を一旦UTC時刻として解釈し、
  // 元の絶対時刻との差を取る。
  // 通常: +540分
  // 日本夏時間: +600分
  const wallAsUTC = Date.UTC(
    clock.year,
    clock.month - 1,
    clock.day,
    clock.hour,
    clock.minute,
    clock.second,
  );
  const instantRoundedToSecond = Math.floor(date.getTime() / 1000) * 1000;
  const utcOffsetMinute = Math.round(
    (wallAsUTC - instantRoundedToSecond) / MS_PER_MINUTE,
  );
  return {
    ...clock,
    utcOffsetMinute,
  };
};

// ============================================================
// 占術用地方時
// ============================================================

// japaneseSummerTime = true の場合:
//   日本夏時間（UTC+10）
//       ↓ -60分
//   日本標準時（UTC+9）
//       ↓ offsetMinute
//   占術上の地方時
// という順番で補正する。
const getAstrologicalClock = (date, offsetMinute, japaneseSummerTime) => {
  const tokyo = getTokyoClock(date);
  const summerMinute =
    japaneseSummerTime && tokyo.utcOffsetMinute > JST_OFFSET_MINUTE
      ? tokyo.utcOffsetMinute - JST_OFFSET_MINUTE
      : 0;
  const corrected = new Date(
    Date.UTC(
      tokyo.year,
      tokyo.month - 1,
      tokyo.day,
      tokyo.hour,
      tokyo.minute - summerMinute + offsetMinute,
      tokyo.second,
    ),
  );
  return {
    year: corrected.getUTCFullYear(),
    month: corrected.getUTCMonth() + 1,
    day: corrected.getUTCDate(),
    hour: corrected.getUTCHours(),
    minute: corrected.getUTCMinutes(),
    second: corrected.getUTCSeconds(),
  };
};

// ============================================================
// 年柱
// ============================================================

const getYearPillar = (clock, longitude) => {
  // 年柱は立春で切り替える。
  // 1月: 常に前年の干支年
  // 2月: 立春315°以前のみ前年
  const pillarYear =
    clock.month === 1 || (clock.month === 2 && longitude < 315)
      ? clock.year - 1
      : clock.year;
  const stemIndex = mod(pillarYear - 4, 10);
  const groundIndex = mod(pillarYear - 4, 12);
  return [SKY[stemIndex], GROUND[groundIndex]];
};

// ============================================================
// 月柱
// ============================================================

const getMonthPillar = (yearPillar, longitude) => {
  // 立春315°を寅月開始点とし、
  // 30°ごとに次の月建へ進む。
  const monthIndex = Math.floor(normalizeDegrees(longitude - 315) / 30);
  const ground = SOLAR_MONTH_GROUND[monthIndex];
  // 五虎遁
  // 年干から寅月の起干を求める。
  const yearStemIndex = SKY.indexOf(yearPillar[0]);
  const tigerStartStem = mod(yearStemIndex * 2 + 2, 10);
  const stemIndex = mod(tigerStartStem + monthIndex, 10);

  return [SKY[stemIndex], ground];
};

// ============================================================
// 日柱
// ============================================================

const getDayPillar = (clock) => {
  const jdn = gregorianToJDN(clock.year, clock.month, clock.day);
  const cycleIndex = mod(jdn + 49, 60);
  return [SKY[cycleIndex % 10], GROUND[cycleIndex % 12]];
};

// ============================================================
// 時柱
// ============================================================

const getHourPillar = (dayPillar, clock) => {
  const decimalHour = clock.hour + clock.minute / 60 + clock.second / 3600;
  // 子: 23:00 - 00:59
  // 丑: 01:00 - 02:59
  // ...
  const groundIndex = Math.floor(mod(decimalHour + 1, 24) / 2);
  // 五鼠遁
  // 日干から子時の起干を求める。
  const dayStemIndex = SKY.indexOf(dayPillar[0]);
  const ratStartStem = (dayStemIndex % 5) * 2;
  const stemIndex = mod(ratStartStem + groundIndex, 10);
  return [SKY[stemIndex], GROUND[groundIndex]];
};

// ============================================================
// 二十四節気
// ============================================================

const getSekki24 = (longitude) => SEKKI24[Math.floor(longitude / 15)];

// ============================================================
// 十二節気
// ============================================================

const getSekki12 = (longitude) => {
  // 小寒285°を起点に30°単位。
  const index = Math.floor(normalizeDegrees(longitude - 285) / 30);
  return SEKKI12[index];
};

// ============================================================
// 陰陽二季
// ============================================================

// 0: 冬至270°～夏至90°直前
// 1: 夏至90°～冬至270°直前
const getSeason2 = (longitude) => (longitude >= 270 || longitude < 90 ? 0 : 1);

// ============================================================
// 四季
// ============================================================

// 0: 冬至～春分直前
// 1: 春分～夏至直前
// 2: 夏至～秋分直前
// 3: 秋分～冬至直前
const getSeason4 = (longitude) => {
  if (longitude >= 270) return 0;
  if (longitude < 90) return 1;
  if (longitude < 180) return 2;
  return 3;
};

// ============================================================
// 本体
// ============================================================

const lunar4 = (
  date = new Date(),
  offsetMinute = 0,
  japaneseSummerTime = true,
) => {
  assertValidDate(date);
  assertFiniteNumber(offsetMinute, "offsetMinute");
  if (typeof japaneseSummerTime !== "boolean") {
    throw new TypeError("lunar4(): japaneseSummerTime must be a boolean");
  }
  // 太陽黄経は物理的な瞬間から求める。
  // 地方時補正によって太陽の物理的位置が
  // 変わるわけではないため、
  // offsetMinute は黄経計算には加えない。
  const jd = dateToJD(date);
  const longitude = solarLongitude(jd);
  // 四柱側だけ占術上の地方時へ変換する。
  const clock = getAstrologicalClock(date, offsetMinute, japaneseSummerTime);
  const year = getYearPillar(clock, longitude);
  const month = getMonthPillar(year, longitude);
  const day = getDayPillar(clock);
  const time = getHourPillar(day, clock);
  return {
    year,
    month,
    day,
    time,
    sekki12: getSekki12(longitude),
    sekki24: getSekki24(longitude),
    season2: getSeason2(longitude),
    season4: getSeason4(longitude),
    longitude,
  };
};

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

// ============================================================
// 霊数
// ============================================================

const REISU = {
  甲: 3,
  乙: 4,
  丙: 5,
  丁: 6,
  戊: 7,
  己: 8,
  庚: 9,
  辛: 0,
  壬: 1,
  癸: 2,
};

// ============================================================
// 入力チェック
// ============================================================

const assertStem = (stem, name = "天干") => {
  if (!SKY.includes(stem)) {
    throw new TypeError(`${name} must be one of ${SKY.join("")}`);
  }
};
const assertBranch = (branch, name = "地支") => {
  if (!GROUND.includes(branch)) {
    throw new TypeError(`${name} must be one of ${GROUND.join("")}`);
  }
};
const assertPillar = (pillar, name) => {
  if (!Array.isArray(pillar) || pillar.length < 2) {
    throw new TypeError(`${name} must be [天干, 地支]`);
  }
  assertStem(pillar[0], `${name}[0]`);
  assertBranch(pillar[1], `${name}[1]`);
};
const assertLunar4 = (today) => {
  if (!today || typeof today !== "object") {
    throw new TypeError("today must be the result of lunar4()");
  }
  assertPillar(today.year, "today.year");
  assertPillar(today.month, "today.month");
  assertPillar(today.day, "today.day");
  assertPillar(today.time, "today.time");
};

// ============================================================
// 干支文字列
// ============================================================

const parseGanzhi = (value, name) => {
  if (typeof value !== "string") {
    throw new TypeError(`${name} must be a 干支 string such as "甲子"`);
  }
  const text = value.trim();
  const chars = Array.from(text);
  if (chars.length !== 2) {
    throw new TypeError(
      `${name} must be a two-character 干支 string such as "甲子"`,
    );
  }
  const [stem, branch] = chars;
  assertStem(stem, `${name}の天干`);
  assertBranch(branch, `${name}の地支`);
  return [stem, branch];
};

// ============================================================
// 五合グループ
// ============================================================
// 甲己 = 0
// 乙庚 = 1
// 丙辛 = 2
// 丁壬 = 3
// 戊癸 = 4

const stemGroup = (stem) => {
  assertStem(stem);
  return SKY.indexOf(stem) % 5;
};

// ============================================================
// 汎用五遁
// ============================================================
// startBranch:
//   子 -> 五鼠遁, 丑 -> 五牛遁, 寅 -> 五虎遁
//   卯 -> 五兔遁, 辰 -> 五龍遁, 巳 -> 五蛇遁
//   午 -> 五馬遁, 未 -> 五羊遁, 申 -> 五猴遁
//   酉 -> 五雞遁, 戌 -> 五狗遁, 亥 -> 五猪遁
// stem: 起干を決定する基準天干
// targetBranch: 求めたい地支
const tonStem = (startBranch, stem, targetBranch) => {
  assertBranch(startBranch, "起点支");
  assertStem(stem, "基準天干");
  assertBranch(targetBranch, "対象支");
  const startBranchIndex = GROUND.indexOf(startBranch);
  const targetBranchIndex = GROUND.indexOf(targetBranch);
  const group = stemGroup(stem);

  // ----------------------------------------------------------
  // 起干
  // ----------------------------------------------------------
  // 起干表：
  //       甲己 乙庚 丙辛 丁壬 戊癸
  // 子     甲   丙   戊   庚   壬
  // 丑     乙   丁   己   辛   癸
  // 寅     丙   戊   庚   壬   甲
  // ...
  const startStemIndex = mod(
    startBranchIndex + group * 2,
    10,
  );

  // ----------------------------------------------------------
  // 起点支 → 対象支
  // ----------------------------------------------------------
  // 十二支を順行する距離。
  // 例: 丑 → 申
  // 丑 寅 卯 辰 巳 午 未 申
  // 0  1  2  3  4  5  6  7
  // distance = 7
  const distance = mod(
    targetBranchIndex - startBranchIndex,
    12,
  );

  // 地支が一つ進むたび、天干も一つ進める。
  const stemIndex = mod(
    startStemIndex + distance,
    10,
  );

  return SKY[stemIndex];
};

// ============================================================
// 天干 → 霊数
// ============================================================

const reisu = (stem) => {
  assertStem(stem);
  return REISU[stem];
};

// ============================================================
// ton3
// ============================================================
// 月: 年干 + 月支 = 五鼠遁
// 日: 月干 + 日支 = 五牛遁
// 時: 日干 + 時支 = 五虎遁
// return:
// {
//   month: [月干, 鼠干, 月干霊数, 鼠干霊数],
//   day: [日干, 牛干, 日干霊数, 牛干霊数],
//   time: [時干, 虎干, 時干霊数, 虎干霊数],
// }

const ton3 = (today) => {
  assertLunar4(today);
  const yearStem = today.year[0];
  const monthStem = today.month[0];
  const monthBranch = today.month[1];
  const dayStem = today.day[0];
  const dayBranch = today.day[1];
  const timeStem = today.time[0];
  const timeBranch = today.time[1];

  // 五鼠遁: 年干 + 月支
  const mouseStem = tonStem("子", yearStem, monthBranch);
  // 五牛遁: 月干 + 日支
  const cowStem = tonStem("丑", monthStem, dayBranch);
  // 五虎遁: 日干 + 時支
  const tigerStem = tonStem("寅", dayStem, timeBranch);
  return {
    month: [monthStem, mouseStem, reisu(monthStem), reisu(mouseStem)],
    day: [dayStem, cowStem, reisu(dayStem), reisu(cowStem)],
    time: [timeStem, tigerStem, reisu(timeStem), reisu(tigerStem)],
  };
}

// ============================================================
// ton6
// ============================================================
// 命: 身宮干 + 命宮支 = 五雞遁
// 大: 命宮干 + 大限支 = 五狗遁
// 年: 大限干 + 年支 = 五猪遁

const ton6 = (
  bodyPalaceGanzhi,
  soulPalaceGanzhi,
  bigLimitGanzhi,
  today,
) => {
  assertLunar4(today);
  // 身宮
  const [bodyStem] = parseGanzhi(bodyPalaceGanzhi, "身宮干支");
  // 命宮
  const [soulStem, soulBranch] = parseGanzhi(soulPalaceGanzhi, "命宮干支");
  // 大限
  const [bigStem, bigBranch] = parseGanzhi(bigLimitGanzhi, "大限干支");
  // 年柱
  const yearStem = today.year[0];
  const yearBranch = today.year[1];

  // ----------------------------------------------------------
  // 五雞遁
  // 身宮干 + 命宮支
  // ----------------------------------------------------------
  const chickenStem = tonStem("酉", bodyStem, soulBranch);

  // ----------------------------------------------------------
  // 五狗遁
  // 命宮干 + 大限支
  // ----------------------------------------------------------
  const dogStem = tonStem("戌", soulStem, bigBranch);

  // ----------------------------------------------------------
  // 五猪遁
  // 大限干 + 年支
  // ----------------------------------------------------------
  const pigStem = tonStem("亥", bigStem, yearBranch);

  // 月・日・時は ton3 と全く同じ処理なので再利用する。
  const three = ton3(today);

  return {
    soul: [soulStem, chickenStem, reisu(soulStem), reisu(chickenStem)],
    big: [bigStem, dogStem, reisu(bigStem), reisu(dogStem)],
    year: [yearStem, pigStem, reisu(yearStem), reisu(pigStem)],
    month: three.month,
    day: three.day,
    time: three.time,
  };
}
