import type { Memo } from "./utils";

export const ranks = ['1', '2', '3'] as const;

export const files = ['a', 'b', 'c'] as const;

export type Rank = (typeof ranks)[number]

export type File = (typeof files)[number];

export type Key = `${File}${Rank}`

export type Square = 'empty' 

export type Color = 'white' | 'black' 

export type GameState = 'init' | 'playing' | 'over';

export type PieceValue = Color | Square;


export type Pieces = Map<Key, PieceValue>

export interface State {
  gameState: GameState;
  board: HTMLElement;
  container?: HTMLElement;
  bounds: Memo<DOMRectReadOnly>
}

