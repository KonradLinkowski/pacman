import { createBoard } from './board.js'
import { createPathFinder } from './path.js'

main().catch(console.error)

async function main() {
  const boardString = await fetch('./board.txt').then(res => res.text())
  const { board, render } = createBoard(boardString)
  const canvas = document.querySelector('#game')
  const tileSize = 30
  const ctx = canvas.getContext('2d')
  render(ctx, tileSize)
  const { findPath, renderPath } = createPathFinder(board.clear)
  const path = findPath({ x: 15, y: 15 }, { x: 15, y: 29 })
  renderPath(ctx, path)

}
