import {
  files,
  ranks,
  totalRanks,
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
    const x = Math.floor(p[0] / (state.bounds().width / state.totalRanks))
    const y = Math.floor(p[1] / (state.bounds().width / state.totalRanks))

    return [x, y]
  }

export const getKeyFromPosition = (p: Position) =>
  allKeys[Math.abs(totalRanks * p[0] + p[1])]

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
  for (let i = 0; i < 3; i++) {
    const key = (String.fromCharCode(99 - i) +
      String.fromCharCode(49 + i)) as Key
    keys.push(key)
  }

  return keys
}

export const getWinner =
  (state: State) =>
  (keys: Key[]): Turn | undefined => {
    const {pieces} = state

    if (
      keys.map((a) => pieces.get(a) === "x").filter((r) => r === true).length ==
        state.totalRanks ||
      keys.map((a) => pieces.get(a) === "o").filter((r) => r === true)
        .length === state.totalRanks
    )
      return state.turn
  }

export const getNextAvailableKey = (p: Pieces): Key | null => {
  for (const [k, v] of p) {
    if (v === "empty") return k
  }

  return null
}

export const getAllAvailableKeys = (p: Pieces): Key[] => {
  const keys: Key[] = []
  for (const [k, v] of p) {
    if (v === "empty") keys.push(k)
  }
  return keys
}

export const getRandomKey = (p: Pieces): Key => {
  const keys = getAllAvailableKeys(p)
  return keys[Math.floor(Math.random() * keys.length)]
}

export const isGameOver =
  (state: State) =>
  (key: Key): boolean => {
    if (
      getWinner(state)(getColumn(state.pieces)(key)) ||
      getWinner(state)(getRow(state.pieces)(key)) ||
      getWinner(state)(getDiagonalUp(state.totalRanks)) ||
      getWinner(state)(getDiagonalDown(state.totalRanks))
    ) {
      state.gameState = "over"
      return true
    }
    return false
  }
