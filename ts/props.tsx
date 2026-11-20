// İrem Balkuv, 2200004679
// Props and children in TypeScript. Run with `npx tsx ts/props.tsx`.
import type { ComponentProps, PropsWithChildren, ReactElement, ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const show = (label: string, element: ReactElement) => console.log(label, renderToStaticMarkup(element))

type CardProps = { title: string; children?: ReactNode }

// ---------- P1: props is one object, the type goes after the whole pattern ----------
function Card({ title, children }: CardProps) {
  return <section><h2>{title}</h2>{children}</section>
}
function CardProps1(props: CardProps) {
  return <section><h2>{props.title}</h2>{props.children}</section>
}
show('P1 pattern:', <Card title="Hi">text</Card>)
show('P1 props.x:', <CardProps1 title="Hi">text</CardProps1>)

// ---------- P2: children is only a prop ----------
show('P2 between tags:', <Card title="Mode">nominal</Card>)
show('P2 as attribute:', <Card title="Mode" children="nominal" />)

// ---------- P3: what children can be (ReactNode allows all of these) ----------
function Box({ children }: { children?: ReactNode }) {
  return <div>[{children}]</div>
}
show('P3 string:', <Box>hello</Box>)
show('P3 number:', <Box>{42}</Box>)
show('P3 element:', <Box><i>one</i></Box>)
show('P3 several:', <Box><i>a</i><i>b</i></Box>)
show('P3 undefined:', <Box>{undefined}</Box>)
show('P3 null:', <Box>{null}</Box>)
show('P3 false:', <Box>{false}</Box>)
// <Box>{() => 'x'}</Box> does not compile: error TS2322: Type '() => string' is not assignable to type 'ReactNode'.
// For a function child, the type has to say so:
function Countdown({ seconds, children }: { seconds: number; children: (s: number) => string }) {
  return <p>{children(seconds)}</p>
}
show('P3 function child:', <Countdown seconds={90}>{(s) => `AOS in ${s} s`}</Countdown>)

// ---------- P4: separating children from the rest ----------
type SectionProps = { title: string; children?: ReactNode } & ComponentProps<'section'>
function Section({ title, children, ...rest }: SectionProps) {
  // rest: everything a <section> accepts, minus title and children
  return <section {...rest}><h3>{title}</h3>{children}</section>
}
show('P4 rest:', <Section title="GPS" id="gps" className="card">fix ok</Section>)

function SafeButton({ children, ...rest }: ComponentProps<'button'>) {
  return <button {...rest} type="button">{children}</button> // explicit prop last: always "button"
}
show('P4 explicit last:', <SafeButton type="submit">Send</SafeButton>)

// ---------- P5: props or children ----------
type StatusSlots = { header: ReactNode; footer?: ReactNode; value: string }
function StatusCardProps({ header, footer = 'no update yet', value }: StatusSlots) {
  return <article><header>{header}</header><p>{value}</p><footer>{footer}</footer></article>
}
function StatusCardChildren({ children }: PropsWithChildren) {
  return <article>{children}</article>
}
show('P5 props:', <StatusCardProps header="Battery" value="7.9 V" />)
show('P5 children:', (
  <StatusCardChildren>
    <header>Battery</header>
    <p>7.9 V</p>
  </StatusCardChildren>
))

// ---------- P6: defaults ----------
type BadgeProps = PropsWithChildren<{ level?: 'info' | 'warning' | 'error' }>
function Badge({ level = 'info', children }: BadgeProps) {
  // level: 'info' | 'warning' | 'error' inside (no undefined, because of the default)
  return <span className={`badge ${level}`}>{children}</span>
}
show('P6 missing:', <Badge>ok</Badge>)
show('P6 undefined:', <Badge level={undefined}>ok</Badge>)
// <Badge level={null}> does not compile: error TS2322: Type 'null' is not assignable to type '"info" | "warning" | "error" | undefined'.
// So in TS the "null skips the default" bug can only happen if I write `| null` in the type myself:
function NullableBadge({ level = 'info', children }: PropsWithChildren<{ level?: 'info' | 'warning' | null }>) {
  return <span className={`badge ${level}`}>{children}</span>
}
show('P6 null allowed:', <NullableBadge level={null}>ok</NullableBadge>)

// ---------- P7: the three types ----------
// 1) children?: ReactNode   - I write children in my own props type
type NoteProps = { author: string; children?: ReactNode }
function Note({ author, children }: NoteProps) {
  return <blockquote>{children} - {author}</blockquote>
}
show('P7 ReactNode:', <Note author="İrem">telemetry looks fine</Note>)

// 2) PropsWithChildren<P>    - adds `children?: ReactNode` to P for me
type LabelBox = PropsWithChildren<{ label: string }>
function Labeled({ label, children }: LabelBox) {
  return <div><b>{label}:</b> {children}</div>
}
show('P7 PropsWithChildren:', <Labeled label="Temp">23.4 C</Labeled>)
show('P7 no children is ok:', <Labeled label="Temp" />)

// 3) ComponentProps<'button'> - every prop a real <button> accepts (type, onClick, disabled, aria-*, children...)
function TxButton({ children, ...rest }: ComponentProps<'button'>) {
  return <button className="tx" {...rest}>{children}</button>
}
show('P7 ComponentProps:', <TxButton type="submit" disabled aria-label="send command">Send</TxButton>)

// What the compiler rejects (real messages from `npm run check`, I removed the lines after):
//  <Labeled>no label</Labeled>
//    error TS2741: Property 'label' is missing in type '{ children: string; }' but required in type '{ label: string; }'.
//  <TxButton type="submitt" />
//    error TS2820: Type '"submitt"' is not assignable to type '"button" | "submit" | "reset" | undefined'. Did you mean '"submit"'?
//  <TxButton wrong="x" />
//    error TS2322: ... Property 'wrong' does not exist on type 'IntrinsicAttributes & ClassAttributes<HTMLButtonElement> & ButtonHTMLAttributes<HTMLButtonElement>'.
//  <Countdown seconds={3}>hello</Countdown>
//    error TS2747: 'Countdown' components don't accept text as child elements. Text in JSX has the type 'string', but the expected type of 'children' is '(s: number) => string'.
//  a props type WITHOUT children, used with content between the tags:
//    error TS2339: Property 'children' does not exist on type 'P'.
