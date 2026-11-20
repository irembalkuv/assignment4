// İrem Balkuv, 2200004679
// Bonus 2: experiments. Run with `node bonus/depth.mjs`.

// ---------- D1: an array pattern works on ANY iterable ----------
const [c1, c2, ...restChars] = 'İKÜSAT'
console.log('D1 string:', c1, c2, restChars)
const [firstEmoji] = '🛰️ ok'
console.log('D1 emoji:', JSON.stringify(firstEmoji), 'length', firstEmoji.length) // by code point, not by UTF-16 unit
const [s1, s2] = new Set(['S', 'S', 'X', 'Ku'])
console.log('D1 Set:', s1, s2)
const [[k1, v1]] = new Map([['temp', 22], ['battery', 7.9]])
console.log('D1 Map:', k1, v1)

// a generator that logs every step, to see how many items the pattern really takes
function* telemetryStream() {
  for (let i = 1; i <= 5; i++) {
    console.log('  generator gives', i)
    yield i * 10
  }
}
const [g1, g2] = telemetryStream()
console.log('D1 generator took:', g1, g2)
const [h1, ...hRest] = telemetryStream()
console.log('D1 generator with rest:', h1, hRest)

// what does the pattern call? a fake iterable that logs Symbol.iterator, next() and return()
const spy = {
  [Symbol.iterator]() {
    console.log('  Symbol.iterator called')
    let n = 0
    return {
      next() { n++; console.log('  next() ->', n); return { value: n, done: n > 3 } },
      return() { console.log('  return() called (iterator closed early)'); return { done: true } },
    }
  },
}
const [sp1, sp2] = spy
console.log('D1 spy:', sp1, sp2)
const [, , , sp4, sp5] = spy
console.log('D1 spy past the end:', sp4, sp5)

// object patterns do NOT use the iterator, they just read properties, so they work on arrays too
const { length, 0: firstSong, [2]: thirdSong } = ['Kara Toprak', 'Nem Kaldı', 'Gesi Bağları']
console.log('D1 object pattern on array:', length, firstSong, thirdSong)
// and on primitives (they get boxed), but still not on null/undefined
const { length: nameLength, toUpperCase } = 'orion'
console.log('D1 object pattern on string:', nameLength, typeof toUpperCase)

// ---------- D2: order of evaluation ----------
let calls = 0
function expensiveDefault(label) {
  calls++
  console.log('  default computed for', label)
  return 'computed-' + label
}
const { a = expensiveDefault('a'), b = expensiveDefault('b') } = { a: 'given' }
console.log('D2 lazy default:', a, b, 'calls =', calls) // only b's default ran
// a default can use a variable that comes EARLIER in the same pattern
const { width = 4, height = width * 2 } = {}
console.log('D2 earlier var:', width, height)
// but not a later one (temporal dead zone)
try {
  eval('const { p = q, q = 1 } = {}')
} catch (error) {
  console.log('D2 later var:', error.name + ':', error.message)
}
// left to right: getters run in the order of the pattern, not the order of the object
const ordered = {
  get second() { console.log('  read second'); return 2 },
  get first() { console.log('  read first'); return 1 },
}
const { first, second } = ordered
console.log('D2 getter order:', first, second)

// ---------- D3: destructuring in other places ----------
try {
  JSON.parse('{ bad json')
} catch ({ name, message }) {
  console.log('D3 catch:', name, '-', message.split('\n')[0])
}
// assignment targets can be properties, not only variables
const antenna = { el: 0, az: 0 }
;[antenna.el, antenna.az] = [38.5, 212]
console.log('D3 property targets:', antenna)
const cache = {}
;({ temp: cache.lastTemp, battery: cache['lastBattery'] } = { temp: 22, battery: 7.9 })
console.log('D3 object to properties:', cache)
// for...in gives keys (strings) one by one, there is nothing to destructure in a useful way;
// for...of over entries gives [key, value] pairs
const counts = { todo: 2, done: 5 }
for (const key in counts) console.log('D3 for...in:', key)
for (const [key, n] of Object.entries(counts)) console.log('D3 for...of:', key, n)
// a string key in for...in CAN be destructured, but it destructures the characters of the key!
for (const [firstLetter] in counts) console.log('D3 for...in pattern (weird):', firstLetter)

// ---------- D4: readability ----------
const response = { data: { station: { config: { bands: [{ name: 'S', mhz: 2200 }] } } } }
// hard to read: one deep pattern
const { data: { station: { config: { bands: [{ name: bandName, mhz: bandMhz }] } } } } = response
console.log('D4 deep pattern:', bandName, bandMhz)
// easier: take the object you care about first, then destructure it
const { bands } = response.data.station.config
const [mainBand] = bands
console.log('D4 two steps:', mainBand.name, mainBand.mhz)
