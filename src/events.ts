import {reRender} from "./render"
import type {PieceValue, State} from "./types"
import {
  getKeyFromPosition,
  getPositionFromBound,
  getRow,
  switchPlayer,
} from "./utils"

export const events = (state: State): State => {
  const {board} = state
  board.addEventListener("pointerup", (e) => {
    const {clientX: x, clientY: y} = e

    const position = getPositionFromBound(state)([y, x])

    const key = getKeyFromPosition(position)
    if (!state.turn || state.pieces.get(key) !== "empty") return
    state.turn = switchPlayer(state.turn)
    console.log(getRow(state.pieces)(1))
    let value = "o" as PieceValue
    if (state.turn === "playerOne") {
      value = "o"
      state.pieces.set(key, "o")
    } else {
      state.pieces.set(key, "x")
      value = "x"
    }
    reRender(state)(key, value)
  })

  return state
}
