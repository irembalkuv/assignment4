// İrem Balkuv, 2200004679
// Bonus 2: destructuring at the type level. Run with `npx tsx bonus/types.tsx`.
import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// infer pulls a type apart with a pattern, like const [first, ...rest] = list does with values
type First<T extends readonly unknown[]> = T extends readonly [infer F, ...unknown[]] ? F : never
type Rest<T extends readonly unknown[]> = T extends readonly [unknown, ...infer R] ? R : never
type Last<T extends readonly unknown[]> = T extends readonly [...unknown[], infer L] ? L : never

type Pass = [id: string, elevation: number, visible: boolean]
type PassId = First<Pass> // string
type PassTail = Rest<Pass> // [elevation: number, visible: boolean]
type PassLast = Last<Pass> // boolean

const id: PassId = 'P-07'
const tail: PassTail = [38, true]
const last: PassLast = false
console.log('B2 First/Rest/Last:', id, tail, last)

// object version: take the type of one field, like const { gps } = packet
type FieldType<T, K extends string> = T extends { [P in K]: infer V } ? V : never
type Packet = { temp: number; gps: { lat: number; lon: number } }
type Gps = FieldType<Packet, 'gps'> // { lat: number; lon: number }
const g: Gps = { lat: 41, lon: 28.8 }
console.log('B2 FieldType:', g)

// Parameters<F> gives the parameter list as a tuple, so I can destructure it with types
function schedule(sat: string, minElevation: number, band: 'S' | 'X') {
  return `${sat}/${minElevation}/${band}`
}
type ScheduleArgs = Parameters<typeof schedule> // [sat: string, minElevation: number, band: 'S' | 'X']
const args: ScheduleArgs = ['ORION-TEST', 15, 'X']
const [satName, , bandArg] = args
console.log('B2 Parameters:', satName, bandArg, schedule(...args))

// a generic React component: the type of `item` in children follows the type of `items`
type ListProps<T> = { items: T[]; children: (item: T, index: number) => ReactNode }
function List<T>({ items, children }: ListProps<T>) {
  return <ul>{items.map((item, i) => <li key={i}>{children(item, i)}</li>)}</ul>
}
const sensors = [{ name: 'IMU', ok: true }, { name: 'GPS', ok: false }]
console.log('B2 generic component:', renderToStaticMarkup(
  <List items={sensors}>{({ name, ok }) => `${name}: ${ok ? 'OK' : 'FAIL'}`}</List>,
))
