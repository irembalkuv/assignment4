// İrem Balkuv, 2200004679
// Array destructuring (forms 1 to 4). Plain JavaScript: run with `node js/arrays.mjs`.
// My data: my study playlist and the satellite passes we track in the İKÜSAT team.

// Form 1: take values out of an array by position.
function minMax(numbers) {
  return [Math.min(...numbers), Math.max(...numbers)]
}
const [lowest, highest] = minMax([4, 9, 2])
console.log('form 1:', lowest, highest)

// my own version: a function that returns [elevation, azimuth] for an antenna
function pointAntenna(passId) {
  // fake numbers, but the shape is like our ORION tests
  if (passId === 'P-07') return [38.5, 212]
  return [0, 0]
}
const [elevation, azimuth] = pointAntenna('P-07')
console.log('form 1:', 'elevation', elevation, 'azimuth', azimuth)
// same thing without destructuring:
// const result = pointAntenna('P-07'); const elevation = result[0]; const azimuth = result[1]

// a missing position just becomes undefined, no error
const [onlyOne, notThere] = ['Gesi Bağları']
console.log('form 1 (missing):', onlyOne, notThere)

// Form 2: skip an item and collect the rest, [, second, ...others]
const playlist = ['Gesi Bağları', 'Bir Derdim Var', 'Kara Toprak', 'Nem Kaldı', 'Uzun İnce Bir Yoldayım']
const [, nowPlaying, ...upNext] = playlist
console.log('form 2:', nowPlaying)
console.log('form 2 rest:', upNext)
// two commas skip two items
const [, , third] = playlist
console.log('form 2 skip two:', third)
// rest when nothing is left is an empty array, not undefined
const [a1, a2, ...nothingLeft] = ['x', 'y']
console.log('form 2 empty rest:', a1, a2, nothingLeft)
// spread (in an expression) is the opposite job: it puts items back in
const shuffled = [...upNext, nowPlaying]
console.log('form 2 spread:', shuffled)

// Form 3: swap two variables without a temporary, [a, b] = [b, a]
let primaryBand = 'S'
let backupBand = 'X'
;[primaryBand, backupBand] = [backupBand, primaryBand]
console.log('form 3:', primaryBand, backupBand)
// the long way with a temp, for comparison:
// const tmp = primaryBand; primaryBand = backupBand; backupBand = tmp

// swapping two items inside an array works too
const queue = ['P-07', 'P-08', 'P-09']
;[queue[0], queue[2]] = [queue[2], queue[0]]
console.log('form 3 in array:', queue)

// Form 4: default values, const [a = 1] = []
const [minElevation = 10, maxElevation = 85] = []
console.log('form 4 empty:', minElevation, maxElevation)
const [startMin = 0, endMin = 15] = [3]
console.log('form 4 one given:', startMin, endMin)
const [withUndef = 'default'] = [undefined]
const [withNull = 'default'] = [null]
console.log('form 4 undefined vs null:', withUndef, withNull)
