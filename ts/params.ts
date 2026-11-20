// İrem Balkuv, 2200004679
// Forms 11 and 12 in TypeScript, and the typing rules for patterns in parameters.

type TaskInput = { title: string; status?: 'todo' | 'done' }

// Form 11: the type goes after the whole pattern.
function createTask({ title, status = 'todo' }: TaskInput) {
  return { title, status }
}
console.log('form 11:', createTask({ title: 'Read' }))

type PassOptions = { satellite?: string; minElevation?: number; band?: 'S' | 'X' | 'Ku' }

// pattern : type = default. Order is fixed: the type is after the pattern, the default after the type.
function schedulePass({ satellite, minElevation = 10, band = 'S' }: PassOptions = {}): string {
  // satellite: string | undefined (no default), minElevation: number, band: 'S' | 'X' | 'Ku'
  return `${satellite ?? '(no satellite)'} on ${band}-band above ${minElevation} deg`
}
console.log('form 11:', schedulePass({ satellite: 'ORION-TEST', band: 'Ku' }))
console.log('form 11 no args:', schedulePass())

// Form 11b: array parameter typed as a tuple
const toText = ([lat, lon]: [number, number]): string => `${lat.toFixed(2)}N ${lon.toFixed(2)}E`
console.log('form 11b:', toText([41.0364, 28.8582]))
const passes: [string, number][] = [['P-07', 38], ['P-08', 12], ['P-09', 61]]
console.log('form 11b map:', passes.map(([pid, el]) => `${pid}:${el}`).join(' '))

// Form 12: loops. Object.entries gives [string, V][]; the key is just string.
const batteryLog: Record<'mon' | 'tue' | 'wed', number> = { mon: 8.1, tue: 7.9, wed: 7.6 }
for (const [day, volts] of Object.entries(batteryLog)) {
  console.log('form 12 object:', day, volts.toFixed(1)) // day: string (not 'mon' | 'tue' | 'wed')
}

const bands = new Map<'S' | 'X' | 'Ku', number>([
  ['S', 2200],
  ['X', 8400],
  ['Ku', 12000],
])
for (const [band, mhz] of bands) {
  console.log('form 12 map:', band, '->', mhz, 'MHz') // band keeps its union type here
}

type Sensor = { name: string; ok: boolean }
const sensors: Sensor[] = [{ name: 'IMU', ok: true }, { name: 'GPS', ok: false }]
for (const { name, ok } of sensors) {
  console.log('form 12 objects:', name, ok ? 'OK' : 'FAIL')
}
