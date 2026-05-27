import { renderSquare } from "./render";
import type { State } from "./types";
import { getKeyFromPosition, getPositionFromBound, switchPlayer } from "./utils";

export const events = (state: State): State => {
  const { board } = state;
  board.addEventListener('pointerup', (e) => {
    const { clientX: x, clientY: y } = e;
    console.log(state.pieces)
    const position = getPositionFromBound(state)([ y,x])
    
    const key = getKeyFromPosition(position)
    console.log(key)
    if (!state.turn) return;
    state.turn = switchPlayer(state.turn)
    if (state.pieces.get(key) !== 'empty') return;
  
    if (state.turn === 'playerOne') {
      state.pieces.set(key,'o')
    } else {
      state.pieces.set(key,'x')
    }
    console.log(state.pieces)
     renderSquare(state)
  })
 
  return state;
}