import {
  files,
  ranks,
  type Key,
  type Pieces,
  type Position,
  type State,
  type Turn,
} from "./types"

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
  Math.random() > 0.5 ? "playerOne" : "playerTwo"

export const getPositionFromBound =
  (state: State) =>
  (p: Position): Position => {
    const x = Math.floor(p[0] / (state.bounds().width / 3))
    const y = Math.floor(p[1] / (state.bounds().width / 3))

    return [x, y]
  }

export const getKeyFromPosition = (p: Position) =>
  allKeys[Math.abs(3 * p[0] + p[1])]

export const switchPlayer = (turn: Turn) =>
  turn === "playerOne" ? "playerTwo" : "playerOne"

export const getRow = (pieces: Pieces) => (key: Key) => {
  const keys: Key[] = []

  for (const [k, _] of pieces) {
    if (k[0] === key[0]) keys.push(k)
  }
  return keys
}

export const getColumn = (pieces: Pieces) => (key: Key) => {
  const keys: Key[] = []

  for (const [k, _] of pieces) {
    if (k[1] === key[1]) keys.push(k)
  }
  return keys
}

export const getDiagonalDown = (n: number) => {
  const keys: Key[] = []
  for (let i = 0; i < n; i++) {
    const key = (String.fromCharCode(i + 97) +
      String.fromCharCode(49 + i)) as Key
    keys.push(key)
  }
  return keys
}
export const getDiagonalUp = (n: number) => {
  const keys: Key[] = []
  let x = n - 1
  for (let i = 0; i < n; i++) {
    const key = (String.fromCharCode(97 - (i - x)) +
      String.fromCharCode(49 - (i - x))) as Key
    keys.push(key)
  }
  return keys
}

export const getWinner =
  (state: State) =>
  (keys: Key[]): Turn | undefined => {
    const {pieces} = state

    const x = keys
      .map((a) => {
        return pieces.get(a) === "x"
      })
      .filter((r) => r === true).length

    const o = keys
      .map((a) => {
        return pieces.get(a) === "o"
      })
      .filter((r) => r === true).length
    if (x === 3) return state.turn
    if (o === 3) return state.turn
  }
