export const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'] as const;
export const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'] as const;
export const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;
export const ZODIAC = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'] as const;

const STEM_EL: Record<string, number> = { '甲':0,'乙':0,'丙':1,'丁':1,'戊':2,'己':2,'庚':3,'辛':3,'壬':4,'癸':4 };
const BRANCH_EL: Record<string, number> = { '寅':0,'卯':0,'巳':1,'午':1,'辰':2,'未':2,'戌':2,'丑':2,'申':3,'酉':3,'亥':4,'子':4 };
const HOUR_BR: Record<number, number> = { 23:0,0:0,1:1,2:1,3:2,4:2,5:3,6:3,7:4,8:4,9:5,10:5,11:6,12:6,13:7,14:7,15:8,16:8,17:9,18:9,19:10,20:10,21:11,22:11 };

export function getZodiacIndex(month: number, day: number): number {
  const d = [20,19,21,20,21,21,23,23,23,23,22,22];
  return day >= d[month - 1] ? month % 12 : (month + 10) % 12;
}

export function getDominantElement(year: number, month: number, day: number, hour: number): number {
  const c = [0,0,0,0,0];
  const ys = STEMS[(year - 4) % 10];
  c[STEM_EL[ys]]++; c[BRANCH_EL[BRANCHES[(year - 4) % 12]]]++;
  const ms = STEMS[(((year - 4) % 10) % 5) * 2 + month - 1 % 10];
  c[STEM_EL[ms]]++; c[BRANCH_EL[BRANCHES[(month + 1) % 12]]]++;
  const diff = Math.floor((new Date(year, month-1, day).getTime() - new Date(1900,0,31).getTime()) / 86400000);
  const ds = STEMS[((diff % 10) + 10) % 10];
  c[STEM_EL[ds]]++; c[BRANCH_EL[BRANCHES[((diff % 12) + 12) % 12]]]++;
  const hb = HOUR_BR[hour] ?? 0;
  c[STEM_EL[STEMS[((STEMS.indexOf(ds) % 5) * 2 + hb) % 10]]]++; c[BRANCH_EL[BRANCHES[hb]]]++;
  return c.indexOf(Math.max(...c));
}
