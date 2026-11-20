// İrem Balkuv, 2200004679
// Props and children in plain JavaScript (JSX). Run with `npx tsx js/props.jsx`.
// My components are small pieces of a ground station dashboard.
import { renderToStaticMarkup } from 'react-dom/server'

const show = (label, element) => console.log(label, renderToStaticMarkup(element))

// ---------- P1: props is ONE object ----------
function CardA(props) {
  return <section><h2>{props.title}</h2>{props.children}</section>
}
function CardB({ title, children }) {
  return <section><h2>{title}</h2>{children}</section>
}
show('P1 A:', <CardA title="Hi">text</CardA>)
show('P1 B:', <CardB title="Hi">text</CardB>)

// what React really passes: print the keys of the props object
function PropsSpy(props) {
  return <pre>{Object.keys(props).join(', ')}</pre>
}
show('P1 keys:', <PropsSpy title="Battery" unit="V">7.9</PropsSpy>)
// JSX is only a function call: <CardB title="Hi">text</CardB> is about the same as
// jsx(CardB, { title: 'Hi', children: 'text' })  -> one object, with children inside it

// ---------- P2: children is only a prop ----------
function Panel({ title, children }) {
  return <div className="panel"><b>{title}</b> {children}</div>
}
show('P2 between tags:', <Panel title="Mode">nominal</Panel>)
show('P2 as attribute:', <Panel title="Mode" children="nominal" />)
// both at the same time: the content between the tags wins
show('P2 both:', <Panel title="Mode" children="from attribute">from tags</Panel>)

// ---------- P3: what children can be ----------
function Box({ children }) {
  return <div>[{children}]</div>
}
show('P3 string:', <Box>hello</Box>)
show('P3 number:', <Box>{42}</Box>)
show('P3 zero:', <Box>{0}</Box>)
show('P3 NaN:', <Box>{NaN}</Box>)
show('P3 one element:', <Box><i>one</i></Box>)
show('P3 several:', <Box><i>a</i><i>b</i>text</Box>)
show('P3 array:', <Box>{['S', 'X', 'Ku']}</Box>)
show('P3 undefined:', <Box>{undefined}</Box>)
show('P3 null:', <Box>{null}</Box>)
show('P3 false:', <Box>{false}</Box>)
show('P3 true:', <Box>{true}</Box>)
show('P3 nothing:', <Box />)
// a function as a child is NOT rendered (React prints a warning to stderr)
show('P3 function:', <Box>{() => 'never shown'}</Box>)
// ...unless the component calls it ("render prop" through children)
function Countdown({ seconds, children }) {
  return <p>{children(seconds)}</p>
}
show('P3 function called:', <Countdown seconds={90}>{(s) => `AOS in ${s} s`}</Countdown>)
// a plain object is an error, not just "nothing"
try {
  show('P3 object:', <Box>{{ temp: 22 }}</Box>)
} catch (error) {
  console.log('P3 object error:', error.message)
}
// the classic bug with 0 and &&
const alarms = []
show('P3 && with 0:', <Box>{alarms.length && <b>alarm!</b>}</Box>)
show('P3 fixed:', <Box>{alarms.length > 0 && <b>alarm!</b>}</Box>)

// ---------- P4: separating children from the other props ----------
function Section({ title, children, ...rest }) {
  // rest has everything that is not title or children (id, className, data-*, ...)
  return <section {...rest}><h3>{title}</h3>{children}</section>
}
show('P4 rest:', <Section title="GPS" id="gps" className="card" data-sat="orion">fix ok</Section>)

// order decides who wins: the LAST one wins, like in an object literal
function DefaultFirst({ children, ...rest }) {
  return <button type="button" {...rest}>{children}</button>
}
function ExplicitLast({ children, ...rest }) {
  return <button {...rest} type="button">{children}</button>
}
show('P4 default first:', <DefaultFirst type="submit">Send</DefaultFirst>)
show('P4 explicit last:', <ExplicitLast type="submit">Send</ExplicitLast>)
// same rule as plain objects:
console.log('P4 object spread:', { type: 'button', ...{ type: 'submit' } }, { ...{ type: 'submit' }, type: 'button' })

// key is not a prop: React takes it out before the component sees it
show('P4 key:', <PropsSpy key="row-1" title="Temp" />)
// reading props.key gives undefined and React warns about it
function KeyReader(props) {
  return <p>key is {String(props.key)}</p>
}
show('P4 read key:', <KeyReader key="row-1" />)
// the fix: pass the same value again under another name
function RowFixed({ rowId }) {
  return <p>row {rowId}</p>
}
show('P4 key fixed:', <RowFixed key="row-1" rowId="row-1" />)

// a component that tries to change its props
function Mutator(props) {
  props.title = 'changed'
  return <p>{props.title}</p>
}
try {
  show('P4 mutate:', <Mutator title="original" />)
} catch (error) {
  console.log('P4 mutate error:', error.message)
}

// ---------- P5: props or children? the same card twice ----------
// version 1: named slots as props
function StatusCardProps({ header, footer, value }) {
  return <article><header>{header}</header><p>{value}</p><footer>{footer}</footer></article>
}
// version 2: children only, the caller builds everything
function StatusCardChildren({ children }) {
  return <article>{children}</article>
}
show('P5 props:', <StatusCardProps header="Battery" value="7.9 V" footer="updated 10 s ago" />)
show('P5 children:', (
  <StatusCardChildren>
    <header>Battery</header>
    <p>7.9 V</p>
    <footer>updated 10 s ago</footer>
  </StatusCardChildren>
))

// ---------- P6: defaults ----------
function Badge({ level = 'info', children }) {
  return <span className={`badge ${level}`}>{children}</span>
}
show('P6 missing:', <Badge>ok</Badge>)
show('P6 undefined:', <Badge level={undefined}>ok</Badge>)
show('P6 null:', <Badge level={null}>ok</Badge>)
show('P6 empty string:', <Badge level="">ok</Badge>)

// ---------- P7 (JavaScript side): nothing checks the props ----------
// In JS this runs fine and quietly renders nothing for the wrong prop name.
// In ts/props.tsx the same mistake is a compile error.
show('P7 typo in JS:', <Badge levle="warning">typo</Badge>)
show('P7 wrong type in JS:', <Badge level={42}>number</Badge>)
