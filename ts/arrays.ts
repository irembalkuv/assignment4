// İrem Balkuv, 2200004679
// The same four array forms as js/arrays.mjs, now typed. Run with `npx tsx ts/arrays.ts`.

// Form 1: the return type of the function is a tuple.
function minMax(numbers: number[]): [number, number] {
  return [Math.min(...numbers), Math.max(...numbers)]
}
const [lowest, highest] = minMax([4, 9, 2])
console.log('form 1:', lowest, highest)

// [elevation, azimuth] as a named tuple. The labels are only for reading, they do not create variables.
type Pointing = [elevation: number, azimuth: number]
function pointAntenna(passId: string): Pointing {
  if (passId === 'P-07') return [38.5, 212]
  return [0, 0]
}
const [elevation, azimuth] = pointAntenna('P-07')
console.log('form 1:', 'elevation', elevation, 'azimuth', azimuth)

// Form 2: skip and collect the rest. With a plain string[] and noUncheckedIndexedAccess,
// nowPlaying is string | undefined, because the array could be shorter.
const playlist: string[] = ['Gesi Bağları', 'Bir Derdim Var', 'Kara Toprak', 'Nem Kaldı', 'Uzun İnce Bir Yoldayım']
const [, nowPlaying, ...upNext] = playlist
console.log('form 2:', nowPlaying?.toUpperCase() ?? '(nothing playing)')
// surprise: toUpperCase() is not Turkish-aware ("Bir" -> "BIR"), the locale version gives "BİR"
console.log('form 2 tr:', nowPlaying?.toLocaleUpperCase('tr-TR') ?? '(nothing playing)')
console.log('form 2 rest:', upNext) // upNext is string[], never undefined

// Form 3: swap. Both variables must have compatible types, otherwise the swap is an error.
let primaryBand: 'S' | 'X' | 'Ku' = 'S'
let backupBand: 'S' | 'X' | 'Ku' = 'X'
;[primaryBand, backupBand] = [backupBand, primaryBand]
console.log('form 3:', primaryBand, backupBand)

// Form 4: defaults. The default removes undefined from the type: number, not number | undefined.
const limits: number[] = []
const [minElevation = 10, maxElevation = 85] = limits
console.log('form 4:', minElevation + 0, maxElevation + 0)

// with an optional tuple element
type Window = [start: number, end?: number]
const pass: Window = [3]
const [startMin, endMin = 15] = pass
console.log('form 4 optional tuple:', startMin, endMin)
