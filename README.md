# Destructuring Field Guide

Name: İrem Balkuv  
Student number: 2200004679  
Course: SEN0415 Advanced Web Programming, Assignment 4

Bonuses claimed: **Bonus 1: LaTeX**, **Bonus 2: Depth**, **Bonus 3: Real code**, **Bonus 4: Git repository** (link at the end).

## Run

```
npm install
npm run all      # runs the JS, TS and bonus examples
npm run check    # type-checks in strict mode
npm run all > output.txt
```

I added one script to the starter: `npm run bonus` runs the two files in `bonus/`, and `npm run all` now runs it at the end. I also added `bonus/**/*.tsx` to `include` in `tsconfig.json` (see my log, entry 8, for why that was needed).

**About my data.** Most examples use things from my own life: my study playlist (Turkish folk songs), and the telemetry packets, frequency bands and ground station settings from the İKÜSAT / ORION project that I work on for TEKNOFEST. The numbers are made up but the shapes are close to what we really use.

**How to read the entries.** Every output in this file is copied from `output.txt`. Where I write "as plain assignments" I mean the same code written one line per variable without destructuring. Thinking of it that way helped me more than anything else.

---

## Field guide

### Form 1: values by position, `const [x, y] = f()`

**Syntax:** `const [elevation, azimuth] = pointAntenna('P-07')`

**Example** (from `js/arrays.mjs`):

```js
function pointAntenna(passId) {
  if (passId === 'P-07') return [38.5, 212]
  return [0, 0]
}
const [elevation, azimuth] = pointAntenna('P-07')
console.log('form 1:', 'elevation', elevation, 'azimuth', azimuth)

const [onlyOne, notThere] = ['Gesi Bağları']
console.log('form 1 (missing):', onlyOne, notThere)
```

**Output:**

```
form 1: elevation 38.5 azimuth 212
form 1 (missing): Gesi Bağları undefined
```

**As plain assignments:** `const result = pointAntenna('P-07'); const elevation = result[0]; const azimuth = result[1]`

**Use it when:** a function returns a few values that always come in the same order (like `useState` and `useReducer` in React, which return `[value, setter]`).

**Watch out:** the names mean nothing to JavaScript, only the position does. If I write `const [azimuth, elevation]` by mistake, nothing complains and the values are swapped (see pitfall 5). A position that does not exist is just `undefined`, there is no error.

### Form 2: skip and collect the rest, `const [, second, ...others] = list`

**Syntax:** `const [, nowPlaying, ...upNext] = playlist`

**Example** (from `js/arrays.mjs`):

```js
const playlist = ['Gesi Bağları', 'Bir Derdim Var', 'Kara Toprak', 'Nem Kaldı', 'Uzun İnce Bir Yoldayım']
const [, nowPlaying, ...upNext] = playlist
console.log('form 2:', nowPlaying)
console.log('form 2 rest:', upNext)
const [, , third] = playlist
console.log('form 2 skip two:', third)
const [a1, a2, ...nothingLeft] = ['x', 'y']
console.log('form 2 empty rest:', a1, a2, nothingLeft)
const shuffled = [...upNext, nowPlaying]
console.log('form 2 spread:', shuffled)
```

**Output:**

```
form 2: Bir Derdim Var
form 2 rest: [ 'Kara Toprak', 'Nem Kaldı', 'Uzun İnce Bir Yoldayım' ]
form 2 skip two: Kara Toprak
form 2 empty rest: x y []
form 2 spread: [
  'Kara Toprak',
  'Nem Kaldı',
  'Uzun İnce Bir Yoldayım',
  'Bir Derdim Var'
]
```

**As plain assignments:** `const nowPlaying = playlist[1]; const upNext = playlist.slice(2)`

**Use it when:** you want the head of a list and the remaining part separately, or you do not care about the first item(s).

**Watch out:** each empty comma is one skipped position, so `[, , third]` is easy to miscount. The rest must be the last thing in the pattern. When nothing is left the rest is `[]`, never `undefined`, so you can always call `.length` on it.

**Rest vs spread:** they are the same three dots doing opposite jobs. On the *left* of `=` (in a pattern), `...upNext` *collects* many items into one new array. On the *right* (in an expression), `[...upNext, nowPlaying]` *spreads* one array out into separate items. I check which side of the `=` I am on.

### Form 3: swap, `[a, b] = [b, a]`

**Syntax:** `;[primaryBand, backupBand] = [backupBand, primaryBand]`

**Example** (from `js/arrays.mjs`):

```js
let primaryBand = 'S'
let backupBand = 'X'
;[primaryBand, backupBand] = [backupBand, primaryBand]
console.log('form 3:', primaryBand, backupBand)

const queue = ['P-07', 'P-08', 'P-09']
;[queue[0], queue[2]] = [queue[2], queue[0]]
console.log('form 3 in array:', queue)
```

**Output:**

```
form 3: X S
form 3 in array: [ 'P-09', 'P-08', 'P-07' ]
```

**As plain assignments:** `const tmp = primaryBand; primaryBand = backupBand; backupBand = tmp`

**Use it when:** swapping two variables or two array items (for example in a sort).

**Watch out:** this is assignment, not a declaration, so the variables must be `let`. The leading `;` matters because I do not use semicolons: without it, the line before and `[primaryBand, ...]` are read as one line, `let backupBand = 'X'[primaryBand, backupBand] = ...`, and I got `ReferenceError: Cannot access 'backupBand' before initialization` (log entry 6). The right side `[backupBand, primaryBand]` is a new temporary array built *before* anything is assigned, that is why it works without a temp variable.

### Form 4: array defaults, `const [a = 1, b = 2] = []`

**Syntax:** `const [minElevation = 10, maxElevation = 85] = []`

**Example** (from `js/arrays.mjs`):

```js
const [minElevation = 10, maxElevation = 85] = []
console.log('form 4 empty:', minElevation, maxElevation)
const [startMin = 0, endMin = 15] = [3]
console.log('form 4 one given:', startMin, endMin)
const [withUndef = 'default'] = [undefined]
const [withNull = 'default'] = [null]
console.log('form 4 undefined vs null:', withUndef, withNull)
```

**Output:**

```
form 4 empty: 10 85
form 4 one given: 3 15
form 4 undefined vs null: default null
```

**As plain assignments:** `const startMin = arr[0] === undefined ? 0 : arr[0]`

**Use it when:** a list may be shorter than you expect and there is a sensible fallback.

**Watch out:** the default is only used when the value is exactly `undefined`. `null`, `0` and `''` are real values and they are kept. The last line of the output surprised me the first time (`null`, not `default`).

### Form 5: properties by name, `let { a, b } = t`

**Syntax:** `let { temp, battery } = packet`

**Example** (from `js/objects.mjs`):

```js
const packet = {
  id: 'PKT-0142', temp: 23.4, battery: 7.9, mode: 'nominal',
  gps: { lat: 41.0, lon: 28.8, fix: true }, readings: [512, 498, 505],
}
let { temp, battery } = packet
console.log('form 5:', temp, battery)
temp = 99
console.log('form 5 after change:', temp, packet.temp)
const { altitude } = packet
console.log('form 5 missing:', altitude)
```

**Output:**

```
form 5: 23.4 7.9
form 5 after change: 99 23.4
form 5 missing: undefined
```

**As plain assignments:** `let temp = packet.temp; let battery = packet.battery`

**Use it when:** you need a few fields of an object many times and `packet.` everywhere makes the code long.

**Watch out:** the variable name must be the same as the property name (otherwise use form 6). `let` only means the *variable* can change later; changing it does not change the object (`packet.temp` is still 23.4). A name that is not in the object is `undefined`, no error.

### Form 6: rename while you take it, `const { a: alpha } = t`

**Syntax:** `const { id: packetId, mode: flightMode } = packet`

**Example** (from `js/objects.mjs`):

```js
const { id: packetId, mode: flightMode } = packet
console.log('form 6:', packetId, flightMode)
```

**Output:** `form 6: PKT-0142 nominal`

**As plain assignments:** `const packetId = packet.id; const flightMode = packet.mode`

**Use it when:** the property name is too general (`id`, `mode`, `name`) or already used by another variable in the same scope.

**Watch out:** the left side of the colon is where the value comes *from*, the right side is the *new variable*. After this, `mode` is not a variable. I tried `console.log(mode)` and got `ReferenceError: mode is not defined` (log entry 3). In TypeScript this colon looks like a type annotation but it is not (topic T1).

### Form 7: object defaults, `const { a = 1 } = t`

**Syntax:** `const { mode = 'safe', downlinkRate = 9600 } = packet`

**Example** (from `js/objects.mjs`):

```js
const { mode = 'safe', downlinkRate = 9600 } = packet
console.log('form 7:', mode, downlinkRate)
const { antennaGain: gain = 3.5 } = packet
console.log('form 7 rename+default:', gain)
```

**Output:**

```
form 7: nominal 9600
form 7 rename+default: 3.5
```

**As plain assignments:** `const downlinkRate = packet.downlinkRate === undefined ? 9600 : packet.downlinkRate`

**Use it when:** an options object has optional settings.

**Watch out:** `mode` exists in the packet, so the default `'safe'` is ignored. Same `undefined`-only rule as form 4 (pitfall 2). When you rename and default together the order is `source: newName = default`, I had to look this up twice.

### Form 8: object rest, `const { a, ...others } = t`

**Syntax:** `const { id, gps, readings, ...summary } = packet`

**Example** (from `js/objects.mjs`):

```js
const { id, gps, readings, ...summary } = packet
console.log('form 8 id:', id)
console.log('form 8 rest:', summary)
summary.temp = -1
console.log('form 8 packet still:', packet.temp)
```

**Output:**

```
form 8 id: PKT-0142
form 8 rest: { temp: 23.4, battery: 7.9, mode: 'nominal' }
form 8 packet still: 23.4
```

**As plain assignments:** `const id = packet.id; const summary = { temp: packet.temp, battery: packet.battery, mode: packet.mode }` (but rest finds the remaining keys by itself).

**Use it when:** you want to remove some fields and pass the rest on. This is exactly what React components do with `...rest` (P4).

**Watch out:** the rest object is new, so changing `summary.temp` did not change `packet`. But it is a *shallow* copy: nested objects inside it are still shared (pitfall 4). The rest must be last: `{ ...rest, id }` gives `SyntaxError: Rest element must be last element`.

### Form 9: nested patterns, `const { p: { x }, list: [first] } = t`

**Syntax:** `const { gps: { lat, lon }, readings: [firstReading, , thirdReading] } = packet`

**Example** (from `js/objects.mjs`):

```js
const {
  gps: { lat, lon },
  readings: [firstReading, , thirdReading],
} = packet
console.log('form 9:', lat, lon, firstReading, thirdReading)

const station = { name: 'IKU-GS1' }
const { location: { city = 'unknown' } = {} } = station
console.log('form 9 nested default:', city)
```

**Output:**

```
form 9: 41 28.8 512 505
form 9 nested default: unknown
```

**As plain assignments:** `const lat = packet.gps.lat; const lon = packet.gps.lon; const firstReading = packet.readings[0]; const thirdReading = packet.readings[2]`

**Use it when:** you need one or two values from deep inside a structure, like a GPS fix inside a telemetry packet.

**Watch out:** in `gps: { lat, lon }` the word `gps` is only a path, it does *not* create a variable `gps`. If the middle object is missing, `const { location: { city } } = station` throws `TypeError: Cannot read properties of undefined (reading 'city')`, because it tries to read `city` from `undefined`. The fix is the `= {}` after the inner pattern. Deep patterns get hard to read fast (Bonus 2, D4).

### Form 10: computed key, `const { [key]: value } = t`

**Syntax:** `const { [field]: value } = packet`

**Example** (from `js/objects.mjs`):

```js
const field = 'battery'
const { [field]: value } = packet
console.log('form 10:', field, '=', value)
for (const name of ['temp', 'mode']) {
  const { [name]: v } = packet
  console.log('form 10 loop:', name, v)
}
```

**Output:**

```
form 10: battery = 7.9
form 10 loop: temp 23.4
form 10 loop: mode nominal
```

**As plain assignments:** `const value = packet[field]`

**Use it when:** the property name is only known at run time (from a list, a form field, a user choice).

**Watch out:** you *must* rename (`: value`), because there is no fixed name to use as the variable name. Honestly `packet[field]` is shorter for one value; the computed key is nicer when it is combined with other properties or with `...rest` in the same pattern (for example removing one dynamic key: `const { [field]: _, ...others } = packet`).

### Form 11: patterns in parameters, `function f({ a = 1, b } = {})`

**Syntax:** `function schedulePass({ satellite, minElevation = 10, band = 'S' } = {})`

**Example** (from `js/params.mjs`):

```js
function schedulePass({ satellite, minElevation = 10, band = 'S' } = {}) {
  return `${satellite ?? '(no satellite)'} on ${band}-band above ${minElevation} deg`
}
console.log('form 11:', schedulePass({ satellite: 'ORION-TEST', band: 'Ku' }))
console.log('form 11 no args:', schedulePass())

function schedulePassNoDefault({ satellite }) { return satellite }
try { schedulePassNoDefault() } catch (error) { console.log('form 11 no = {}:', error.message) }

const toText = ([lat, lon]) => `${lat.toFixed(2)}N ${lon.toFixed(2)}E`
console.log('form 11b:', toText([41.0364, 28.8582]))
```

**Output:**

```
form 11: ORION-TEST on Ku-band above 10 deg
form 11 no args: (no satellite) on S-band above 10 deg
form 11 no = {}: Cannot destructure property 'satellite' of 'undefined' as it is undefined.
form 11b: 41.04N 28.86E
```

**As plain assignments:** `function schedulePass(options) { if (options === undefined) options = {}; const satellite = options.satellite; ... }`

**Use it when:** a function has several optional settings. The caller can give them in any order and by name, which is much clearer than `schedulePass('ORION-TEST', undefined, 'Ku')`.

**Watch out:** there are two different defaults here. `minElevation = 10` is used when that *field* is missing. The `= {}` at the end is used when the *whole argument* is missing. Without the second one, calling with no argument tries to destructure `undefined` and throws (third output line). Every React component written as `function Card({ title, children })` is this form (P1).

### Form 12: patterns in loops, `for (const [k, v] of Object.entries(o))`

**Syntax:** `for (const [band, mhz] of bands)`

**Example** (from `js/params.mjs`):

```js
const batteryLog = { mon: 8.1, tue: 7.9, wed: 7.6 }
for (const [day, volts] of Object.entries(batteryLog)) {
  console.log('form 12 object:', day, volts)
}
const bands = new Map([['S', 2200], ['X', 8400], ['Ku', 12000]])
for (const [band, mhz] of bands) {
  console.log('form 12 map:', band, '->', mhz, 'MHz')
}
const sensors = [{ name: 'IMU', ok: true }, { name: 'GPS', ok: false }]
for (const { name, ok } of sensors) {
  console.log('form 12 objects:', name, ok ? 'OK' : 'FAIL')
}
for (const [i, song] of ['Kara Toprak', 'Nem Kaldı'].entries()) {
  console.log('form 12 index:', i, song)
}
```

**Output:**

```
form 12 object: mon 8.1
form 12 object: tue 7.9
form 12 object: wed 7.6
form 12 map: S -> 2200 MHz
form 12 map: X -> 8400 MHz
form 12 map: Ku -> 12000 MHz
form 12 objects: IMU OK
form 12 objects: GPS FAIL
form 12 index: 0 Kara Toprak
form 12 index: 1 Nem Kaldı
```

**As plain assignments:** `for (const entry of Object.entries(batteryLog)) { const day = entry[0]; const volts = entry[1]; ... }`

**Use it when:** looping over an object's key/value pairs, a Map, an array of objects, or an array with its index.

**Watch out:** a plain object is not iterable, so `for (const [k, v] of batteryLog)` fails; you need `Object.entries` first. A Map *is* iterable and gives `[key, value]` pairs directly. `for...in` is a different loop that only gives keys (Bonus 2, D3).

---

## Pitfalls

All from `js/pitfalls.mjs`.

**Pitfall 1: destructuring `undefined` or `null` throws.**

```js
function lastPacket(visible) { return visible ? { temp: 22 } : null }
const { temp } = lastPacket(false)
```

```
pitfall 1: TypeError
pitfall 1: Cannot destructure property 'temp' of 'lastPacket(...)' as it is null.
```

*Why:* a pattern reads properties from the value, and `null` / `undefined` are the only two values that have no properties at all (even `5` or `'abc'` can be read, they get wrapped in an object). Fix: a default (`= {}`) or check the value first.

**Pitfall 2: a default only works for `undefined`, not `null`.**

```js
const fromSensor = { temp: null, battery: undefined }
const { temp = 20, battery = 8 } = fromSensor
const safeTemp = fromSensor.temp ?? 20
```

```
pitfall 2: temp = null | battery = 8
pitfall 2 fix with ??: 20
```

*Why:* the language rule is "use the default if the value is `undefined`" (a strict `=== undefined` check), and `null` counts as a value someone put there on purpose. Our sensor code sends `null` when a reading fails, so this one matters for me. Fix: `??` treats both `null` and `undefined` as missing.

**Pitfall 3: assignment without `const`/`let` needs parentheses.**

```js
let mode
const config = { mode: 'safe' }
eval('{ mode } = config')   // shown with eval so the file still runs
;({ mode } = config)
```

```
pitfall 3: SyntaxError: Unexpected token '='
pitfall 3 with ( ): safe
```

*Why:* when a statement starts with `{`, JavaScript reads it as a block of code, not an object, so `= config` after a block makes no sense to the parser. The parentheses force it to be an expression. I had to use `eval` here: if I write the wrong line directly, the *whole file* fails to parse and none of the other pitfalls run (log entry 2).

**Pitfall 4: it copies references, not objects.**

```js
const original = { name: 'IKU-GS1', location: { city: 'Istanbul' } }
const { location, ...copy } = original
location.city = 'Ankara'
console.log('pitfall 4:', original.location.city)
const shallow = { ...original }
console.log('pitfall 4 same object?', shallow.location === original.location)
const deep = structuredClone(original)
console.log('pitfall 4 structuredClone same?', deep.location === original.location)
```

```
pitfall 4: Ankara
pitfall 4 same object? true
pitfall 4 structuredClone same? false
```

*Why:* a variable holding an object holds a reference to it, and destructuring just copies that reference into a new variable, so `location` and `original.location` are the same object in memory. This is also why in React/reducers you cannot "copy with destructuring" and then change nested things.

**Pitfall 5: order matters in arrays, not in objects.**

```js
const { amps, volts } = { volts: 7.9, amps: 0.4 }
const [ampsWrong, voltsWrong] = [7.9, 0.4]
```

```
pitfall 5 object: 7.9 0.4
pitfall 5 array: amps = 7.9 volts = 0.4 (wrong way round)
```

*Why:* object patterns match by name (it looks up the key), array patterns match by position (it takes the 1st, 2nd... item from the iterator). The names in an array pattern are only labels I chose, so the computer cannot tell they are wrong. This is a reason to return an object, not an array, when a function returns more than two or three things.

**Pitfall 6 (extra): an array pattern needs an iterable.**

```js
const [x] = { 0: 'a' }
```

```
pitfall 6: {(intermediate value)} is not iterable
```

*Why:* an array pattern does not read `[0]`, `[1]`, it asks the value for its iterator (`Symbol.iterator`) and a plain object has none. I explored this further in Bonus 2, D1.

---

## Props and children

All code is in `js/props.jsx` (JavaScript) and `ts/props.tsx` (TypeScript), rendered with `renderToStaticMarkup`. My components are small pieces of a ground station dashboard.

### P1: props is one object

```jsx
function CardA(props) {
  return <section><h2>{props.title}</h2>{props.children}</section>
}
function CardB({ title, children }) {
  return <section><h2>{title}</h2>{children}</section>
}
function PropsSpy(props) {
  return <pre>{Object.keys(props).join(', ')}</pre>
}
show('P1 keys:', <PropsSpy title="Battery" unit="V">7.9</PropsSpy>)
```

```
P1 A: <section><h2>Hi</h2>text</section>
P1 B: <section><h2>Hi</h2>text</section>
P1 keys: <pre>title, unit, children</pre>
```

React calls my component with exactly one argument, an object. `<PropsSpy title="Battery" unit="V">7.9</PropsSpy>` becomes (roughly) `jsx(PropsSpy, { title: 'Battery', unit: 'V', children: '7.9' })`, and the keys printed above prove that `children` is just one more key in that object. `CardB` is **form 11** (a pattern in the parameter list) used with **form 5** (taking properties by name): `function CardB({ title, children })` means the same as `function CardB(props) { const { title, children } = props }`. There is no React magic in the braces, it is plain JavaScript destructuring.

### P2: children is only a prop

```jsx
function Panel({ title, children }) {
  return <div className="panel"><b>{title}</b> {children}</div>
}
show('P2 between tags:', <Panel title="Mode">nominal</Panel>)
show('P2 as attribute:', <Panel title="Mode" children="nominal" />)
show('P2 both:', <Panel title="Mode" children="from attribute">from tags</Panel>)
```

```
P2 between tags: <div class="panel"><b>Mode</b> nominal</div>
P2 as attribute: <div class="panel"><b>Mode</b> nominal</div>
P2 both: <div class="panel"><b>Mode</b> from tags</div>
```

The first two give identical HTML, so writing content between the tags is only nicer syntax for a prop called `children`. When I gave both, the content between the tags won and `"from attribute"` disappeared without any warning. That makes sense once you know how JSX is compiled: the attributes are put in the object first and then `children` from the tags is set at the end, so it overwrites the attribute (same as `{ ...attrs, children: tagContent }`).

### P3: what children can be

```jsx
function Box({ children }) { return <div>[{children}]</div> }
```

```
P3 string: <div>[hello]</div>
P3 number: <div>[42]</div>
P3 zero: <div>[0]</div>
P3 NaN: <div>[NaN]</div>
P3 one element: <div>[<i>one</i>]</div>
P3 several: <div>[<i>a</i><i>b</i>text]</div>
P3 array: <div>[SXKu]</div>
P3 undefined: <div>[]</div>
P3 null: <div>[]</div>
P3 false: <div>[]</div>
P3 true: <div>[]</div>
P3 nothing: <div>[]</div>
P3 function: <div>[]</div>
P3 function called: <p>AOS in 90 s</p>
P3 object error: Objects are not valid as a React child (found: object with keys {temp}). If you meant to render a collection of children, use an array instead.
P3 && with 0: <div>[0]</div>
P3 fixed: <div>[]</div>
```

| children is | what appears |
|---|---|
| string, number | the text. `0` and `NaN` **are shown**, they are numbers |
| one element | the element |
| several elements / array | all of them, next to each other (`SXKu` with no spaces) |
| `undefined`, `null`, `false`, `true` | nothing. These are "empty" for React, so `cond && <X/>` works |
| a function | nothing, and React prints a warning to stderr: `Functions are not valid as a React child. This may happen if you return children instead of <children /> from render. Or maybe you meant to call this function rather than return it.` |
| a function that the component *calls* | whatever it returns (`AOS in 90 s`). This is the "render prop through children" pattern |
| a plain object | an **error** (thrown), not just nothing |

The surprise for me was `0`: `alarms.length && <b>alarm!</b>` printed a `0` on the page, because `0 && x` gives `0` and React shows numbers. The fix is to make the condition a real boolean: `alarms.length > 0 && ...`. Also the function case does not throw, it just warns and shows nothing, which is easy to miss because the warning goes to stderr and is not in `output.txt`.

### P4: separating children from the rest

```jsx
function Section({ title, children, ...rest }) {
  return <section {...rest}><h3>{title}</h3>{children}</section>
}
show('P4 rest:', <Section title="GPS" id="gps" className="card" data-sat="orion">fix ok</Section>)

function DefaultFirst({ children, ...rest }) {
  return <button type="button" {...rest}>{children}</button>
}
function ExplicitLast({ children, ...rest }) {
  return <button {...rest} type="button">{children}</button>
}
show('P4 default first:', <DefaultFirst type="submit">Send</DefaultFirst>)
show('P4 explicit last:', <ExplicitLast type="submit">Send</ExplicitLast>)
console.log('P4 object spread:', { type: 'button', ...{ type: 'submit' } }, { ...{ type: 'submit' }, type: 'button' })
```

```
P4 rest: <section id="gps" class="card" data-sat="orion"><h3>GPS</h3>fix ok</section>
P4 default first: <button type="submit">Send</button>
P4 explicit last: <button type="button">Send</button>
P4 object spread: { type: 'submit' } { type: 'button' }
```

The pattern `{ title, children, ...rest }` is **form 5 + form 8**: I take out the props my component uses itself, and `rest` gets everything else (`id`, `className`, `data-sat`). Then `{...rest}` on the `<section>` is *spread* (the opposite job, it puts the fields back as attributes). Notice that `title` is not on the `<section>`: it was taken out, so it is not in `rest`.

**Who wins:** JSX attributes are evaluated left to right like an object literal, so the **last one wins**. In `DefaultFirst`, `type="button"` is a default that the caller can override (caller sent `submit`, and `submit` won). In `ExplicitLast`, my `type="button"` comes after the spread, so the caller *cannot* override it. The last line shows it is the exact same rule as plain object spread. So the order is a design decision: "default you may change" vs "fixed, you may not change".

**`key` is not a prop:**

```
P4 key: <pre>title</pre>
P4 read key: <p>key is undefined</p>
P4 key fixed: <p>row row-1</p>
```

I passed `key="row-1"` and `title`, but the component only got `title`. When I read `props.key` React warned on stderr: ``KeyReader: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop.`` React takes `key` out of the object before calling the component, because `key` is for React itself (to match list items between renders), not for my code. The fix is to pass the same value again with another name (`rowId`).

**A component that changes its props:**

```
P4 mutate error: Cannot assign to read only property 'title' of object '#<Object>'
```

In development mode React freezes the props object (`Object.freeze`), so `props.title = 'changed'` throws. Props are input, a component should treat them as read only. If I need a changed value I make a new variable (`const shown = title.toUpperCase()`).

### P5: props or children?

```jsx
function StatusCardProps({ header, footer, value }) {
  return <article><header>{header}</header><p>{value}</p><footer>{footer}</footer></article>
}
function StatusCardChildren({ children }) {
  return <article>{children}</article>
}
```

```
P5 props: <article><header>Battery</header><p>7.9 V</p><footer>updated 10 s ago</footer></article>
P5 children: <article><header>Battery</header><p>7.9 V</p><footer>updated 10 s ago</footer></article>
```

Same HTML, two very different components.

- **Props version (named slots):** the component decides the structure and the order. Every status card on our dashboard will look the same, and the caller cannot forget the footer or put it in the wrong place. In TypeScript I can make `header` required. Good for things that must be consistent (status tiles, table rows like `TaskRow` from Assignment 3).
- **Children version:** the component only gives the frame, the caller decides everything inside. It is more flexible (I can put a chart or two values inside) but nothing stops a caller from building a broken card. Good for layout wrappers like `Card`, `Modal`, `Panel`.

My rule: if I can name the parts and they are always the same, props; if the inside is free content, children. Mixing is fine and common: `<Card title="GPS">...free content...</Card>`.

### P6: defaults

```jsx
function Badge({ level = 'info', children }) {
  return <span className={`badge ${level}`}>{children}</span>
}
```

```
P6 missing: <span class="badge info">ok</span>
P6 undefined: <span class="badge info">ok</span>
P6 null: <span class="badge null">ok</span>
P6 empty string: <span class="badge ">ok</span>
```

This is **form 7** inside **form 11**. Missing and `undefined` are the same thing for a default, so both get `info`. `null` skips the default and the class literally becomes the text `"null"`, so on the screen the badge would lose its style (there is no `.null` CSS class). An empty string also skips it. In my real code this happens when a value comes from an API that sends `null`, so I would write `level ?? 'info'` inside the component if `null` is possible. In TypeScript `level={null}` is a compile error unless I put `| null` in the type (see `ts/props.tsx`, output `P6 null allowed: <span class="badge null">ok</span>`).

### P7: types for props and children

From `ts/props.tsx`:

```tsx
// 1) children?: ReactNode written by hand
type NoteProps = { author: string; children?: ReactNode }
function Note({ author, children }: NoteProps) { ... }

// 2) PropsWithChildren adds children?: ReactNode for me
type LabelBox = PropsWithChildren<{ label: string }>
function Labeled({ label, children }: LabelBox) { ... }

// 3) ComponentProps<'button'>: everything a real <button> accepts
function TxButton({ children, ...rest }: ComponentProps<'button'>) {
  return <button className="tx" {...rest}>{children}</button>
}
```

```
P7 ReactNode: <blockquote>telemetry looks fine - İrem</blockquote>
P7 PropsWithChildren: <div><b>Temp:</b> 23.4 C</div>
P7 no children is ok: <div><b>Temp:</b> </div>
P7 ComponentProps: <button class="tx" type="submit" disabled="" aria-label="send command">Send</button>
```

| type | what it allows | what the compiler rejects (real messages) |
|---|---|---|
| `children?: ReactNode` | strings, numbers, elements, arrays, `null`, `undefined`, booleans | a function child: `error TS2322: Type '() => string' is not assignable to type 'ReactNode'.` |
| `PropsWithChildren<P>` | P plus optional children (in `@types/react` it is literally `P & { children?: ReactNode \| undefined }`) | still checks P: `<Labeled>no label</Labeled>` gives `error TS2741: Property 'label' is missing in type '{ children: string; }' but required in type '{ label: string; }'.` |
| `ComponentProps<'button'>` | every real button attribute, including `children`, `onClick`, `disabled`, `aria-*` | a wrong value: `error TS2820: Type '"submitt"' is not assignable to type '"button" \| "submit" \| "reset" \| undefined'. Did you mean '"submit"'?` and an unknown prop: `Property 'wrong' does not exist on type 'IntrinsicAttributes & ClassAttributes<HTMLButtonElement> & ButtonHTMLAttributes<HTMLButtonElement>'.` |
| a props type *without* children | no content between tags | `error TS2339: Property 'children' does not exist on type 'P'.` |
| `children: (s: number) => string` | only a function child | text: `error TS2747: 'Countdown' components don't accept text as child elements. Text in JSX has the type 'string', but the expected type of 'children' is '(s: number) => string'.` |

The JavaScript file has no checking at all: `<Badge levle="warning">` (typo) rendered `class="badge info"` and `level={42}` rendered `class="badge 42"`, both silently. That is the main reason I would use TypeScript for components: the typo bugs in P6/P7 are found before running anything. I could not leave the rejected lines in the TS file (the only allowed `@ts-expect-error` is in T5), so I tried them, copied the messages from `npm run check`, and kept them as comments.

---

## TypeScript topics (T1 to T5)

All in `ts/types.ts`.

**T1: in a pattern, `{ a: string }` is a rename, not a type.** My first try was `function show({ name: string, freq: number })`, and tsc said `error TS7031: Binding element 'string' implicitly has an 'any' type.` and `error TS2304: Cannot find name 'freq'.` It made variables called `string` and `number`! The type always goes **after the whole pattern**: `function describeStation({ name, elevation }: Station)`. Rename and type together: `({ name: stationName }: Station)`.

```
T1 correct: IKU-GS1 at 120 m
T1 rename + type: iku-gs1
```

**T2: tuple return types and `as const`.** Without a return type, `return [23.4, 'nominal']` is inferred as `(string | number)[]`, so after `const [a, b] = readLoose()` both are `string | number | undefined` (I proved it: assigning `a` to a `number` gives `error TS2322: Type 'string | number | undefined' is not assignable to type 'number'.`). Runtime is fine (`T2 loose: number string`), only the types are lost. With `(): [number, string]` each position keeps its own type. `as const` makes a `readonly` tuple of *literal* types: `const [posLat] = [41.03, 28.85] as const` gives `posLat` the type `41.03`, not `number`, and `pos[0] = 5` gives `error TS2540: Cannot assign to '0' because it is a read-only property.` This is how a custom hook can return `[value, setter]` like `useState` does.

**T3: `noUncheckedIndexedAccess`.** With `const bands: string[]`, `const [firstBand] = bands` has type `string | undefined`, and `firstBand.toLowerCase()` gives `error TS18048: 'firstBand' is possibly 'undefined'.` This is not TypeScript being annoying, the array really could be empty (`T3 empty: undefined`). Four ways I used: an `if` check, `?.`, a default in the pattern (`const [b = 'S'] = bands`), or a real tuple type when the length is known.

**T4: optional fields and defaults.** For `type Telemetry = { temp: number; battery?: number; note?: string }`:

| pattern | type of the variable |
|---|---|
| `const { battery } = t` | `number \| undefined` |
| `const { battery: b = 8 } = t` | `number` (the default removes `undefined`) |
| `const { temp = 0 } = t` | `number` (default on a required field changes nothing) |
| `const { battery: nb = 8 } = n` with `battery: number \| null` | `number \| null` (the default does **not** remove `null`) |

The last row is pitfall 2 seen by the compiler: TypeScript knows the default only covers `undefined`, so `null` stays in the type.

**T5: a compile error caused by destructuring.**

```ts
type GroundStation = { name: string; city: string }
// @ts-expect-error Property 'country' does not exist on type 'GroundStation'.
const { country } = gs
```

Without the comment: `error TS2339: Property 'country' does not exist on type 'GroundStation'.` In plain JS this line would just give `undefined` (`T5 runtime value: undefined`). Fix: add the field to the type as optional and give it a default: `const { country: countryFixed = 'Türkiye' } = gsFixed` gives `T5 fixed: Türkiye`.

---

## JavaScript vs TypeScript

| Form | Same in TS | What I must add | Error when wrong |
|---|---|---|---|
| 1 `const [x, y] = f()` | the pattern | a tuple return type `[number, number]` | without it items become `string \| number \| undefined`: `TS2322 Type 'string \| number \| undefined' is not assignable to type 'number'` |
| 2 `[, b, ...rest]` | the pattern | nothing, but with `string[]` the item is `string \| undefined` | `TS18048 'first' is possibly 'undefined'` |
| 3 swap | the pattern | both variables need compatible types | swapping a `'S' \| 'X'` with a `number`: `TS2322 Type 'number' is not assignable to type '"S" \| "X"'` |
| 4 array defaults | the pattern | nothing, the default narrows the type to `number` | none, defaults are the fix for TS18048 |
| 5 `{ a, b } = t` | the pattern | a type on the object (here `Packet`) | unknown key: `TS2339 Property 'b' does not exist on type '{ a: number; }'` |
| 6 rename | the pattern | nothing (type comes from the object) | writing the type inside the pattern: `TS7031 Binding element 'string' implicitly has an 'any' type` |
| 7 object defaults | the pattern | the field must be optional (`?`) in the type | reading an optional field without a default: `TS18048 'elevation' is possibly 'undefined'` |
| 8 object rest | the pattern | nothing, TS computes the rest type | none, rest type is inferred |
| 9 nested | the pattern | array items inside need a default or check | `TS18048` on the inner array item |
| 10 computed key | the pattern | the key needs a key type (`'temp' \| 'battery'`), not `string` | value type is a union of the possible fields |
| 11 parameters | the pattern | `pattern: Type = default`, the type after the whole pattern | `TS7031 ... implicitly has an 'any' type` when there is no type |
| 12 loops | the pattern | a typed Map or Record | `Object.entries` keys are only `string`: `TS2322 Type 'string' is not assignable to type '"mon" \| "tue"'` |

---

## My own log

Real things that went wrong or surprised me while doing this, in the order they happened.

1. **Destructuring `null`.** First test with my packet function: `const { sensor } = null` gave `TypeError: Cannot destructure property 'sensor' of 'null' as it is null.` I expected `undefined` like a missing property. Learned: missing *property* is fine, missing *object* is not.
2. **The parentheses one took the whole file down.** I wrote `{ a, b } = obj` (I had `let a, b` above it) and got `SyntaxError: Unexpected token '='`. When I tried to show it in `pitfalls.mjs` the *whole file* stopped, not only that line, because a syntax error happens before anything runs. That is why pitfall 3 uses `eval`.
3. **Renamed and then used the old name.** `const { title: name } = song; console.log(title)` gave `ReferenceError: title is not defined`. I was reading the colon as "title is of type name". Now I read it as "take title, call it name".
4. **Array pattern on an object.** `const [a, b] = { a: 1, b: 2 }` gave `TypeError: {(intermediate value)(intermediate value)} is not iterable`. I thought it would use the order of the keys. It does not look at keys at all, it needs an iterator. This made me try the spy iterator in Bonus 2.
5. **Rest in the wrong place.** `const { ...rest, id } = { id: 1 }` gave `SyntaxError: Rest element must be last element`. Obvious after reading it, but I wrote it naturally because in *spread* (`{ ...defaults, id }`) the order is free.
6. **Swap without a semicolon.** I wrote the swap the way I write everything, with no `;` at the start: `[primaryBand, backupBand] = [backupBand, primaryBand]` right after `let backupBand = 'X'`. Result: `ReferenceError: Cannot access 'backupBand' before initialization`. It took me a while to see that JavaScript joined it with the line above. Now I always start a line that begins with `[` or `(` with `;`.
7. **T1, types in the pattern.** `function show({ name: string, freq: number })` gave `error TS7031: Binding element 'string' implicitly has an 'any' type.` This was my wrong guess exactly as the handout predicted.
8. **`ReferenceError: React is not defined` (twice).** First in a test file outside the project folder, then again with `bonus/types.tsx`. Both times the file was not in the `include` of `tsconfig.json`, so `tsx` did not use `"jsx": "react-jsx"` and compiled JSX to the old `React.createElement`. Fix: add `bonus/**/*.tsx` to `include`. The second time I recognised it from the troubleshooting table.
9. **`0` on the screen.** `{alarms.length && <b>alarm!</b>}` rendered `<div>[0]</div>`. I thought empty means nothing. React hides `false`/`null`/`undefined` but shows numbers.
10. **Children twice.** I expected an error or a warning for `<Panel children="from attribute">from tags</Panel>`. Nothing, the tag content silently won.
11. **`key` disappeared.** My `PropsSpy` printed only `title` although I passed `key` too, and reading `props.key` gave the "`key` is not a prop" warning. Learned that React removes it.
12. **Props are frozen.** `props.title = 'changed'` threw `Cannot assign to read only property 'title' of object '#<Object>'`. I thought it would just not re-render, not throw.
13. **Turkish letters.** In `ts/arrays.ts` I printed `nowPlaying?.toUpperCase()` and got `BIR DERDIM VAR`, not `BİR DERDİM VAR`. Not a destructuring problem, but it happened inside my form 2 example. `toLocaleUpperCase('tr-TR')` fixes it. (Also `'İKÜSAT'` split correctly letter by letter in Bonus 2, D1.)
14. **What I changed my mind about.** At first I thought `const [a = 1] = [null]` would give 1, and that `{ a, ...rest }` makes a full copy. Both wrong (pitfalls 2 and 4). And I thought `<Box>{() => 'x'}</Box>` would crash: it only warns on stderr and renders nothing.

---

## Bonus 1: LaTeX

The whole guide is also in `latex/guide.pdf` (22 pages): a title page, a linked table of contents, all code typeset with the `listings` package in one style (JS/TS keywords coloured), and real `longtable` tables. `latex/guide.tex` is the main file I wrote (preamble, fonts, code style, title page). The body, `latex/body.tex`, is generated from this README with pandoc, so the PDF is never a shorter copy: it is the same guide.

Commands (from the `latex/` folder):

```
sh build.sh
```

`build.sh` does: pandoc README.md to `body.tex` (with `--listings`), then `python3 fixtables.py body.tex`, then `xelatex guide.tex` twice (the second run fills in the contents page). Things I had to fix to get a clean build:

- I started with LuaLaTeX, but its font loader failed on this machine (`Error in luaotfload: reverting to OT1`), so I use XeLaTeX with the DejaVu fonts (they have all the Turkish letters).
- My first `\setmainfont{DejaVu Serif}[Scale=0.92]` gave `! Missing number, treated as zero.` The installed fontspec wants the old order: `\setmainfont[Scale=0.92]{DejaVu Serif}`.
- The `postbreak` arrow for broken code lines also caused `! Missing number` errors together with `breaklines`, so I removed it.
- `listings` does not like letters above 255 like `İ`: `\lstinline!BİR DERDİM VAR!` gave `! Undefined control sequence.` Fixed with `literate={İ}{{\.{I}}}1 ...` for İ, ı, ğ, ş.
- pandoc wrote the tables as `ll` columns, so they ran off the page (`Overfull \hbox (1701.01451pt too wide)`). `fixtables.py` gives every table real `p{}` column widths. The final build has **0 errors and 0 overfull boxes**.
- The satellite emoji in Bonus 2 is not in the font, so the build replaces it with the text `[satellite emoji]`.

---

## Bonus 2: Depth

Code: `bonus/depth.mjs` and `bonus/types.tsx`, run by `npm run bonus`.

**D1. What does an array pattern really call?** I made a fake iterable that logs every call:

```js
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
const [, , , sp4, sp5] = spy
```

```
  Symbol.iterator called
  next() -> 1
  next() -> 2
  return() called (iterator closed early)
D1 spy: 1 2
  Symbol.iterator called
  next() -> 1
  next() -> 2
  next() -> 3
  next() -> 4
D1 spy past the end: undefined undefined
```

So `const [a, b] = x` is: call `x[Symbol.iterator]()`, call `next()` once per position, and if the pattern is finished before the iterator is, call `return()` to close it. In the second case the iterator said `done` on the 4th call, so `sp5` did not need another `next()` and `return()` was not called (it was already finished). This explains why any iterable works:

```
D1 string: İ K [ 'Ü', 'S', 'A', 'T' ]
D1 emoji: "🛰" length 2
D1 Set: S X
D1 Map: temp 22
```

The string iterator goes by *code point*: the satellite emoji is one item but its `.length` is 2 (two UTF-16 units), and `İ` is one item. The Set gave `S X` because duplicates were already removed. With a generator I could see laziness: `[g1, g2]` only ran the generator twice, but `[h1, ...hRest]` ran it to the end, because rest must collect everything.

Object patterns are different: they do *not* use the iterator, they just read properties, so `const { length, 0: firstSong } = [...]` works on an array (`D1 object pattern on array: 3 Kara Toprak Gesi Bağları`) and even on a string.

**D2. Order of evaluation.**

```
  default computed for b
D2 lazy default: given computed-b calls = 1
D2 earlier var: 4 8
D2 later var: ReferenceError: Cannot access 'q' before initialization
  read first
  read second
D2 getter order: 1 2
```

Defaults are lazy: `expensiveDefault('a')` never ran because `a` was given. A default can use a variable from earlier in the same pattern (`height = width * 2`), but not a later one, because the variables are created left to right and the later one is still in the temporal dead zone (same error as using a `let` before its line). The getters ran in the order of my *pattern* (`first, second`), not the order they are written in the object.

**D3. Other places.** `catch ({ name, message })` works (`D3 catch: SyntaxError - Expected property name or '}' in JSON at position 2 (line 1 column 3)`). Assignment targets can be properties: `[antenna.el, antenna.az] = [38.5, 212]` and `({ temp: cache.lastTemp } = ...)`. The strangest one: `for (const [firstLetter] in counts)` is allowed, but `for...in` gives the *key string*, so the pattern destructures the characters of the key and printed `t` and `d`. That is legal and almost certainly a bug in real code.

**D4. When it makes code worse.**

```js
const { data: { station: { config: { bands: [{ name: bandName, mhz: bandMhz }] } } } } = response
```

This works (`D4 deep pattern: S 2200`) but I had to count braces three times to write it, it hides that `bands` could be empty, and if `station` is missing the error message does not tell which level failed. The refactoring: go to the object you care about with normal property access, then destructure only one level (`const { bands } = response.data.station.config; const [mainBand] = bands`). Same output, much easier to read and debug.

**D5. Destructuring types with `infer`** (`bonus/types.tsx`):

```ts
type First<T extends readonly unknown[]> = T extends readonly [infer F, ...unknown[]] ? F : never
type Rest<T extends readonly unknown[]>  = T extends readonly [unknown, ...infer R] ? R : never
type Pass = [id: string, elevation: number, visible: boolean]
type PassTail = Rest<Pass>     // [elevation: number, visible: boolean]
type ScheduleArgs = Parameters<typeof schedule>   // [sat: string, minElevation: number, band: 'S' | 'X']
```

`[infer F, ...unknown[]]` reads exactly like the value pattern `[first, ...rest]`, but it works on types. `Parameters<F>` turns a function's parameter list into a tuple, so I could write `const [satName, , bandArg] = args` with full types. I also made a generic component `List<T>` whose children function gets the type of the items, so in `{({ name, ok }) => ...}` the destructured `name` and `ok` are typed without writing any annotation:

```
B2 First/Rest/Last: P-07 [ 38, true ] false
B2 Parameters: ORION-TEST X ORION-TEST/15/X
B2 generic component: <ul><li>IMU: OK</li><li>GPS: FAIL</li></ul>
```

---

## Bonus 3: Real code

Sources: my own Task Manager from Assignment 3 (`assignment3/src/`), the TypeScript compiler inside `node_modules` (`typescript@5.8.3`, `node_modules/typescript/lib/typescript.js`), `@types/react`, and the open-source UI library **shadcn/ui** (`apps/v4/registry/new-york-v4/ui/button.tsx`, main branch, read on 20 November 2026).

| # | Where | Code | Form | Without destructuring |
|---|---|---|---|---|
| 1 | `assignment3/src/App.tsx:82` | `const [state, dispatch] = useReducer(taskReducer, initialState)` | 1 | `const r = useReducer(...); const state = r[0]; const dispatch = r[1]` |
| 2 | `assignment3/src/TaskRow.tsx:6` | `function TaskRow({ task, onNext, onDelete }: TaskRowProps)` | 11 (+5) | `function TaskRow(props: TaskRowProps) { const task = props.task; ... }` |
| 3 | `assignment3/src/App.tsx:36` | `function FilterBar({ filter, counts, dispatch }: FilterBarProps)` | 11 (+5) | same as above with `props.filter` etc. |
| 4 | `typescript.js:18527` | `const { expression, arguments: args } = callExpression;` | 5 + 6 | `const expression = callExpression.expression; const args = callExpression.arguments;` |
| 5 | `typescript.js:4020` | `for (const [enumValue, enumName] of members) {` | 12 | `for (const m of members) { const enumValue = m[0]; const enumName = m[1]; ...` |
| 6 | `typescript.js:21324` | `const { onDeleteValue, onExistingValue } = options;` | 5 | `const onDeleteValue = options.onDeleteValue; ...` |
| 7 | `shadcn/ui button.tsx:40-49` | `function Button({ className, variant = "default", size = "default", asChild = false, ...props }: React.ComponentProps<"button"> & ...)` | 11 + 7 + 8 | `function Button(p) { const variant = p.variant ?? "default"; ...` and building the rest object by hand |

Notes:

- **Case 4** is a nice reason for form 6: `arguments` is a special word inside normal functions in JavaScript, so they rename it to `args`.
- **Case 6, worse in my opinion:** in `mutateMap` (line 21337) the same function does `const { createNewValue } = options;` a few lines after calling another function with `options`. Pulling out one property with a pattern adds nothing over `options.createNewValue`, and it is split from the first destructuring at line 21324 in a different function, so you have to look in two places to see what `options` contains. One `const { onDeleteValue, onExistingValue, createNewValue } = options` at the top of one function would be clearer.
- Interesting: in the compiled React files (`react/cjs/react.development.js`, `react-dom-server.node.development.js`) I found **zero** `const {` or `const [` lines. Their build tool rewrites the code to older JavaScript, so destructuring is turned into plain property access. Destructuring is for people reading the source, not something the engine needs.
- **Case 7 (React props):** `className`, `variant`, `size` and `asChild` are props that the Button uses itself; `props` (the rest) has everything else, including `children` (the button label) and `onClick`. So here **children is not destructured by name at all**, it travels inside the rest and is put back on the element by `{...props}` on line 58. Also important: `{...props}` comes *after* `className={...}` (P4 order rule), but it cannot override it, because `className` was already taken out of `props` by the pattern. That is a clever use of rest: removing a prop from the rest is how you make sure the caller cannot override it.
- **`@types/react` line 1430:** `type PropsWithChildren<P = unknown> = P & { children?: ReactNode | undefined };` This is where P7's `PropsWithChildren` comes from. It is just an intersection, nothing magic.
- **Assignment 3, a place where destructuring could help:** `taskReducer.ts:63` reads `tasks: state.past[state.past.length - 1]`. With `noUncheckedIndexedAccess` on (it was not on in that project) this would be `Task[] | undefined`. `const [last] = state.past.slice(-1)` reads more clearly but has the same `undefined` issue (T3), so the real fix is the length check that is already on line 60.

---

## Bonus 4: Git repository

Link: https://github.com/irembalkuv/assignment4

(The repository has the `.gitignore` from the starter, which leaves out `node_modules`. It runs after `git clone`, `npm install`, `npm run all`.)
