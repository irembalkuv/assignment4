// İrem Balkuv, 2200004679
// The same six object forms as js/objects.mjs, now typed.

type Task = { id: string; title: string; status: 'todo' | 'in-progress' | 'done' }

type Packet = {
  id: string
  temp: number
  battery: number
  mode: 'nominal' | 'safe' | 'debug'
  gps: { lat: number; lon: number; fix: boolean }
  readings: number[]
  downlinkRate?: number
  antennaGain?: number
}

const packet: Packet = {
  id: 'PKT-0142',
  temp: 23.4,
  battery: 7.9,
  mode: 'nominal',
  gps: { lat: 41.0, lon: 28.8, fix: true },
  readings: [512, 498, 505],
}

// Form 5
const task: Task = { id: 't1', title: 'Buy milk', status: 'todo' }
const { title, status } = task
console.log('form 5:', title, status)
let { temp, battery } = packet // temp: number, battery: number (types come from Packet)
temp = temp + 1
console.log('form 5:', temp, battery)

// Form 6: rename. The colon is a rename here, the type comes from Packet.
const { id: packetId, mode: flightMode } = packet
console.log('form 6:', packetId, flightMode) // flightMode: 'nominal' | 'safe' | 'debug'

// Form 7: defaults on optional fields. downlinkRate?: number becomes number.
const { downlinkRate = 9600, antennaGain: gain = 3.5 } = packet
console.log('form 7:', downlinkRate.toFixed(0), gain.toFixed(1))

// Form 8: rest. TypeScript works out the type of the rest object for me.
const { id, gps, readings, ...summary } = packet
// summary: { temp: number; battery: number; mode: ...; downlinkRate?: number; antennaGain?: number }
console.log('form 8:', id, summary)

// Form 9: nested. readings is number[], so an item can be undefined (noUncheckedIndexedAccess).
const {
  gps: { lat, lon },
  readings: [firstReading = 0, , thirdReading = 0],
} = packet
console.log('form 9:', lat, lon, firstReading, thirdReading)

// Form 10: computed key. If key is a union of real keys, value gets the union of their types.
function readField(p: Packet, field: 'temp' | 'battery'): number {
  const { [field]: value } = p // value: number, because both temp and battery are number
  return value
}
console.log('form 10:', 'battery =', readField(packet, 'battery').toFixed(1))
// with a key that mixes types, the value is a union: 'temp' | 'mode' gives number | 'nominal' | 'safe' | 'debug'
function readAny(p: Packet, field: 'temp' | 'mode') {
  const { [field]: value } = p
  return typeof value === 'number' ? `number ${value}` : `text ${value}`
}
console.log('form 10 union:', readAny(packet, 'temp'), '/', readAny(packet, 'mode'))
