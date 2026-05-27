import type { Key, Pieces, State } from "./types";
import { allKeys, Box, id, memo } from "./utils";

const initPieces = ():Pieces => {
  const pieces: Pieces = new Map();
  allKeys.map((k: Key) => {
      pieces.set(k,'empty')
  })
  return pieces;

}
export const init = (): State => {
  const board = document.createElement('board')
  const container = document.createElement('container');
  
  const bounds = memo(()=>container.getBoundingClientRect())
  const state: State = {
    gameState: 'init',
    board,
    container,
    bounds: bounds,
    pieces: initPieces(),
    turn:'playerOne'
  };

  return state;
}

export const render = (state: State): State => 
  Box<State>(state).map(renderContainer).map(renderBoard
  ).map(renderSquare).fold(id)


export const renderContainer = (state: State): State => {
  document.getElementById('app')?.appendChild(state.container)
  return state
};

export const renderBoard = (state: State): State => {
  const { container, board } = state;
  container.appendChild(board);
  board.style.gridTemplateColumns = `repeat(3,1fr)`;
  board.style.gridTemplateRows = `repeat(3,1fr)`
  board.style.width = `100%`
  board.style.height = `100%`
  return state;
}

const  setAttributes = (el: SVGElement) =>( attrs: { [key: string]: any }): SVGElement  =>{
  for (const key in attrs) {
    if (Object.prototype.hasOwnProperty.call(attrs, key)) el.setAttribute(key, attrs[key]);
  }
  return el;
}

/**
 * 
 * @param tag 
 * @returns 
 * 
 * <svg jsname="uECznc" aria-label="X" role="img" viewBox="0 0 128 128" style="display: none;">
 * <path class="hFJ9Ve" d="M16,16L112,112" style="stroke: rgb(84, 84, 84);"></path>
 * <path class="hFJ9Ve" d="M112,16L16,112" style="stroke: rgb(84, 84, 84);"></path>
 * </svg>
 */
export const createSvg = (tag: keyof SVGElementTagNameMap) => 
  Box(document.createElementNS('http://www.w3.org/2000/svg', tag))

const svg = (visible: "hidden" | "visible") => createSvg('svg').map(svg => setAttributes(svg)({
  ariaLabel: 'X',
  role: 'img', viewBox: "0 0 128 128", style: `visibility:${visible}`
})).fold(id)

const renderPath = (svg: SVGElement) => {
  svg.appendChild(createSvg('path').map(path => setAttributes(path)({class:'animated', d:`M16,16L112,112`, style:"stroke: rgb(84, 84, 84)"})).fold(id))
    
  svg.appendChild(createSvg('path').map(path => setAttributes(path)({ class: 'animated', d: `M112,16L16,112`, style: "stroke: rgb(84, 84, 84)" })).fold(id))

  return svg;
}

export const renderSquare = (state: State): State => {
  const { pieces, board, bounds } = state;
  board.innerHTML = ''
  let isVisible:'hidden' | 'visible' = 'hidden';
  requestAnimationFrame(() => {
    for (const [k, v] of pieces) {
      const piece = document.createElement('piece')
      piece.dataset.key = `${k}`;
      piece.dataset.value = `${v}`
      const width = `${bounds().width/3}px`;
      const height = `${bounds().height / 3}px`
      piece.id = `key-${k}`
      piece.classList.add('square');
      if(v=='x') isVisible = 'visible'
      piece.appendChild( renderPath(svg('visible')))
      piece.classList.add('animated');
      // piece.classList.add(`value-${v}`)
      piece.style.width = `${width}`
      piece.style.height = `${height}`
      board.appendChild(piece)

    }
  })

  return state;
}