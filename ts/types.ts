// İrem Balkuv, 2200004679
// What only TypeScript adds (topics T1 to T5). See the handout.

// ---------- T1: `{ a: string }` inside a pattern is a RENAME, not a type ----------
const point = { x: 1, y: 2 }
const { x: horizontal } = point // x is renamed to horizontal; there is no variable x
console.log('T1:', horizontal)

// What I first wrote (it does not compile, so it is only a comment):
//   function describeStation({ name: string, elevation: number }) { ... }
// tsc says: Binding element 'string' implicitly has an 'any' type.
// It made two variables called `string` and `number`, and no `name` at all.
type Station = { name: string; elevation: number }
function describeStation({ name, elevation }: Station): string {
  return `${name} at ${elevation} m`
}
console.log('T1 correct:', describeStation({ name: 'IKU-GS1', elevation: 120 }))
// rename AND type: the rename is in the pattern, the type is after it
function describeRenamed({ name: stationName }: Station): string {
  return stationName.toLowerCase()
}
console.log('T1 rename + type:', describeRenamed({ name: 'IKU-GS1', elevation: 120 }))
// inline type works too, but it repeats the names
const { y: vertical }: { x: number; y: number } = point
console.log('T1 inline type:', vertical)

// ---------- T2: tuple return types and `as const` ----------
// Without a return type, [temp, label] is inferred as (string | number)[], so each item is string | number | undefined.
function readLoose() {
  return [23.4, 'nominal']
}
const [looseA, looseB] = readLoose()
console.log('T2 loose:', typeof looseA, typeof looseB) // runtime is fine, the TYPES are the problem

// with a tuple return type each position has its own type
function readTuple(): [number, string] {
  return [23.4, 'nominal']
}
const [tupleTemp, tupleMode] = readTuple()
console.log('T2 tuple:', tupleTemp.toFixed(1), tupleMode.toUpperCase())

// `as const` makes it a readonly tuple of literal types: readonly [41.03, 28.85]
const stationPos = [41.03, 28.85] as const
const [posLat, posLon] = stationPos // posLat: 41.03, posLon: 28.85 (literal types, not number)
console.log('T2 as const:', posLat, posLon)
// the same trick lets a function return a tuple without writing the type by hand
function useToggle(start: boolean) {
  let on = start
  const flip = () => { on = !on; return on }
  return [on, flip] as const // readonly [boolean, () => boolean]
}
const [isOn, flip] = useToggle(false)
console.log('T2 hook-like:', isOn, flip())

// ---------- T3: noUncheckedIndexedAccess ----------
const bands: string[] = ['S', 'X', 'Ku']
const [firstBand] = bands // firstBand: string | undefined
// firstBand.toLowerCase()  -> error TS18048: 'firstBand' is possibly 'undefined'.
// way 1: check it
if (firstBand !== undefined) {
  console.log('T3 checked:', firstBand.toLowerCase())
}
// way 2: optional chaining
console.log('T3 ?. :', firstBand?.toLowerCase())
// way 3: default in the pattern
const [bandOrDefault = 'S'] = bands
console.log('T3 default:', bandOrDefault.toLowerCase())
// way 4: if the length is really fixed, say so with a tuple type, then there is no undefined
const fixedBands: [string, string, string] = ['S', 'X', 'Ku']
const [s0] = fixedBands
console.log('T3 tuple:', s0.toLowerCase())
// an empty array shows why the check is real and not only TypeScript being annoying
const empty: string[] = []
const [nothing] = empty
console.log('T3 empty:', nothing)

// ---------- T4: optional fields and defaults ----------
type Telemetry = { temp: number; battery?: number; note?: string }
const t: Telemetry = { temp: 22 }
const { battery } = t // battery: number | undefined (optional, no default)
const { battery: batteryWithDefault = 8 } = t // number (the default removes undefined)
const { note = 'no note', temp = 0 } = t // note: string, temp: number (default on a required field changes nothing)
console.log('T4:', battery, batteryWithDefault, note, temp)
// what about null? With strictNullChecks, null is not allowed in `battery?: number` at all,
// so the default "not working for null" can only happen when the type says `number | null`.
type Nullable = { battery: number | null }
const n: Nullable = { battery: null }
const { battery: nb = 8 } = n // nb: number | null  -> the default does not remove null
console.log('T4 null:', nb)

// ---------- T5: one compile error caused by destructuring ----------
type GroundStation = { name: string; city: string }
const gs: GroundStation = { name: 'IKU-GS1', city: 'Istanbul' }
// @ts-expect-error Property 'country' does not exist on type 'GroundStation'.
const { country } = gs
console.log('T5 runtime value:', country) // it still runs and gives undefined
// fix: add it to the type as optional, and give it a default if I want a string
type GroundStationFixed = GroundStation & { country?: string }
const gsFixed: GroundStationFixed = gs
const { country: countryFixed = 'Türkiye' } = gsFixed
console.log('T5 fixed:', countryFixed)
