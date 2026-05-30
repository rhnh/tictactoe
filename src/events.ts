import {reRender} from "./render"
import type {PieceValue, State} from "./types"
import {
  getColumn,
  getDiagonalDown,
  getDiagonalUp,
  getKeyFromPosition,
  getPositionFromBound,
  getRow,
  getWinner,
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
    reRender(state)(key, value)

    if (
      getWinner(state)(getColumn(state.pieces)(key)) ||
      getWinner(state)(getDiagonalUp(3)) ||
      getWinner(state)(getDiagonalDown(3)) ||
      getWinner(state)(getRow(state.pieces)(key))
    ) {
      state.turn = switchPlayer(state.turn)
      console.log("winner", state.turn)
      state.gameState = "over"
    }
  })

  return state
}
