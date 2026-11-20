// İrem Balkuv, 2200004679
// Destructuring in parameters and loops (forms 11 and 12). Run with `node js/params.mjs`.

// Form 11: an options object in the parameter list, with defaults.
function createTask({ title, status = 'todo' } = {}) {
  return { title, status }
}
console.log('form 11:', createTask({ title: 'Read' }))

// my version: scheduling a ground station pass
function schedulePass({ satellite, minElevation = 10, band = 'S' } = {}) {
  return `${satellite ?? '(no satellite)'} on ${band}-band above ${minElevation} deg`
}
console.log('form 11:', schedulePass({ satellite: 'ORION-TEST', band: 'Ku' }))
console.log('form 11 no args:', schedulePass())
// without `= {}` at the end, calling with nothing throws:
function schedulePassNoDefault({ satellite }) {
  return satellite
}
try {
  schedulePassNoDefault()
} catch (error) {
  console.log('form 11 no = {}:', error.message)
}

// Form 11b: the same idea with an array parameter, ([x, y]) => ...
const toText = ([lat, lon]) => `${lat.toFixed(2)}N ${lon.toFixed(2)}E`
console.log('form 11b:', toText([41.0364, 28.8582]))
// very common with .map over pairs
const passes = [['P-07', 38], ['P-08', 12], ['P-09', 61]]
console.log('form 11b map:', passes.map(([pid, el]) => `${pid}:${el}`).join(' '))

// Form 12: loops over entries, Object.entries and a Map
const batteryLog = { mon: 8.1, tue: 7.9, wed: 7.6 }
for (const [day, volts] of Object.entries(batteryLog)) {
  console.log('form 12 object:', day, volts)
}

// band -> rough downlink frequency in MHz (round numbers)
const bands = new Map([
  ['S', 2200],
  ['X', 8400],
  ['Ku', 12000],
])
for (const [band, mhz] of bands) {
  console.log('form 12 map:', band, '->', mhz, 'MHz')
}
// patterns also work for arrays of objects
const sensors = [{ name: 'IMU', ok: true }, { name: 'GPS', ok: false }]
for (const { name, ok } of sensors) {
  console.log('form 12 objects:', name, ok ? 'OK' : 'FAIL')
}
// and with the index from entries()
for (const [i, song] of ['Kara Toprak', 'Nem Kaldı'].entries()) {
  console.log('form 12 index:', i, song)
}
