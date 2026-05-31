import {reRender} from "./render"
import type {PieceValue, State} from "./types"
import {
  getKeyFromPosition,
  getPositionFromBound,
  getRandomKey,
  isGameOver,
  switchPlayer,
} from "./utils"

export const events = (state: State): State => {
  const {board} = state
  board.addEventListener("pointerup", (e) => {
    const {clientX: x, clientY: y} = e
    if (state.gameState === "over") return
    const position = getPositionFromBound(state)([y, x])

    const key = getKeyFromPosition(position)
    if (!state.turn || state.pieces.get(key) !== "empty") return
    state.turn = switchPlayer(state.turn)

    let value = "o" as PieceValue
    if (state.turn === "playerOne") {
      value = "o"
      state.pieces.set(key, "o")
    } else {
      state.pieces.set(key, "x")
      value = "x"
    }
    state.pieces.set(key, value)
    reRender(state)(key, value)

    if (value === "o") value = "x"
    else if ((value = "x")) value = "o"
    if (isGameOver(state)(key)) return

    const random = getRandomKey(state.pieces)
    if (!random) return
    state.pieces.set(random, value)

    if (random) reRender(state)(random, value)

    state.turn = switchPlayer(state.turn)
    console.log("winner", state.turn)
    isGameOver(state)(random)
  })

  return state
}
