// İrem Balkuv, 2200004679
// Object destructuring (forms 5 to 10). Run with `node js/objects.mjs`.
// My data: one telemetry packet from our CubeSat test board and a ground station config.

const packet = {
  id: 'PKT-0142',
  temp: 23.4,
  battery: 7.9,
  mode: 'nominal',
  gps: { lat: 41.0, lon: 28.8, fix: true },
  readings: [512, 498, 505],
}

// Form 5: take properties out of an object by name.
const task = { id: 't1', title: 'Buy milk', status: 'todo' }
const { title, status } = task
console.log('form 5:', title, status)

let { temp, battery } = packet
console.log('form 5:', temp, battery)
// let means I can change them later, it does NOT change the packet
temp = 99
console.log('form 5 after change:', temp, packet.temp)
// a name that is not in the object gives undefined
const { altitude } = packet
console.log('form 5 missing:', altitude)

// Form 6: rename while you take it, { title: heading }
const { id: packetId, mode: flightMode } = packet
console.log('form 6:', packetId, flightMode)
// the old name `mode` is not a variable now (see my log, I tried console.log(mode))

// Form 7: default values, { priority = 'normal' }
const { mode = 'safe', downlinkRate = 9600 } = packet
console.log('form 7:', mode, downlinkRate)
// rename and default together: source : newName = default
const { antennaGain: gain = 3.5 } = packet
console.log('form 7 rename+default:', gain)

// Form 8: rest, { id, ...others }
const { id, gps, readings, ...summary } = packet
console.log('form 8 id:', id)
console.log('form 8 rest:', summary)
// rest is a NEW object, so changing it does not touch packet
summary.temp = -1
console.log('form 8 packet still:', packet.temp)

// Form 9: nested patterns, { owner: { name } } and arrays inside objects
const {
  gps: { lat, lon },
  readings: [firstReading, , thirdReading],
} = packet
console.log('form 9:', lat, lon, firstReading, thirdReading)
// note: `gps` here is only a path, not a new variable. (I already have gps from form 8.)
// nested default, for when the inner object might be missing
const station = { name: 'IKU-GS1' }
const { location: { city = 'unknown' } = {} } = station
console.log('form 9 nested default:', city)

// Form 10: computed key, { [key]: value }
const field = 'battery'
const { [field]: value } = packet
console.log('form 10:', field, '=', value)
// useful in a loop where the field name comes from a list
for (const name of ['temp', 'mode']) {
  const { [name]: v } = packet
  console.log('form 10 loop:', name, v)
}
