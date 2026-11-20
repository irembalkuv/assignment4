// İrem Balkuv, 2200004679
// Things that surprise people. Run with `node js/pitfalls.mjs`.

// Pitfall 1: destructuring undefined or null throws a TypeError.
try {
  const { a } = undefined
  console.log(a)
} catch (error) {
  console.log('pitfall 1:', error.constructor.name)
}
// with my data: an API that returns null when the satellite is not visible
function lastPacket(visible) {
  return visible ? { temp: 22 } : null
}
try {
  const { temp } = lastPacket(false)
  console.log(temp)
} catch (error) {
  console.log('pitfall 1:', error.message)
}

// Pitfall 2: a default only applies to undefined, not to null
const fromSensor = { temp: null, battery: undefined }
const { temp = 20, battery = 8 } = fromSensor
console.log('pitfall 2:', 'temp =', temp, '| battery =', battery)
// if null should also use the default, ?? is the tool for it
const safeTemp = fromSensor.temp ?? 20
console.log('pitfall 2 fix with ??:', safeTemp)

// Pitfall 3: assigning without const/let needs parentheses, ({ a } = obj)
// `{ mode } = config` alone is a SyntaxError (a line starting with { is a block).
// I cannot leave that line here because then the whole file does not run, so I use eval to show it.
let mode
const config = { mode: 'safe' }
try {
  eval('{ mode } = config')
} catch (error) {
  console.log('pitfall 3:', error.name + ':', error.message)
}
;({ mode } = config)
console.log('pitfall 3 with ( ):', mode)

// Pitfall 4: it copies references, not deep copies (nested objects are shared)
const original = { name: 'IKU-GS1', location: { city: 'Istanbul' } }
const { location, ...copy } = original
location.city = 'Ankara'
console.log('pitfall 4:', original.location.city)
// rest/spread are shallow too: the inner object is the same object
const shallow = { ...original }
console.log('pitfall 4 same object?', shallow.location === original.location)
const deep = structuredClone(original)
console.log('pitfall 4 structuredClone same?', deep.location === original.location)

// Pitfall 5: in objects the order does not matter, in arrays it does
const reading = { volts: 7.9, amps: 0.4 }
const { amps, volts } = reading
console.log('pitfall 5 object:', volts, amps)
const pair = [7.9, 0.4]
const [ampsWrong, voltsWrong] = pair
console.log('pitfall 5 array:', 'amps =', ampsWrong, 'volts =', voltsWrong, '(wrong way round)')

// Pitfall 6 (extra): an array pattern on a plain object fails, it needs an iterable
try {
  const [x] = { 0: 'a' }
  console.log(x)
} catch (error) {
  console.log('pitfall 6:', error.message)
}
