import type { Memo } from "./utils";

export const ranks = ['1', '2', '3'] as const;

export const files = ['a', 'b', 'c'] as const;

export type Rank = (typeof ranks)[number]

export type File = (typeof files)[number];

export type Key = `${File}${Rank}`

export type Square = 'empty' 

export type Player = 'playerOne' | 'playerTwo' | "none"

export type GameState = 'init' | 'playing' | 'over';

export type PieceValue = "x" | "o" | Square;


export type Turn = Player;

export type Position = [number, number]

export type Pieces = Map<Key, PieceValue>

export interface State {
  gameState: GameState;
  board: HTMLElement;
  container: HTMLElement;
  bounds: Memo<DOMRectReadOnly>;
  pieces: Pieces, 
  turn?:Turn
}

