import { files, ranks, type Key,  type Position, type State, type Turn } from "./types"

export interface Memo<A> {
  (): A
  clear: () => void
}


export const allKeys = files
  .map((f) => ranks.map((r) => `${f}${r}` as Key))
  .flat()

  
export const keys = [...allKeys] as const



export type BoxType<T> = {
  map: (f: (t: T) => T) => BoxType<T>
  fold: (f: (t: T) => T) => T
  toString: () => void
}

export const Box = <T>(t: T): BoxType<T> => ({
  map: (f: (t: T) => T) => Box(f(t)),
  fold: (f: (t: T) => T) => f(t),
  toString: () => {
    console.log(t)
  },
})

export function memo<A>(f: () => A): Memo<A> {
  let v: A | undefined
  const ret = (): A => {
    if (v === undefined) v = f()
    return v
  }
  ret.clear = () => {
    v = undefined
  }
  return ret
}

export const id = <T>(id: T) => id

export const keyToPosition = (k: Key): Position => [
  k.charCodeAt(0) - 96,
  k.charCodeAt(1) - 48,
]


export const getRandomTurn = (): Turn => 
   (Math.random() > 0.5) ? 'playerOne': 'playerTwo'



export const getPositionFromBound =
  (state: State) =>
    (p: Position): Position => {
    console.log(p)
    const x = Math.floor(
        p[0] / (state.bounds().width/3)
    )
    const y = Math.floor(
      p[1] / ( state.bounds().width / 3)  ) 
    
    return [x, y]
  }


export const getKeyFromPosition = (p: Position) =>
  allKeys[Math.abs(3 * p[0] + p[1])]

export const switchPlayer = (turn:Turn) => turn==='playerOne' ? 'playerTwo' : 'playerOne'