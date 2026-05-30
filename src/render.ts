import {
  ranks,
  type Key,
  type Pieces,
  type PieceValue,
  type State,
} from "./types"
import {allKeys, Box, id, memo} from "./utils"

const initPieces = (): Pieces => {
  const pieces: Pieces = new Map()
  allKeys.map((k: Key) => {
    pieces.set(k, "empty")
  })
  return pieces
}
export const init = (): State => {
  const board = document.createElement("board")
  const container = document.createElement("container")

  const bounds = memo(() => container.getBoundingClientRect())
  const state: State = {
    gameState: "init",
    board,
    container,
    bounds: bounds,
    pieces: initPieces(),
    turn: "playerOne",
    totalRanks: ranks.length,
  }

  return state
}

export const render = (state: State): State =>
  Box<State>(state)
    .map(renderContainer)
    .map(renderBoard)
    .map(renderSquare)
    .fold(id)

export const renderContainer = (state: State): State => {
  document.getElementById("app")?.appendChild(state.container)
  return state
}

export const renderBoard = (state: State): State => {
  const {container, board} = state
  container.appendChild(board)
  board.style.gridTemplateColumns = `repeat(3,1fr)`
  board.style.gridTemplateRows = `repeat(3,1fr)`
  board.style.width = `100%`
  board.style.height = `100%`
  return state
}

type SVGAttributeValue = string | number | boolean

type SVGAttributes = Record<string, SVGAttributeValue | null | undefined>

export const setAttributes =
  <T extends SVGElement>(el: T) =>
  (attrs: SVGAttributes): T => {
    for (const [key, value] of Object.entries(attrs)) {
      if (value != null) {
        el.setAttribute(key, String(value))
      }
    }

    return el
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
  Box(document.createElementNS("http://www.w3.org/2000/svg", tag))

const svg = (visible: "hidden" | "visible", className: string) =>
  createSvg("svg")
    .map((svg) =>
      setAttributes(svg)({
        ariaLabel: "X",
        role: "img",
        viewBox: "0 0 128 128",
        style: `visibility:${visible}`,
        class: className,
      }),
    )
    .fold(id)

const renderX = (svg: SVGElement) => {
  svg.appendChild(
    createSvg("line")
      .map((line) => {
        line.classList.add("x-line")
        return line
      })
      .map((path) =>
        setAttributes(path)({
          class: "x1",
          x1: 30,
          y1: 30,
          x2: 90,
          y2: 90,
          style: "stroke: rgb(84, 84, 84)",
        }),
      )
      .fold(id),
  )
  svg.appendChild(
    createSvg("line")
      .map((path) =>
        setAttributes(path)({
          class: "x2",
          x1: 90,
          y1: 30,
          x2: 30,
          y2: 90,
          style: "stroke: rgb(84, 84, 84)",
        }),
      )
      .fold(id),
  )
  return svg
}

export const renderCircle = (svg: SVGElement) => {
  const circle = setAttributes(
    document.createElementNS("http://www.w3.org/2000/svg", "circle"),
  )({
    cx: "60",
    cy: "60",
    r: "40",
    fill: "none",
    stroke: "#f49842",
    "stroke-width": "10",
    strokeLinecap: "round",
    pathLength: "100",
    class: "animated",
  })
  svg.appendChild(circle)
  return svg
}

export const renderSquare = (state: State): State => {
  const {pieces, board, bounds} = state
  board.innerHTML = ""

  for (const [k, v] of pieces) {
    const piece = document.createElement("piece")
    piece.dataset.key = `${k}`
    piece.dataset.value = `${v}`
    const width = `${bounds().width / 3}px`
    const height = `${bounds().height / 3}px`
    piece.id = `key-${k}`
    piece.classList.add("square")

    piece.classList.add("animated")

    piece.style.width = `${width}`
    piece.style.height = `${height}`
    piece.innerHTML = `${k}`
    board.appendChild(piece)
  }

  return state
}

export const reRender = (state: State) => (key: Key, v: PieceValue) => {
  const {board} = state
  const el = board.querySelector(`#key-${key}`)
  if (!el) return
  if (v === "o") el.appendChild(renderCircle(svg("visible", "animated")))
  else if (v === "x") el.appendChild(renderX(svg("visible", "x-line")))
  return state
}
