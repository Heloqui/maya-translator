import { getSyllabaryGrid } from './data'

const GMT_CORRELATION = 584283
const calendarData = getSyllabaryGrid().calendar_glyphs

export function getDaySigns() {
  return calendarData.day_signs
}

export function getMonthSigns() {
  return calendarData.month_signs
}

function gregorianToJDN(year, month, day) {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
}

function jdnToMayaDays(jdn) {
  return jdn - GMT_CORRELATION
}

function mayaDaysToLongCount(days) {
  let remaining = days
  const baktun = Math.floor(remaining / 144000)
  remaining %= 144000
  const katun = Math.floor(remaining / 7200)
  remaining %= 7200
  const tun = Math.floor(remaining / 360)
  remaining %= 360
  const winal = Math.floor(remaining / 20)
  const kin = remaining % 20
  return { baktun, katun, tun, winal, kin }
}

function getTzolkin(mayaDays) {
  const dayNum = ((mayaDays + 3) % 13 + 13) % 13 + 1
  const daySign = ((mayaDays + 19) % 20 + 20) % 20
  const sign = calendarData.day_signs[daySign]
  return { number: dayNum, signIndex: daySign, sign }
}

function getHaab(mayaDays) {
  const dayInYear = ((mayaDays + 348) % 365 + 365) % 365
  const month = Math.floor(dayInYear / 20)
  const day = dayInYear % 20
  const monthSign = calendarData.month_signs[month]
  return { day, monthIndex: month, month: monthSign }
}

function longCountToMayaDays(lc) {
  const parts = lc.split('.').map(Number)
  if (parts.length !== 5 || parts.some(isNaN)) return null
  const [baktun, katun, tun, winal, kin] = parts
  return baktun * 144000 + katun * 7200 + tun * 360 + winal * 20 + kin
}

function mayaDaysToGregorian(mayaDays) {
  const jdn = mayaDays + GMT_CORRELATION
  const l = jdn + 68569
  const n = Math.floor(4 * l / 146097)
  const l2 = l - Math.floor((146097 * n + 3) / 4)
  const i = Math.floor(4000 * (l2 + 1) / 1461001)
  const l3 = l2 - Math.floor(1461 * i / 4) + 31
  const j = Math.floor(80 * l3 / 2447)
  const day = l3 - Math.floor(2447 * j / 80)
  const l4 = Math.floor(j / 11)
  const month = j + 2 - 12 * l4
  const year = 100 * (n - 49) + i + l4
  return { year, month, day }
}

const DIRECTIONS = ['East', 'North', 'West', 'South']
const DIRECTION_COLORS = ['chak (rojo)', 'sak (blanco)', "ek' (negro)", "k'an (amarillo)"]

export function convertGregorianToMaya(year, month, day) {
  const jdn = gregorianToJDN(year, month, day)
  const mayaDays = jdnToMayaDays(jdn)
  const longCount = mayaDaysToLongCount(mayaDays)
  const tzolkin = getTzolkin(mayaDays)
  const haab = getHaab(mayaDays)
  const dirIndex = tzolkin.signIndex % 4
  return {
    longCount,
    longCountStr: `${longCount.baktun}.${longCount.katun}.${longCount.tun}.${longCount.winal}.${longCount.kin}`,
    tzolkin,
    haab,
    direction: DIRECTIONS[dirIndex],
    color: DIRECTION_COLORS[dirIndex],
    mayaDays,
  }
}

export function convertLongCountToGregorian(lcStr) {
  const mayaDays = longCountToMayaDays(lcStr)
  if (mayaDays === null) return null
  const gregorian = mayaDaysToGregorian(mayaDays)
  const tzolkin = getTzolkin(mayaDays)
  const haab = getHaab(mayaDays)
  const longCount = mayaDaysToLongCount(mayaDays)
  const dirIndex = tzolkin.signIndex % 4
  return {
    gregorian,
    longCount,
    longCountStr: lcStr,
    tzolkin,
    haab,
    direction: DIRECTIONS[dirIndex],
    color: DIRECTION_COLORS[dirIndex],
    mayaDays,
  }
}
